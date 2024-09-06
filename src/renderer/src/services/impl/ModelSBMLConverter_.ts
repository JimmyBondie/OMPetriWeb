import { CustomError } from '@renderer/utils/CustomError'
import { IModelSBMLConverter } from '../intf/IModelSBMLConverter'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { BaseXMLConverter } from './BaseXMLConverter'
import { Function } from '@renderer/core/Function'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { Parameter } from '@renderer/core/Parameter'
import { utils } from '@renderer/utils'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import { Weight } from '@renderer/core/Weight'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { PlaceType } from '@renderer/entity/impl/Place'
import { GraphPlace } from '@renderer/graph/impl/GraphPlace'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { GraphTransition } from '@renderer/graph/impl/GraphTransition'
import { DataType } from '@renderer/data/intf/DataType'
import { ConflictResolutionStrategy } from '@renderer/core/ConflictResolutionStrategy'
import { ArcType } from '@renderer/entity/intf/IArc'
import { DataArc } from '@renderer/data/impl/DataArc'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { GraphArc } from '@renderer/graph/impl/GraphArc'
import { Token } from '@renderer/core/Token'
import i18n from '@renderer/main'
import { IGraphCluster } from '@renderer/graph/intf/IGraphCluster'

export class ModelSBMLConverterError extends CustomError {}

export class ModelSBMLConverter extends BaseXMLConverter implements IModelSBMLConverter {
  readonly tagConflictStrategy: string = 'ConflictStrategy'
  readonly tagConnection: string = 'reaction'
  readonly tagConnectionNode: string = 'speciesReference'
  readonly tagConnectionSources: string = 'listOfReactants'
  readonly tagConnectionTargets: string = 'listOfProducts'
  readonly tagConstant: string = 'constCheck'
  readonly tagCoordinateX: string = 'x_Coordinate'
  readonly tagCoordinateY: string = 'y_Coordinate'
  readonly tagCluster: string = 'coarseNode'
  readonly tagClusterChild: string = 'child'
  readonly tagDisabled: string = 'knockedOut'
  readonly tagFunction: string = 'maximumSpeed'
  readonly tagLabel: string = 'label'
  readonly tagModel: string = 'model'
  readonly tagName: string = 'Name'
  readonly tagNodes: string = 'listOfSpecies'
  readonly tagNode: string = 'species'
  readonly tagParameter: string = 'Parameter'
  readonly tagProbability: string = 'Probability'
  readonly tagPriority: string = 'Priority'
  readonly tagRefAvailable: string = 'hasRef'
  readonly tagRefId: string = 'RefID'
  readonly tagTokenMax: string = 'tokenMax'
  readonly tagTokenMin: string = 'tokenMin'
  readonly tagTokenStart: string = 'tokenStart'
  readonly tagType: string = 'BiologicalElement'
  readonly tagUnit: string = 'Unit'
  readonly tagValue: string = 'Value'
  readonly tagWeight: string = 'Function'

  readonly attrConnectionNodeId: string = 'species'
  readonly attrConstant: string = 'constCheck'
  readonly attrCoordinateX: string = 'x_Coordinate'
  readonly attrCoordinateY: string = 'y_Coordinate'
  readonly attrDisabled: string = 'knockedOut'
  readonly attrFunction: string = 'maximumSpeed'
  readonly attrId: string = 'id'
  readonly attrLabel: string = 'label'
  readonly attrName: string = 'name'
  readonly attrNameParameter: string = 'Name'
  readonly attrRefAvailable: string = 'hasRef'
  readonly attrRefId: string = 'RefID'
  readonly attrTokenMax: string = 'tokenMax'
  readonly attrTokenMin: string = 'tokenMin'
  readonly attrTokenStart: string = 'tokenStart'
  readonly attrType: string = 'BiologicalElement'
  readonly attrUnit: string = 'Unit'
  readonly attrValue: string = 'Value'
  readonly attrWeight: string = 'Function'

