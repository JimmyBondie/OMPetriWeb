import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IModelXmlConverter } from '../intf/IModelXmlConverter'
import i18n from '@renderer/main'
import { Color } from '@renderer/core/Color'
import { DateTime } from 'luxon'
import { Place, PlaceType } from '@renderer/entity/impl/Place'
import { ConflictResolutionStrategy } from '@renderer/core/ConflictResolutionStrategy'
import { Token } from '@renderer/core/Token'
import { Transition, TransitionType } from '@renderer/entity/impl/Transition'
import { Function } from '@renderer/core/Function'
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import { IElement } from '@renderer/entity/intf/IElement'
import { utils } from '@renderer/utils'
import { CustomError } from '@renderer/utils/CustomError'
import { ArcType } from '@renderer/entity/intf/IArc'
import { INode } from '@renderer/entity/intf/INode'
import { Weight } from '@renderer/core/Weight'
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { DataArc } from '@renderer/data/impl/DataArc'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { DataPlace } from '@renderer/data/impl/DataPlace'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { DataType } from '@renderer/data/intf/DataType'
import { GraphPlace } from '@renderer/graph/impl/GraphPlace'
import { GraphTransition } from '@renderer/graph/impl/GraphTransition'
import { GraphArc } from '@renderer/graph/impl/GraphArc'
import { Arc } from '@renderer/entity/impl/Arc'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { Graph } from '@renderer/graph/Graph'
import { BaseXmlConverter } from './BaseXmlConverter'
import { IGraphCluster } from '@renderer/graph/intf/IGraphCluster'
import { DataClusterArc } from '@renderer/data/impl/DataClusterArc'

export class ModelXmlConverterError extends CustomError {}

export class ModelXmlConverter extends BaseXmlConverter implements IModelXmlConverter {
  private readonly formatDateTime: string = 'yy-MM-dd HH:mm:ss'

  private readonly attrAuthor: string = 'author'
  private readonly attrColorId: string = 'colourId'
  private readonly attrConflictResolutionStrategy: string = 'conflictStrategy'
  private readonly attrConflictResolutionValue: string = 'conflictValue'
  private readonly attrConstant: string = 'constant'
  private readonly attrCurrentClusterId: string = 'currentClusterId'
  private readonly attrCurrentNodeId: string = 'currentNodeId'
  private readonly attrCurrentPlaceId: string = 'currentPlaceId'
  private readonly attrCurrentTransitionId: string = 'currentTransitionId'
  private readonly attrCreationDateTime: string = 'creationDateTime'
  private readonly attrDescription: string = 'description'
  private readonly attrDisabled: string = 'disabled'
  private readonly attrElementId: string = 'elementId'
  private readonly attrId: string = 'id'
  private readonly attrLabel: string = 'label'
  private readonly attrMax: string = 'max'
  private readonly attrMin: string = 'min'
  private readonly attrName: string = 'name'
  private readonly attrUnit: string = 'unit'
  private readonly attrPosX: string = 'posX'
  private readonly attrPosY: string = 'posY'
  private readonly attrSource: string = 'source'
  private readonly attrStart: string = 'start'
  private readonly attrSticky: string = 'sticky'
  private readonly attrTarget: string = 'target'
  private readonly attrType: string = 'type'

  private readonly tagArc: string = 'Arc'
  private readonly tagArcs: string = 'Arcs'
  private readonly tagCluster: string = 'Cluster'
  private readonly tagClusters: string = 'Clusters'
  private readonly tagColor: string = 'Colour'
  private readonly tagColors: string = 'Colours'
  private readonly tagConnection: string = 'Connection'
  private readonly tagFunction: string = 'Function'
  private readonly tagGraph: string = 'Graph'
  private readonly tagModel: string = 'Model'
  private readonly tagNode: string = 'Node'
  private readonly tagNodes: string = 'Nodes'
  private readonly tagNodeShapes: string = 'Nodes'
  private readonly tagParameter: string = 'Parameter'
  private readonly tagParameters: string = 'Parameters'
  private readonly tagParametersLocal: string = 'LocalParameters'
  private readonly tagPlace: string = 'Place'
  private readonly tagPlaces: string = 'Places'
  private readonly tagShapes: string = 'Shapes'
  private readonly tagToken: string = 'Token'
  private readonly tagTokens: string = 'Tokens'
  private readonly tagTransition: string = 'Transition'
  private readonly tagTransitions: string = 'Transitions'
  private readonly tagWeight: string = 'Weight'
  private readonly tagWeights: string = 'Weights'

