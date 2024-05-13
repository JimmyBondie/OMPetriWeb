import { Guid } from 'guid-typescript'
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
import { ParameterException } from './ParameterService'
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { ArcType } from '@renderer/entity/intf/IArc'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { PlaceType } from '@renderer/entity/impl/Place'

export class ModelService extends CustomService implements IModelService {
  private readonly DEFAULT_COLOR: Color = new Color('WHITE', 'Default color')

  private _models: Array<ModelDAO> = new Array<ModelDAO>()

  public get models(): Array<ModelDAO> {
    return this._models
  }

  public addArc(dao: ModelDAO, arc: IGraphArc) {
    if (arc && arc.data && arc.data.type != DataType.CLUSTERARC) {
      dao.model.addElement(arc.data)
    }
    dao.graph.addConnection(arc)
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
    dao.graph.addNode(node)
  }

  public connect(dao: ModelDAO, source: IGraphNode, target: IGraphNode): IGraphArc {
    const arc: IGraphArc = this.services.factoryService.createConnection(source, target)
    this.validateConnection(source, target)
    this.validateArc(arc.data)
    this.addArc(dao, arc)
    dao.hasChanges = true
    return arc
  }

  public create(dao: ModelDAO, type: DataType, posX: number, posY: number): IGraphNode {
    const node: IGraphNode = this.services.factoryService.createNode(dao, type, posX, posY)
    this.addNode(dao, node)
    dao.hasChanges = true
    return node
  }

  public newModel(): ModelDAO {
    const dao: ModelDAO = new ModelDAO(Guid.create().toString())
    dao.name = i18n.global.t('Untitled')
    dao.model.addColor(this.DEFAULT_COLOR)
    dao.hasChanges = true
    this._models.push(dao)
    return dao
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

  public removeModel(model: ModelDAO) {
    const index = this._models.indexOf(model)
    if (index >= 0) {
      this._models.splice(index, 1)
    }
  }

  private removeNode(dao: ModelDAO, node: IGraphNode) {
    this.validateNodeRemoval(node)
    try {
      let arc: IGraphArc
      while (node.connections.size > 0) {
        arc = node.connections.values().next().value
        this.removeArcShape(dao, arc)
        this.removeData(dao, arc.data)
      }

      this.removeNodeShape(dao, node)
      this.removeData(dao, node.data)
      dao.hasChanges = true
    } catch (e: any) {
      throw new DataException(e.message)
    }
  }

  private removeArcShape(dao: ModelDAO, arc: IGraphArc) {
    dao.graph.removeConnection(arc)
    arc.data.shapes.delete(arc)
  }

  private removeNodeShape(dao: ModelDAO, node: IGraphNode) {
    dao.graph.removeNode(node)
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
            i18n.global.t('ValidationForArcTypeUndefined', { type: ArcType.toString(arc.arcType) })
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
                    type: PlaceType.toString(place.placeType)
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
              type: TransitionType.toString(transition.transitionType)
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
              throw new DataException(
                i18n.global.t('CannotConnectDiscretePlaceAndContinuousTransition')
              )
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
                  type: TransitionType.toString(transition.transitionType)
                })
              )
            }
          }
          break
        }

        default: {
          throw new DataException(
            i18n.global.t('ValidationForPlaceTypeUndefined', {
              type: PlaceType.toString(place.placeType)
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
