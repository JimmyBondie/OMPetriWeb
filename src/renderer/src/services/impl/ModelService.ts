import i18n from '@renderer/main'
import { Color } from '@renderer/core/Color'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IModelService } from '../intf/IModelService'
import { CustomService } from '../intf'
import { IElement } from '@renderer/entity/intf/IElement'
import { DataType } from '@renderer/data/intf/DataType'
import { GraphArc } from '@renderer/graph/impl/GraphArc'
import { ModelError } from '@renderer/core/Model'
import { Function } from '@renderer/core/Function'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { DataException } from './Exceptions'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { ParameterException } from './Exceptions'
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { ArcType } from '@renderer/entity/intf/IArc'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { PlaceType } from '@renderer/entity/impl/Place'
import { ReferenceType } from '@renderer/core/Parameter/ReferencingParameter'
import { utils } from '@renderer/utils'
import { DataArc } from '@renderer/data/impl/DataArc'
import { GraphCluster } from '@renderer/graph/impl/GraphCluster'
import { Graph } from '@renderer/graph/Graph'
import { DataCluster } from '@renderer/data/impl/DataCluster'
import { GraphNode } from '@renderer/graph/impl/GraphNode'

export class ModelService extends CustomService implements IModelService {
  private _models: Array<ModelDAO> = new Array<ModelDAO>()

  public get models(): Array<ModelDAO> {
    return this._models
  }

  public addArc(dao: ModelDAO, arc: IGraphArc) {
    if (arc.data && arc.data.type != DataType.CLUSTERARC) {
      dao.model.addElement(arc.data)
    }
    this.getGraph(dao, arc).addConnection(arc)
  }

  public addElement(dao: ModelDAO, element: IElement) {
    dao.model.addElement(element)
  }

  public addModel(newModel: ModelDAO): ModelDAO {
    const model: ModelDAO | undefined = this._models.find((model: ModelDAO) => {
      return model && model.id == newModel.id
    })

    if (model) {
      return model
    } else {
      this._models.push(newModel)
      return newModel
    }
  }

  public addNode(dao: ModelDAO, node: IGraphNode) {
    if (node && node.data && node.data.type != DataType.CLUSTER) {
      dao.model.addElement(node.data)
    }
    this.getGraph(dao, node).addNode(node)
  }

  public changeArcType(dao: ModelDAO, arc: DataArc, type: ArcType) {
    const typeOld: ArcType = arc.arcType
    arc.arcType = type
    try {
      this.validateArc(arc)
    } catch (e: any) {
      if (e instanceof DataException) {
        arc.arcType = typeOld
      }
      throw e
    }
    dao.hasChanges = true
  }

  public changeElementId(
    dao: ModelDAO,
    element: IDataElement,
    elementIdNew: string,
    reverse?: boolean
  ) {
    const elementIdOld: string = element.id
    let arcIdNew: string

    if (elementIdNew.localeCompare(elementIdOld) == 0) {
      return
    }

    try {
      // Validate ID
      this.validateChangingElementId(dao, element, elementIdNew)

      // Update ID
      dao.model.changeId(element, elementIdNew)
      this.services.parameterService.updateRelatedParameterIds(element, elementIdNew)

      if (element instanceof DataPlace || element instanceof DataTransition) {
        const node: IDataNode = element as IDataNode

        // Validate IDs for related arcs
        try {
          for (const arc of node.arcsIn) {
            arcIdNew = this.services.factoryService.getArcId(arc.source, arc.target)
            this.validateChangingElementId(dao, arc, arcIdNew)
          }

          for (const arc of node.arcsOut) {
            arcIdNew = this.services.factoryService.getArcId(arc.source, arc.target)
            this.validateChangingElementId(dao, arc, arcIdNew)
          }
        } catch (e: any) {
          if (e instanceof DataException) {
            throw new DataException(i18n.global.t('RelatedIDAlreadyInUse'))
          }
        }

        // Change IDs for related arcs
        for (const arc of node.arcsIn) {
          if (arc.id.match('.+_' + elementIdOld)) {
            arcIdNew = this.services.factoryService.getArcId(arc.source, arc.target)

            dao.model.changeId(arc, arcIdNew)
            this.services.parameterService.updateRelatedParameterIds(arc, arcIdNew)
          }
        }

        for (const arc of node.arcsOut) {
          if (arc.id.match(elementIdOld + '_.+')) {
            arcIdNew = this.services.factoryService.getArcId(arc.source, arc.target)

            dao.model.changeId(arc, arcIdNew)
            this.services.parameterService.updateRelatedParameterIds(arc, arcIdNew)
          }
        }
      }
    } catch (e: any) {
      if (e instanceof Error) {
        try {
          if (!reverse) {
            this.changeElementId(dao, element, elementIdOld, true)
          }
        } catch (exFatal: any) {
          throw new DataException(i18n.global.t('ConflictChangingIDNoRevoke'), exFatal)
        }
        throw new DataException(e.message)
      }
    }
  }