  public importXML(content: string): ModelDAO {
    const xmlDoc: XMLDocument = this.parser.parseFromString(content, 'text/xml')
    const root: Element = this.calcRequiredGroupNode(xmlDoc, this.tagModel)
    let dao: ModelDAO = this.readModelData(root)

    // Colors
    this.readGroup<ModelDAO>(dao, root, this.tagColors, this.tagColor, this.readColor)

    // Places
    this.readGroup<ModelDAO>(dao, root, this.tagPlaces, this.tagPlace, this.readPlace)

    // Transitions
    this.readGroup<ModelDAO>(
      dao,
      root,
      this.tagTransitions,
      this.tagTransition,
      this.readTransition
    )

    // Arcs
    this.readGroup<ModelDAO>(dao, root, this.tagArcs, this.tagArc, this.readArc)

    // Parameters
    this.readGroup<ModelDAO>(dao, root, this.tagParameters, this.tagParameter, (dao, node) => {
      const element: IElement | undefined = dao.model.getElement(
        node.getAttribute(this.attrElementId) ?? ''
      )
      if (element) {
        this.services.parameterService.add(dao.model, this.readParameter(element, node))
      }
    })

    // Graph
    this.readGroup<[ModelDAO, Element | undefined]>(
      [dao, undefined],
      root,
      '',
      this.tagGraph,
      ([dao, clusterElement]: [ModelDAO, Element | undefined], node: Element) => {
        if (node.parentElement == root) {
          this.readGraph([dao, clusterElement], node)
        }
      }
    )

    dao = this.services.modelService.addModel(dao)
    return dao
  }

  private readArc(dao: ModelDAO, node: Element) {
    const source: IElement | undefined = dao.model.getElement(
      node.getAttribute(this.attrSource) ?? ''
    )
    const target: IElement | undefined = dao.model.getElement(
      node.getAttribute(this.attrTarget) ?? ''
    )

    if (!source || !target) {
      return
    }
    const arc: IDataArc = new DataArc(
      this.readId(node),
      source as INode,
      target as INode,
      ArcType.fromString(node.getAttribute(this.attrType))
    )

    // Weights
    this.readGroup<ModelDAO>(dao, node, this.tagWeights, this.tagWeight, (dao, node) => {
      arc.addWeight(this.readWeight(dao, node))
    })

    // Shapes
    this.readGroup<ModelDAO>(dao, node, this.tagShapes, this.tagConnection, (dao, node) => {
      const source: IGraphNode = dao.graph.getNode(node.getAttribute(this.attrSource) ?? '')
      const target: IGraphNode = dao.graph.getNode(node.getAttribute(this.attrTarget) ?? '')
      const graphArc: GraphArc = new GraphArc(this.readId(node), source, target, arc)
      this.services.modelService.addArc(dao, graphArc)
    })

    arc.disabled = node.hasAttribute(this.attrDisabled)

    arc.labelText = node.getAttribute(this.attrLabel) ?? ''

    const attribute: string | null = node.getAttribute(this.attrConflictResolutionValue)
    if (attribute) {
      arc.conflictResolutionValue = Number.parseFloat(attribute)
    }

    arc.description = node.getAttribute(this.attrDescription) ?? ''

    this.services.modelService.addElement(dao, arc)
  }