  // Creates a cluster containing a list of nodes. If any of the nodes is a
  // cluster itself and is not present in the graph yet, the element will be
  // returned and has to be added again later.
  private addCluster(dao: ModelDAO, elem: Element): Element | null {
    let result: Element | null = null

    const childNodes: Array<IGraphElement> = new Array<IGraphElement>()
    this.readGroup<ModelDAO>(
      dao,
      elem,
      '',
      this.tagClusterChild,
      (dao: ModelDAO, node: Element) => {
        const id: string | null = node.getAttribute(this.attrId)
        if (!result && id && dao.graph.contains(id)) {
          childNodes.push(dao.graph.getNode(id))
        } else {
          result = elem // child node not available, repeat later
        }
      }
    )

    try {
      const cluster: IGraphCluster = this.services.hierarchyService.cluster(
        dao,
        childNodes,
        elem.getAttribute(this.attrId) ?? ''
      )
      cluster.data.labelText = elem.getAttribute(this.attrLabel) ?? ''
      dao.graph.addNode(cluster)
    } catch (e: any) {
      throw new ModelSBMLConverterError(i18n.global.t('CannotCreateCluster', { msg: e.message }))
    }

    return result
  }

  private addConnection(dao: ModelDAO, elem: Element) {
    let type: ArcType | null = null
    let source: IGraphNode | null = null
    let target: IGraphNode | null = null

    this.readGroup<ModelDAO>(
      dao,
      elem,
      this.tagConnectionSources,
      this.tagConnectionNode,
      (_: ModelDAO, node: Element) => {
        source = dao.graph.getNode(node.getAttribute(this.attrConnectionNodeId) ?? '')
      }
    )
    if (!source) {
      throw new ModelSBMLConverterError(i18n.global.t('ArcSourceCannotBeFound'))
    }

    this.readGroup<ModelDAO>(
      dao,
      elem,
      this.tagConnectionTargets,
      this.tagConnectionNode,
      (_: ModelDAO, node: Element) => {
        target = dao.graph.getNode(node.getAttribute(this.attrConnectionNodeId) ?? '')
      }
    )
    if (!target) {
      throw new ModelSBMLConverterError(i18n.global.t('ArcTargetCannotBeFound'))
    }

    const tmp: Element | null = this.calcGroupNode(elem, this.tagType)
    if (tmp) {
      const attribute: string | null = tmp.getAttribute(this.attrType)
      if (attribute && attribute.localeCompare('PN Edge') == 0) {
        type = ArcType.NORMAL
      } else {
        throw new ModelSBMLConverterError(i18n.global.t('UnexpectedArcType', { type: type }))
      }
    }
    if (type == null) {
      throw new ModelSBMLConverterError(i18n.global.t('ArcTypeWasNotSpecified'))
    }

    const arc: DataArc = this.getArc(elem, source, target, type)

    const connection: IGraphArc = new GraphArc(
      this.services.factoryService.getConnectionId(source, target),
      source,
      target,
      arc
    )

    try {
      dao.model.addElement(arc)
    } catch (e: any) {
      throw new ModelSBMLConverterError(e.message)
    }
    dao.graph.addConnection(connection)
  }

