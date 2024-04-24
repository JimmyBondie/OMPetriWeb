import { ModelDAO } from '@renderer/dao/ModelDAO'
import { CustomService } from '../intf'
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
import { Arc } from '@renderer/entity/impl/Arc'
import { ArcType } from '@renderer/entity/intf/IArc'
import { INode } from '@renderer/entity/intf/INode'
import { Weight } from '@renderer/core/Weight'

export class ModelXmlConverterError extends CustomError {}

export class ModelXmlConverter extends CustomService implements IModelXmlConverter {
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
  // private readonly attrElementId: string = 'elementId'
  private readonly attrId: string = 'id'
  // private readonly attrLabel: string = 'label'
  private readonly attrMax: string = 'max'
  private readonly attrMin: string = 'min'
  private readonly attrName: string = 'name'
  // private readonly attrUnit: string = 'unit'
  // private readonly attrPosX: string = 'posX'
  // private readonly attrPosY: string = 'posY'
  private readonly attrSource: string = 'source'
  private readonly attrStart: string = 'start'
  // private readonly attrSticky: string = 'sticky'
  private readonly attrTarget: string = 'target'
  private readonly attrType: string = 'type'
  // private readonly attrValue: string = 'value'

  private readonly tagArc: string = 'Arc'
  private readonly tagArcs: string = 'Arcs'
  // private readonly tagCluster: string = 'Cluster'
  // private readonly tagClusters: string = 'Clusters'
  private readonly tagColor: string = 'Colour'
  private readonly tagColors: string = 'Colours'
  // private readonly tagConnection: string = 'Connection'
  private readonly tagFunction: string = 'Function'
  // private readonly tagGraph: string = 'Graph'
  // private readonly tagLabel: string = 'Label'
  private readonly tagModel: string = 'Model'
  // private readonly tagNode: string = 'Node'
  // private readonly tagNodes: string = 'Nodes'
  // private readonly tagNodeShapes: string = 'Nodes'
  private readonly tagParameter: string = 'Parameter'
  private readonly tagParameters: string = 'Parameters'
  private readonly tagParametersLocal: string = 'LocalParameters'
  private readonly tagPlace: string = 'Place'
  private readonly tagPlaces: string = 'Places'
  // private readonly tagShapes: string = 'Shapes'
  private readonly tagToken: string = 'Token'
  private readonly tagTokens: string = 'Tokens'
  private readonly tagTransition: string = 'Transition'
  private readonly tagTransitions: string = 'Transitions'
  private readonly tagWeight: string = 'Weight'
  private readonly tagWeights: string = 'Weights'

  private _parser: DOMParser = new DOMParser()

  public importXML(content: string): ModelDAO {
    const xmlDoc: XMLDocument = this._parser.parseFromString(content, 'text/xml')
    const root: Element = this.calcGroupNode(xmlDoc, this.tagModel)
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
      const element: IElement | undefined = dao.model.getElement(this.readId(node))
      if (element) {
        this.services.parameterService.add(dao.model, this.readParameter(element, node))
      }
    })

    dao = this.services.modelService.addModel(dao)
    return dao
  }

  private calcGroupNode(root: Document | Element, tagName: string): Element {
    const nodes: HTMLCollectionOf<Element> = root.getElementsByTagName(tagName)
    if (nodes.length <= 0) {
      throw new ModelXmlConverterError(i18n.global.t('ImportFailedNoElement', { element: tagName }))
    } else if (nodes.length > 1) {
      throw new ModelXmlConverterError(
        i18n.global.t('ImportFailedMoreThanOneElement', { element: tagName })
      )
    }

    const node: Element = nodes[0]
    if (node.nodeType == Node.ELEMENT_NODE) {
      return node
    } else {
      throw new ModelXmlConverterError(
        i18n.global.t('ImportFailedMalformedElement', { tag: tagName })
      )
    }
  }

  private calcGroupNodeList(
    root: Element,
    groupTag: string,
    itemTag: string
  ): HTMLCollectionOf<Element> {
    const group: Element = this.calcGroupNode(root, groupTag)
    return group.getElementsByTagName(itemTag)
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
    const arc: Arc = new Arc(
      this.readId(node),
      source as INode,
      target as INode,
      ArcType[node.getAttribute(this.attrType) ?? 0]
    )

    // Weights
    this.readGroup<ModelDAO>(dao, node, this.tagWeights, this.tagWeight, (dao, node) => {
      arc.addWeight(this.readWeight(dao, node))
    })

    arc.disabled = node.hasAttribute(this.attrDisabled)

    const attribute: string | null = node.getAttribute(this.attrConflictResolutionValue)
    if (attribute) {
      arc.conflictResolutionValue = Number.parseFloat(attribute)
    }

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
          return utils.functionFactory.build(node.textContent ?? '')
        }
      }
    }
    return utils.functionFactory.build('1')
  }

  private readGroup<T>(
    item: T,
    root: Element,
    groupTag: string,
    itemTag: string,
    readNode: (item: T, node: Element) => void
  ) {
    const nodes: HTMLCollectionOf<Element> = this.calcGroupNodeList(root, groupTag, itemTag)

    for (const node of nodes) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        readNode.call(this, item, node)
      }
    }
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

  private readParameter(element: IElement, node: Element): Parameter {
    const id: string = this.readId(node)
    const value: string = node.textContent ?? ''

    switch (ParameterType[node.getAttribute(this.attrType) ?? 0]) {
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
    const place: Place = new Place(
      this.readId(node),
      PlaceType[node.getAttribute(this.attrType) ?? 0],
      ConflictResolutionStrategy.PRIORITY
    )

    // Token
    this.readGroup(dao, node, this.tagTokens, this.tagToken, (_, node) => {
      place.addToken(this.readToken(node))
    })

    place.conflictResolutionType =
      ConflictResolutionStrategy[node.getAttribute(this.attrConflictResolutionStrategy) ?? 0]

    place.disabled = node.hasAttribute(this.attrDisabled)

    place.constant = node.hasAttribute(this.attrConstant)

    this.services.modelService.addElement(dao, place)
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
    const transition: Transition = new Transition(
      this.readId(node),
      TransitionType[node.getAttribute(this.attrType) ?? 0]
    )

    // Local parameters
    this.readGroup(dao, node, this.tagParametersLocal, this.tagParameter, (_, node) => {
      this.services.parameterService.add(dao.model, this.readParameter(transition, node))
    })

    transition.disabled = node.hasAttribute(this.attrDisabled)

    transition.function = this.readFunction(node)

    this.services.modelService.addElement(dao, transition)
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
}