  private readColor(dao: ModelDAO, node: Element) {
    dao.model.addColor(new Color(this.readId(node), node.getAttribute(this.attrDescription) ?? ''))
  }

  private readFunction(node: Element): Function {
    const nodes: HTMLCollectionOf<Element> = node.getElementsByTagName(this.tagFunction)
    if (nodes.length != 0) {
      for (const node of nodes) {
        if (node.nodeType == Node.ELEMENT_NODE) {
          return utils.functionFactory.build(node.textContent ?? '1')
        }
      }
    }
    return utils.functionFactory.build('1')
  }

  private readGraph(
    [dao, clusterElement]: [ModelDAO, Element | undefined],
    graphElement: Element
  ): Array<IGraphElement> {
    let nodeElements: Element | null = null
    let clusterElements: Element | null = null

    this.readGroup<ModelDAO>(dao, graphElement, '', this.tagNodes, (_: ModelDAO, node: Element) => {
      if (node.parentElement == graphElement) {
        nodeElements = node
      }
    })

    this.readGroup<ModelDAO>(
      dao,
      graphElement,
      '',
      this.tagClusters,
      (_: ModelDAO, node: Element) => {
        if (node.parentElement == graphElement) {
          clusterElements = node
        }
      }
    )

    // Recursively create subgraphs.
    const nodes: Array<IGraphElement> = new Array<IGraphElement>()
    if (clusterElements) {
      this.readGroup<ModelDAO>(
        dao,
        clusterElements,
        '',
        this.tagCluster,
        (dao: ModelDAO, clusterChildElement: Element) => {
          this.readGroup<ModelDAO>(
            dao,
            clusterChildElement,
            '',
            this.tagGraph,
            (dao: ModelDAO, node: Element) => {
              nodes.push(...this.readGraph([dao, clusterChildElement], node))
            }
          )
        }
      )
    }

    // Cluster the related nodes
    if (nodeElements) {
      this.readGroup<ModelDAO>(
        dao,
        nodeElements,
        '',
        this.tagNode,
        (dao: ModelDAO, graphElement: Element) => {
          const graphNode: IGraphNode = dao.graph.getNode(this.readId(graphElement))
          let attribute: string | null = graphElement.getAttribute(this.attrPosX)
          if (attribute) {
            graphNode.xCoordinate = Number.parseFloat(attribute)
          }

          attribute = graphElement.getAttribute(this.attrPosY)
          if (attribute) {
            graphNode.yCoordinate = Number.parseFloat(attribute)
          }

          nodes.push(graphNode)
        }
      )
    }

    if (clusterElement) {
      const cluster: IGraphCluster = this.services.hierarchyService.cluster(
        dao,
        nodes,
        this.readId(clusterElement)
      )
      cluster.data.description = clusterElement.getAttribute(this.attrDescription) ?? ''
      cluster.data.labelText = clusterElement.getAttribute(this.attrLabel) ?? ''
    } else {
      // no cluster is created for the root graph
      return []
    }

    return nodes
  }

  private readId(node: Element): string {
    let attribute: string | null = node.getAttribute(this.attrId)
    if (attribute) {
      return attribute
    } else {
      throw new ModelXmlConverterError(
        i18n.global.t('ImportFailedNoElementId', { element: node.tagName })
      )
    }
  }