  public changePlaceType(dao: ModelDAO, place: DataPlace, type: PlaceType) {
    const typeOld: PlaceType = place.placeType
    place.placeType = type
    try {
      for (const arc of place.arcsIn) {
        this.validateArc(arc as IDataArc)
      }
      for (const arc of place.arcsOut) {
        this.validateArc(arc as IDataArc)
      }
    } catch (e: any) {
      if (e instanceof DataException) {
        place.placeType = typeOld
      }
      throw e
    }
    dao.hasChanges = true
  }

  public changeTransitionType(dao: ModelDAO, transition: DataTransition, type: TransitionType) {
    const typeOld: TransitionType = transition.transitionType
    transition.transitionType = type
    try {
      for (const arc of transition.arcsIn) {
        this.validateArc(arc as IDataArc)
      }
      for (const arc of transition.arcsOut) {
        this.validateArc(arc as IDataArc)
      }
    } catch (e: any) {
      if (e instanceof DataException) {
        transition.transitionType = typeOld
      }
      throw e
    }
    dao.hasChanges = true
  }

  public connect(dao: ModelDAO, source: IGraphNode, target: IGraphNode): IGraphArc {
    if (source.parentCluster != target.parentCluster) {
      throw new DataException(i18n.global.t('CannotConnectDifferentClusters'))
    }
    const arc: IGraphArc = this.services.factoryService.createConnection(source, target)
    arc.parentCluster = source.parentCluster
    this.validateConnection(source, target)
    this.validateArc(arc.data)
    this.addArc(dao, arc)
    dao.hasChanges = true
    return arc
  }

  public create(
    dao: ModelDAO,
    cluster: DataCluster | null,
    type:
      | { dataType: DataType.PLACE; elemType: PlaceType }
      | { dataType: DataType.TRANSITION; elemType: TransitionType },
    posX: number,
    posY: number
  ): IGraphNode {
    const node: IGraphNode = this.services.factoryService.createNode(dao, type, posX, posY)
    node.parentCluster = cluster
    this.addNode(dao, node)
    dao.hasChanges = true
    return node
  }

  private getGraph(dao: ModelDAO, node: IGraphElement): Graph {
    if (node.parentCluster) {
      return node.parentCluster.graph
    } else {
      return dao.graph
    }
  }

  public newModel(): ModelDAO {
    const dao: ModelDAO = this.services.factoryService.createDao()
    dao.hasChanges = true
    this._models.push(dao)
    return dao
  }

  public paste(dao: ModelDAO, nodes: Array<IGraphNode>, cut: boolean): Array<IGraphNode> {
    const shapes: Array<IGraphNode> = new Array<IGraphNode>()
    let shape: IGraphNode | undefined
    for (const node of nodes) {
      if (cut) {
        shape = node
      } else {
        shape = this.services.factoryService.copy(dao, node)
        if (!shape) {
          continue
        }
        this.addNode(dao, shape)
      }

      shape.position.x = node.position.x + 50
      shape.position.y = node.position.y + 50

      shapes.push(shape)
    }

    dao.hasChanges = true
    return shapes
  }

  private removeArc(dao: ModelDAO, arc: IGraphArc) {
    this.validateArcRemoval(arc)
    this.removeArcShape(dao, arc)
    try {
      this.removeData(dao, arc.data)
    } catch (e: any) {
      throw new DataException(e.message)
    }
    dao.hasChanges = true
  }