  private addNode(
    dao: ModelDAO,
    elem: Element,
    addRefering: boolean,
    idReferenceMap?: Map<string, string>
  ): Element | null {
    let tmp: Element | null
    let typeStrings: Array<string>

    let type: ElementType | null = null
    let data: IDataNode | null = null
    let node: IGraphNode

    const dataId: string = elem.getAttribute(this.attrName) ?? ''
    const nodeId: string = elem.getAttribute(this.attrId) ?? ''

    tmp = this.calcRequiredGroupNode(elem, this.tagType)
    typeStrings = (tmp.getAttribute(this.attrType) ?? '').split(' ')
    if (typeStrings.length > 1) {
      type = ElementType.fromString(typeStrings[1].toUpperCase())
    }

    // Check for reference. If ref available, use associated data for new
    // shape.
    tmp = this.calcGroupNode(elem, this.tagRefAvailable)
    if (tmp && tmp.getAttribute(this.attrRefAvailable) === 'true') {
      tmp = this.calcGroupNode(elem, this.tagRefId)
      if (tmp && addRefering) {
        const refId: string = tmp.getAttribute(this.attrRefId) ?? ''
        if (dao.graph.contains('spec_' + refId)) {
          // get data
          data = dao.graph.getNode('spec_' + refId).data
          if (idReferenceMap) {
            idReferenceMap.set(dataId, data.id)
          } // set reference
        } else {
          throw new ModelSBMLConverterError(
            i18n.global.t('MissingNodeReference', { refId: refId, dataId: dataId, nodeId: nodeId })
          )
        }
      } else {
        return elem
      }
    }

    if (!type || typeStrings.length <= 0) {
      throw new ModelSBMLConverterError(
        i18n.global.t('NodeTypeNotSpecifiedFor', { dataId: dataId, nodeId: nodeId })
      )
    }

    // Constant?
    let constant: boolean = false
    tmp = this.calcGroupNode(elem, this.tagConstant)
    if (tmp) {
      constant = tmp.getAttribute(this.attrConstant) === 'true'
    }

    // Create element and node.
    switch (type) {
      case ElementType.PLACE: {
        if (!data) {
          data = this.getPlace(elem, dataId, PlaceType.fromString(typeStrings[0].toUpperCase()))
          data.constant = constant
          try {
            dao.model.addElement(data)
          } catch (e: any) {
            throw new ModelSBMLConverterError(e.message)
          }
        }
        node = new GraphPlace(nodeId, data as DataPlace)
        break
      }

      case ElementType.TRANSITION: {
        if (!data) {
          data = this.getTransition(
            elem,
            dataId,
            TransitionType.fromString(typeStrings[0].toUpperCase())
          )
          data.constant = constant
          try {
            dao.model.addElement(data)
          } catch (e: any) {
            throw new ModelSBMLConverterError(e.message)
          }
        }
        node = new GraphTransition(nodeId, data as DataTransition)
        break
      }

      default: {
        throw new ModelSBMLConverterError(
          i18n.global.t('UnhandledNodeType', { type: ElementType.toText(type) })
        )
      }
    }

    tmp = this.calcGroupNode(elem, this.tagDisabled)
    if (tmp && tmp.getAttribute(this.attrDisabled) === 'true') {
      data.disabled = true
    }

    dao.graph.addNode(node)

    let label: string = ''
    if (addRefering) {
      if (data.labelText != '') {
        label = data.labelText
      }
    }
    if (label == '') {
      tmp = this.calcGroupNode(elem, this.tagLabel)
      if (tmp) {
        label = tmp.getAttribute(this.attrLabel) ?? ''
      }
    }

    data.labelText = label

    let attribute: string | null
    tmp = this.calcGroupNode(elem, this.tagCoordinateX)
    if (tmp) {
      attribute = tmp.getAttribute(this.attrCoordinateX)
      if (attribute) {
        node.xCoordinate = parseFloat(attribute)
      }
    }

    tmp = this.calcGroupNode(elem, this.tagCoordinateY)
    if (tmp) {
      attribute = tmp.getAttribute(this.attrCoordinateY)
      if (attribute) {
        node.yCoordinate = parseFloat(attribute)
      }
    }

    return null
  }

  private addParameters(dao: ModelDAO, elem: Element) {
    const name: string | null = elem.getAttribute(this.attrName)
    if (!name) {
      return
    }

    const transition: IElement | undefined = dao.model.getElement(name)
    if (!transition) {
      return
    }

    this.readGroup<ModelDAO>(dao, elem, '', this.tagParameter, (dao: ModelDAO, node: Element) => {
      let id: string = ''
      let value: string = ''

      this.readGroup<ModelDAO>(dao, node, '', this.tagName, (_: ModelDAO, child: Element) => {
        id = child.getAttribute(this.attrNameParameter) ?? ''
      })

      this.readGroup<ModelDAO>(dao, node, '', this.tagValue, (_: ModelDAO, child: Element) => {
        value = child.getAttribute(this.attrValue) ?? ''
      })

      const param: Parameter = utils.parameterFactory.createLocalParameter(id, value, transition)

      if (transition.getLocalParameter(id)) {
        throw new ModelSBMLConverterError(
          i18n.global.t('ParameterExistsOnLocalScale', { paramId: param.id })
        )
      } else {
        transition.addLocalParameter(param)
      }
    })
  }