  private readModelData(root: Element): ModelDAO {
    const dao: ModelDAO = new ModelDAO(this.readId(root))

    // author
    dao.author = root.getAttribute(this.attrAuthor) ?? ''

    // creation date time
    let attribute: string | null = root.getAttribute(this.attrCreationDateTime)
    if (attribute) {
      dao.creationDateTime = DateTime.fromFormat(attribute, this.formatDateTime).toJSDate()
    }

    // description
    dao.description = root.getAttribute(this.attrDescription) ?? ''

    // name
    dao.name = root.getAttribute(this.attrName) ?? ''

    // next cluster id
    attribute = root.getAttribute(this.attrCurrentClusterId)
    if (attribute) {
      dao.nextClusterId = Number.parseInt(attribute)
    }

    // next node id
    attribute = root.getAttribute(this.attrCurrentNodeId)
    if (attribute) {
      dao.nextNodeId = Number.parseInt(attribute)
    }

    // next place id
    attribute = root.getAttribute(this.attrCurrentPlaceId)
    if (attribute) {
      dao.nextPlaceId = Number.parseInt(attribute)
    }

    // next transition id
    attribute = root.getAttribute(this.attrCurrentTransitionId)
    if (attribute) {
      dao.nextTransitionId = Number.parseInt(attribute)
    }

    return dao
  }

  private readNodeShapes(dao: ModelDAO, data: IDataNode, node: Element) {
    let shape: IGraphNode
    this.readGroup<ModelDAO>(dao, node, this.tagShapes, this.tagNode, (dao, node) => {
      switch (data.type) {
        case DataType.PLACE: {
          shape = new GraphPlace(this.readId(node), data as DataPlace)
          break
        }

        case DataType.TRANSITION: {
          shape = new GraphTransition(this.readId(node), data as DataTransition)
          break
        }

        default:
          throw new ModelXmlConverterError(
            i18n.global.t('ImportFailedMalformedNodeType', { type: data.type })
          )
      }
      this.services.modelService.addNode(dao, shape)
    })

    data.labelText = node.getAttribute(this.attrLabel) ?? ''
    data.disabled = data.disabled
  }

  private readParameter(element: IElement, node: Element): Parameter {
    const id: string = this.readId(node)
    const value: string = node.textContent ?? ''

    switch (ParameterType.fromString(node.getAttribute(this.attrType))) {
      case ParameterType.GLOBAL: {
        return utils.parameterFactory.createGlobalParameter(id, value)
      }

      case ParameterType.LOCAL: {
        return utils.parameterFactory.createLocalParameter(id, value, element)
      }

      default: {
        throw new ModelXmlConverterError(i18n.global.t('ImportFailedUnhandledParamType'))
      }
    }
  }

  private readPlace(dao: ModelDAO, node: Element) {
    const place: DataPlace = new DataPlace(
      this.readId(node),
      PlaceType.fromString(node.getAttribute(this.attrType))
    )

    // Token
    this.readGroup(dao, node, this.tagTokens, this.tagToken, (_, node) => {
      place.addToken(this.readToken(node))
    })

    place.conflictResolutionType = ConflictResolutionStrategy.fromString(
      node.getAttribute(this.attrConflictResolutionStrategy)
    )

    place.disabled = node.hasAttribute(this.attrDisabled)

    place.constant = node.hasAttribute(this.attrConstant)

    place.isSticky = node.hasAttribute(this.attrSticky)

    place.description = node.getAttribute(this.attrDescription) ?? ''

    this.readNodeShapes(dao, place, node)
  }

  private readToken(node: Element): Token {
    const token: Token = new Token(new Color(node.getAttribute(this.attrColorId) ?? '', ''))

    let attribute: string | null = node.getAttribute(this.attrStart)
    if (attribute) {
      token.valueStart = Number.parseFloat(attribute)
    }

    attribute = node.getAttribute(this.attrMin)
    if (attribute) {
      token.valueMin = Number.parseFloat(attribute)
    }

    attribute = node.getAttribute(this.attrMax)
    if (attribute) {
      token.valueMax = Number.parseFloat(attribute)
    }

    return token
  }

  private readTransition(dao: ModelDAO, node: Element) {
    const transition: DataTransition = new DataTransition(
      this.readId(node),
      TransitionType.fromString(node.getAttribute(this.attrType))
    )

    // Local parameters
    this.readGroup(dao, node, this.tagParametersLocal, this.tagParameter, (_, node) => {
      this.services.parameterService.add(dao.model, this.readParameter(transition, node))
    })

    transition.disabled = node.hasAttribute(this.attrDisabled)

    transition.isSticky = node.hasAttribute(this.attrSticky)

    transition.function = this.readFunction(node)

    this.readNodeShapes(dao, transition, node)
  }