  private removeData(dao: ModelDAO, element: IDataElement) {
    if (element.shapes.size == 0) {
      dao.model.removeElement(element)
    }
  }

  public removeElement(dao: ModelDAO, element: IGraphElement) {
    if (element instanceof GraphArc) {
      this.removeArc(dao, element)
    } else {
      this.removeNode(dao, element as IGraphNode)
    }
  }

  public removeElements(dao: ModelDAO, elements: Array<IGraphElement>) {
    const errors: Array<Error> = new Array<Error>()

    for (const element of elements) {
      try {
        if (element instanceof GraphArc) {
          this.removeArc(dao, element)
        } else {
          this.removeNode(dao, element as GraphNode)
        }
      } catch (e: any) {
        errors.push(e)
      }
    }
    dao.hasChanges = true
    if (errors.length > 0) {
      let msg: string = ''
      for (const error of errors) {
        msg += error.message + '\n'
      }
      throw new ModelError(msg)
    }
  }

  public removeModel(model: ModelDAO) {
    const index = this._models.indexOf(model)
    if (index >= 0) {
      this._models.splice(index, 1)
    }
  }

  private removeNode(dao: ModelDAO, node: IGraphNode) {
    this.validateNodeRemoval(node)
    try {
      let arc: IGraphArc | undefined
      while (node.connections.size > 0) {
        arc = node.connections.values().next().value
        if (arc) {
          this.removeArcShape(dao, arc)
          this.removeData(dao, arc.data)
        }
      }

      this.removeNodeShape(dao, node)
      this.removeData(dao, node.data)
      dao.hasChanges = true
    } catch (e: any) {
      throw new DataException(e.message)
    }
  }

  private removeArcShape(dao: ModelDAO, arc: IGraphArc) {
    this.getGraph(dao, arc).removeConnection(arc)
    arc.data.shapes.delete(arc)
  }

  private removeNodeShape(dao: ModelDAO, node: IGraphNode) {
    node.parentCluster
    this.getGraph(dao, node).removeNode(node)
    node.data.shapes.delete(node)
  }

  public setElementFunction(dao: ModelDAO, element: IElement, func: Function, color?: Color) {
    try {
      this.services.parameterService.setElementFunction(dao.model, element, func, color)
      dao.hasChanges = true
    } catch (e: any) {
      throw new ModelError(e.message)
    }
  }

  private validateArc(arc: IDataArc) {
    let place: DataPlace
    let transition: DataTransition

    if (DataType.PLACE == arc.target.type) {
      switch (arc.arcType) {
        case ArcType.NORMAL: {
          break
        }
        case ArcType.INHIBITORY: {
          throw new DataException(i18n.global.t('TransitionCannotInhibitPlace'))
        }
        case ArcType.TEST: {
          throw new DataException(i18n.global.t('TransitionCannotTestPlace'))
        }
        default: {
          throw new DataException(
            i18n.global.t('ValidationForArcTypeUndefined', { type: ArcType.toText(arc.arcType) })
          )
        }
      }

      transition = arc.source as DataTransition
      place = arc.target as DataPlace

      switch (
        transition.transitionType // source
      ) {
        case TransitionType.CONTINUOUS:
          {
            switch (
              place.placeType // target
            ) {
              case PlaceType.CONTINUOUS: {
                break
              }
              case PlaceType.DISCRETE: {
                throw new DataException(
                  i18n.global.t('CannotConnectContinuousTransitionAndDiscretePlace')
                )
              }
              default: {
                throw new DataException(
                  i18n.global.t('ValidationForPlaceTypeUndefined', {
                    type: PlaceType.toText(place.placeType)
                  })
                )
              }
            }
          }
          break

        case TransitionType.DISCRETE: {
          break
        }

        case TransitionType.STOCHASTIC: {
          break
        }

        default: {
          throw new DataException(
            i18n.global.t('ValidationForTransitionTypeUndefined', {
              type: TransitionType.toText(transition.transitionType)
            })
          )
        }
      }
    } else {
      place = arc.source as DataPlace
      transition = arc.target as DataTransition

      switch (
        place.placeType // source
      ) {
        case PlaceType.CONTINUOUS: {
          break
        }

        case PlaceType.DISCRETE: {
          switch (
            transition.transitionType // target
          ) {
            case TransitionType.CONTINUOUS: {
              if (arc.arcType == ArcType.NORMAL) {
                throw new DataException(
                  i18n.global.t('CannotConnectDiscretePlaceAndContinuousTransition')
                )
              } else {
                break
              }
            }
            case TransitionType.DISCRETE: {
              break
            }
            case TransitionType.STOCHASTIC: {
              break
            }
            default: {
              throw new DataException(
                i18n.global.t('ValidationForTransitionTypeUndefined', {
                  type: TransitionType.toText(transition.transitionType)
                })
              )
            }
          }
          break
        }

        default: {
          throw new DataException(
            i18n.global.t('ValidationForPlaceTypeUndefined', {
              type: PlaceType.toText(place.placeType)
            })
          )
        }
      }
    }
  }