  // Recursively creates clusters for all remaining elements
  private createRemainingClusters(dao: ModelDAO, elements: Array<Element>) {
    const elementsRemaining: Array<Element> = new Array<Element>()

    for (const element of elements) {
      const cluster: Element | null = this.addCluster(dao, element)
      if (cluster) {
        elementsRemaining.push(cluster)
      }
    }

    if (elementsRemaining.length != 0) {
      this.createRemainingClusters(dao, elementsRemaining)
    }
  }

  private getArc(elem: Element, source: IGraphNode, target: IGraphNode, type: ArcType): DataArc {
    const arc: DataArc = new DataArc(
      this.services.factoryService.getArcId(source.data, target.data),
      source.data,
      target.data,
      type
    )

    let place: DataPlace
    if (source.data.type == DataType.PLACE) {
      place = source.data as DataPlace
    } else {
      place = target.data as DataPlace
    }

    let tmp: Element | null
    switch (place.conflictResolutionType) {
      case ConflictResolutionStrategy.PRIORITY: {
        tmp = this.calcGroupNode(elem, this.tagPriority)
        if (tmp) {
          const attribute: string | null = tmp.getAttribute(this.tagPriority)
          if (attribute) {
            arc.conflictResolutionValue = parseFloat(attribute)
          }
        }
        break
      }

      case ConflictResolutionStrategy.PROBABILITY: {
        tmp = this.calcGroupNode(elem, this.tagProbability)
        if (tmp) {
          const attribute: string | null = tmp.getAttribute(this.tagProbability)
          if (attribute) {
            arc.conflictResolutionValue = parseFloat(attribute)
          }
        }
        break
      }

      default: {
        throw new ModelSBMLConverterError(i18n.global.t('UnhandledConflictResolutionType'))
      }
    }

    if (source.data.disabled || target.data.disabled) {
      arc.disabled = true
    }

    tmp = this.calcGroupNode(elem, this.tagWeight)
    if (tmp) {
      arc.addWeight(this.getWeight(tmp))
    }

    return arc
  }

  private getPlace(elem: Element, id: string, type: PlaceType): DataPlace {
    const place: DataPlace = new DataPlace(id, type)
    const tmp: Element | null = this.calcGroupNode(elem, this.tagConflictStrategy)

    if (tmp) {
      switch (tmp.getAttribute(this.tagConflictStrategy)) {
        case '0': {
          // none (default = priority in 1.12.0)
          place.conflictResolutionType = ConflictResolutionStrategy.PRIORITY
          break
        }

        case '1': {
          // prio
          place.conflictResolutionType = ConflictResolutionStrategy.PRIORITY
          break
        }

        case '2': {
          // prob
          place.conflictResolutionType = ConflictResolutionStrategy.PROBABILITY
          break
        }

        default: {
          throw new ModelSBMLConverterError(i18n.global.t('UnhandledConflictResolutionStrategy'))
        }
      }
    }

    place.addToken(this.getToken(elem))

    return place
  }

  private getToken(elem: Element): Token {
    const token: Token = new Token(this.services.factoryService.colorDefault)

    let attribute: string | null
    let tmp: Element | null = this.calcGroupNode(elem, this.tagTokenStart)
    if (tmp) {
      attribute = tmp.getAttribute(this.attrTokenStart)
      if (attribute) {
        token.valueStart = parseFloat(attribute)
      }
    }

    tmp = this.calcGroupNode(elem, this.tagTokenMin)
    if (tmp) {
      attribute = tmp.getAttribute(this.attrTokenMin)
      if (attribute) {
        token.valueMin = parseFloat(attribute)
      }
    }

    tmp = this.calcGroupNode(elem, this.tagTokenMax)
    if (tmp) {
      attribute = tmp.getAttribute(this.attrTokenMax)
      if (attribute) {
        token.valueMax = parseFloat(attribute)
      }
    }

    return token
  }