  private readWeight(dao: ModelDAO, node: Element): Weight {
    const colorId: string = node.getAttribute(this.attrColorId) ?? ''
    const color: Color | undefined = dao.model.getColor(colorId)
    if (!color) {
      throw new ModelXmlConverterError(
        i18n.global.t('ImportFailedElementNotFound', { element: this.tagColor, id: colorId })
      )
    }

    const weight: Weight = new Weight(color)
    weight.function = this.readFunction(node)
    return weight
  }

  private writeArcs(dom: Document, arcs: Array<Arc>): Element {
    const elements: Element = dom.createElement(this.tagArcs)

    for (const arc of arcs) {
      const data: DataArc = arc as DataArc

      const a: Element = dom.createElement(this.tagArc)
      a.setAttribute(this.attrId, data.id)
      a.setAttribute(this.attrType, ArcType.toString(data.arcType))
      a.setAttribute(this.attrSource, data.source.id)
      a.setAttribute(this.attrTarget, data.target.id)
      a.setAttribute(this.attrConflictResolutionValue, data.conflictResolutionValue.toString())
      if (data.disabled) {
        a.setAttribute(this.attrDisabled, data.disabled.toString())
      }
      if (data.description != '') {
        a.setAttribute(this.attrDescription, data.description)
      }

      // Shapes
      if (data.shapes.size != 0) {
        a.appendChild(this.writeConnections(dom, data))
      } else {
        throw new ModelXmlConverterError(i18n.global.t('NoShapeAssociatedToArcData'))
      }

      // Weights
      a.appendChild(this.writeWeights(dom, data))

      elements.appendChild(a)
    }
    return elements
  }

  private writeCluster(dom: Document, clusters: Array<IGraphCluster>): Element {
    const elements: Element = dom.createElement(this.tagClusters)
    for (const cluster of clusters) {
      const clusterElement: Element = dom.createElement(this.tagCluster)
      clusterElement.setAttribute(this.attrId, cluster.id)
      clusterElement.setAttribute(this.attrLabel, cluster.data.labelText)
      clusterElement.setAttribute(this.attrDescription, cluster.data.description)
      clusterElement.appendChild(this.writeGraph(dom, cluster.graph))
      elements.appendChild(clusterElement)
    }
    return elements
  }

  private writeColors(dom: Document, colors: Array<Color>): Element {
    const elements: Element = dom.createElement(this.tagColors)
    for (const color of colors) {
      const c: Element = dom.createElement(this.tagColor)
      c.setAttribute(this.attrId, color.id)
      if (color.description != '') {
        c.setAttribute(this.attrDescription, color.description)
      }
      elements.appendChild(c)
    }
    return elements
  }

  private writeConnection(dom: Document, connection: IGraphArc): Element {
    const c: Element = dom.createElement(this.tagConnection)
    c.setAttribute(this.attrId, connection.id)
    c.setAttribute(this.attrSource, connection.sourceNode.id)
    c.setAttribute(this.attrTarget, connection.targetNode.id)
    return c
  }

  private writeConnections(dom: Document, arc: DataArc): Element {
    const shapes: Element = dom.createElement(this.tagShapes)
    let conn: Element

    for (const shape of arc.shapes) {
      const data: IDataElement = shape.data

      if (data.equals(arc)) {
        conn = this.writeConnection(dom, shape as GraphArc)
        shapes.appendChild(conn)
      } else if (data.type == DataType.CLUSTERARC) {
        const dca: DataClusterArc = data as DataClusterArc
        for (const innerArc of dca.storedArcs.values()) {
          conn = this.writeConnection(dom, innerArc)
          shapes.appendChild(conn)
        }
      } else {
        throw new ModelXmlConverterError(i18n.global.t('InvalidShapeAssociatedToArcData'))
      }
    }

    return shapes
  }