  private validateArcRemoval(arc: IGraphArc) {
    const data: IDataArc = arc.data
    if (data.type == DataType.CLUSTER) {
      throw new DataException(i18n.global.t('CannotDeleteClusterArc'))
    }
    if (data.shapes.size <= 1) {
      try {
        this.services.parameterService.validateElementRemoval(data)
      } catch (e: any) {
        if (e instanceof ParameterException) {
          throw new DataException(e.message)
        }
      }
    }
  }

  private validateChangingElementId(dao: ModelDAO, element: IElement, elementIdNew: string) {
    let paramIdNew: string
    let referenceType: ReferenceType | null

    this.validateIdAvailable(dao, elementIdNew)

    if (element.getLocalParameter(elementIdNew)) {
      throw new DataException(i18n.global.t('IDAlreadyAssignedToParameter'))
    }

    for (const param of element.relatedParameters) {
      referenceType = utils.parameterFactory.recoverReferenceTypeFromParameterValue(param.value)
      if (!referenceType) {
        continue
      }

      paramIdNew = utils.parameterFactory.generateIdForReferencingParameter(
        elementIdNew,
        referenceType
      )

      this.validateIdAvailable(dao, paramIdNew)
    }
  }

  private validateConnection(source: IGraphNode, target: IGraphNode) {
    const dataSource: IDataNode = source.data
    const dataTarget: IDataNode = target.data

    let relatedSourceShape: IGraphNode
    let relatedSourceShapeChild: IGraphNode

    /**
     * Ensuring the connection to be valid.
     */
    if (source.data.type == target.data.type) {
      throw new DataException(i18n.global.t('CannotConnectSameType'))
    }
    if (source instanceof GraphCluster || target instanceof GraphCluster) {
      throw new DataException('Cannot create connection to a cluster from the outside.')
    }
    if (source.children.has(target) || target.parents.has(source)) {
      throw new DataException(i18n.global.t('NodesAlreadyConnected'))
    }
    for (const relatedSourceElement of dataSource.shapes) {
      relatedSourceShape = relatedSourceElement as IGraphNode
      for (const shape of relatedSourceShape.children) {
        relatedSourceShapeChild = shape as IGraphNode
        if (dataTarget == relatedSourceShapeChild.data) {
          throw new DataException(i18n.global.t('NodesAlreadyConnectedByRelatedElement'))
        }
      }
    }
  }

  private validateIdAvailable(dao: ModelDAO, id: string) {
    if (dao.model.containsElement(id)) {
      throw new DataException(i18n.global.t('IDAlreadyUsedByElement', { id: id }))
    }
    if (dao.model.containsParameter(id)) {
      throw new DataException(i18n.global.t('IDAlreadyUsedByParameter'))
    }
  }

  private validateNodeRemoval(node: IGraphNode) {
    const data: IDataNode = node.data
    if (data.type == DataType.CLUSTER) {
      throw new DataException(i18n.global.t('CannotDeleteCluster'))
    }
    for (const connection of node.connections) {
      this.validateArcRemoval(connection)
    }
    if (data.shapes.size <= 1) {
      try {
        this.services.parameterService.validateElementRemoval(data)
      } catch (e: any) {
        if (e instanceof ParameterException) {
          throw new DataException(e.message)
        }
      }
    }
  }
}