  private getTransition(elem: Element, id: string, type: TransitionType): DataTransition {
    const transition: DataTransition = new DataTransition(id, type)

    const tmp: Element | null = this.calcGroupNode(elem, this.tagFunction)
    if (tmp) {
      const functionString: string = tmp.getAttribute(this.attrFunction) ?? ''
      transition.function = utils.functionFactory.build(functionString)
    }

    return transition
  }

  private getWeight(elem: Element): Weight {
    const weight: Weight = new Weight(this.services.factoryService.colorDefault)
    weight.function = utils.functionFactory.build(elem.getAttribute(this.attrWeight) ?? '1')
    return weight
  }

  public importSBML(content: string): ModelDAO {
    const xmlDoc: XMLDocument = this.parser.parseFromString(content, 'text/xml')
    let dao: ModelDAO = this.readModelData(xmlDoc)

    let elems: Array<Element>
    const idReferenceMap: Map<string, string> = new Map<string, string>()

    // Nodes and Shapes
    let elem: Element | null
    elems = new Array<Element>()
    this.readGroup<ModelDAO>(
      dao,
      xmlDoc,
      this.tagNodes,
      this.tagNode,
      (dao: ModelDAO, node: Element) => {
        elem = this.addNode(dao, node, false)
        if (elem) {
          elems.push(elem)
        }
      }
    )
    for (const e of elems) {
      // referencing nodes
      this.addNode(dao, e, true, idReferenceMap)
    }

    // Arcs
    this.readGroup<ModelDAO>(dao, xmlDoc, '', this.tagConnection, this.addConnection)

    // Parameters
    this.readGroup<ModelDAO>(dao, xmlDoc, this.tagNodes, this.tagNode, this.addParameters)

    // Validate transition functions, set parameter relations.
    for (const transition of dao.model.transitions) {
      for (const functionElem of transition.function.elements) {
        const reference: string | undefined = idReferenceMap.get(functionElem.value)
        if (reference) {
          functionElem.value = reference
        }
      }
      const functionString: string = transition.function.formatString()
      const functionValue: Function = this.services.parameterService.validateAndGetFunction(
        dao.model,
        transition,
        functionString
      )
      this.services.parameterService.setElementFunction(dao.model, transition, functionValue)
    }

    /**
     * Clustering.
     */
    elems = new Array<Element>()
    this.readGroup<ModelDAO>(dao, xmlDoc, '', this.tagCluster, (dao: ModelDAO, node: Element) => {
      elem = this.addCluster(dao, node)
      if (elem) {
        elems.push(elem)
      }
    })
    this.createRemainingClusters(dao, elems)

    dao = this.services.modelService.addModel(dao)
    return dao
  }

  private readModelData(doc: Document): ModelDAO {
    const dao: ModelDAO = this.services.factoryService.createDao()
    const nodes: HTMLCollectionOf<Element> = doc.getElementsByTagName(this.tagModel)
    if (nodes.length >= 1) {
      const model: Element | null = nodes.item(0)
      if (model && model.nodeType == Node.ELEMENT_NODE) {
        dao.author = ''
        dao.name = model.getAttribute(this.attrId) ?? ''
      } else {
        throw new ModelSBMLConverterError(i18n.global.t('ImportFailedMalformedModel'))
      }
    } else if (nodes.length == 0) {
      throw new ModelSBMLConverterError(i18n.global.t('ImportFailedNoModel'))
    } else {
      throw new ModelSBMLConverterError(i18n.global.t('ImportFailedMoreThanOneModel'))
    }
    return dao
  }
}