  private writeGraph(dom: Document, graph: Graph): Element {
    const elements: Element = dom.createElement(this.tagGraph)
    elements.appendChild(this.writeCluster(dom, graph.clusters))
    elements.appendChild(this.writeNodes(dom, graph.nodes))
    return elements
  }

  private writeNode(dom: Document, node: IDataNode): Element {
    const elements: Element = dom.createElement(this.tagShapes)
    for (const shape of node.shapes) {
      const n: Element = dom.createElement(this.tagNode)
      n.setAttribute(this.attrId, shape.id)
      elements.appendChild(n)
    }
    return elements
  }

  private writeNodes(dom: Document, nodes: Array<IGraphNode>): Element {
    const elements: Element = dom.createElement(this.tagNodeShapes)
    let n: Element

    for (const node of nodes) {
      n = dom.createElement(this.tagNode)
      n.setAttribute(this.attrId, node.id)
      n.setAttribute(this.attrPosX, node.xCoordinate.toString())
      n.setAttribute(this.attrPosY, node.yCoordinate.toString())
      elements.appendChild(n)
    }

    return elements
  }

  private writeParameter(dom: Document, param: Parameter): Element {
    const p: Element = dom.createElement(this.tagParameter)
    p.setAttribute(this.attrId, param.id)
    p.textContent = param.value
    if (param.unit != '') {
      p.setAttribute(this.attrUnit, param.unit)
    }
    p.setAttribute(this.attrType, ParameterType.toString(param.type))
    if (param.relatedElement) {
      p.setAttribute(this.attrElementId, param.relatedElement.id)
    }
    return p
  }

  private writePlaces(dom: Document, places: Array<Place>): Element {
    const elements: Element = dom.createElement(this.tagPlaces)

    for (const place of places) {
      const data: DataPlace = place as DataPlace

      const p: Element = dom.createElement(this.tagPlace)
      p.setAttribute(this.attrId, data.id)
      p.setAttribute(this.attrType, PlaceType.toString(data.placeType))
      p.setAttribute(
        this.attrConflictResolutionStrategy,
        ConflictResolutionStrategy.toString(data.conflictResolutionType)
      )
      if (data.disabled) {
        p.setAttribute(this.attrDisabled, data.disabled.toString())
      }
      if (data.constant) {
        p.setAttribute(this.attrConstant, data.constant.toString())
      }
      if (data.isSticky) {
        p.setAttribute(this.attrSticky, data.isSticky.toString())
      }
      if (data.labelText != '') {
        p.setAttribute(this.attrLabel, data.labelText)
      }
      if (data.description != '') {
        p.setAttribute(this.attrDescription, data.description)
      }

      // Shapes
      if (data.shapes.size != 0) {
        p.appendChild(this.writeNode(dom, data))
      } else {
        throw new ModelXmlConverterError(i18n.global.t('NoShapeAssociatedToPlaceData'))
      }

      // Tokens
      p.appendChild(this.writeTokens(dom, data))

      elements.appendChild(p)
    }

    return elements
  }

  private writeTokens(dom: Document, data: DataPlace): Element {
    const elements: Element = dom.createElement(this.tagTokens)
    for (const token of data.tokens) {
      const t: Element = dom.createElement(this.tagToken)
      t.setAttribute(this.attrColorId, token.color.id)
      t.setAttribute(this.attrStart, token.valueStart.toString())
      t.setAttribute(this.attrMin, token.valueMin.toString())
      t.setAttribute(this.attrMax, token.valueMax.toString())
      elements.appendChild(t)
    }
    return elements
  }

  private writeTransitions(dom: Document, transitions: Array<Transition>): Element {
    const elements: Element = dom.createElement(this.tagTransitions)

    for (const transition of transitions) {
      const data: DataTransition = transition as DataTransition
      const t: Element = dom.createElement(this.tagTransition)

      t.setAttribute(this.attrId, data.id)
      t.setAttribute(this.attrType, TransitionType.toString(data.transitionType))
      if (data.disabled) {
        t.setAttribute(this.attrDisabled, data.disabled.toString())
      }
      if (data.isSticky) {
        t.setAttribute(this.attrSticky, data.isSticky.toString())
      }
      if (data.labelText != '') {
        t.setAttribute(this.attrLabel, data.labelText)
      }
      if (data.description != '') {
        t.setAttribute(this.attrDescription, data.description)
      }

      // Shapes
      if (data.shapes.size != 0) {
        t.appendChild(this.writeNode(dom, data))
      } else {
        throw new ModelXmlConverterError(i18n.global.t('NoShapeAssociatedToTransitionData'))
      }

      // Local Parameters
      const p: Element = dom.createElement(this.tagParametersLocal)
      for (const param of data.localParameters) {
        p.appendChild(this.writeParameter(dom, param))
      }
      t.appendChild(p)

      // Function
      const f: Element = dom.createElement(this.tagFunction)
      if (data.function.unit != '') {
        f.setAttribute(this.attrUnit, data.function.unit)
      }
      f.textContent = data.function.formatString()
      t.appendChild(f)

      elements.appendChild(t)
    }

    return elements
  }

  private writeWeights(dom: Document, data: IDataArc): Element {
    const weights: Element = dom.createElement(this.tagWeights)
    for (const weight of data.weights) {
      const w: Element = dom.createElement(this.tagWeight)
      w.setAttribute(this.attrColorId, weight.color.id)

      const f: Element = dom.createElement(this.tagFunction)
      if (weight.function.unit != '') {
        f.setAttribute(this.attrUnit, weight.function.unit)
      }
      f.textContent = weight.function.formatString()
      w.appendChild(f)

      weights.appendChild(w)
    }
    return weights
  }

  public writeXml(dao: ModelDAO): string {
    const dom: XMLDocument = document.implementation.createDocument('', '')

    const model: Element = dom.createElement(this.tagModel) // create the root element

    model.setAttribute(this.attrAuthor, dao.author)
    model.setAttribute(
      this.attrCreationDateTime,
      DateTime.fromJSDate(dao.creationDateTime).toFormat(this.formatDateTime)
    )
    model.setAttribute(this.attrDescription, dao.description)
    model.setAttribute(this.attrId, dao.id)
    model.setAttribute(this.attrName, dao.name)

    model.setAttribute(this.attrCurrentClusterId, dao.nextClusterId.toString())
    model.setAttribute(this.attrCurrentNodeId, dao.nextNodeId.toString())
    model.setAttribute(this.attrCurrentPlaceId, dao.nextPlaceId.toString())
    model.setAttribute(this.attrCurrentTransitionId, dao.nextTransitionId.toString())
    dao.nextClusterId = dao.nextClusterId - 1 // revoke iteration
    dao.nextNodeId = dao.nextNodeId - 1
    dao.nextPlaceId = dao.nextPlaceId - 1
    dao.nextTransitionId = dao.nextTransitionId - 1

    model.appendChild(this.writeArcs(dom, dao.model.arcs))
    model.appendChild(this.writePlaces(dom, dao.model.places))
    model.appendChild(this.writeTransitions(dom, dao.model.transitions))
    model.appendChild(this.writeColors(dom, dao.model.colors))
    model.appendChild(this.writeGraph(dom, dao.graph))

    const params: Element = dom.createElement(this.tagParameters)
    for (const param of dao.model.parameters) {
      if (param.type == ParameterType.GLOBAL) {
        // store global only, references are generated on import
        params.appendChild(this.writeParameter(dom, param))
      }
    }
    model.appendChild(params)

    dom.appendChild(model)
    dom.normalize()

    return this.xmlToString(dom)
  }
}
