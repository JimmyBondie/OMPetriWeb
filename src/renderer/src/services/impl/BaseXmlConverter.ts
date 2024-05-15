import { CustomError } from '@renderer/utils/CustomError'
import { CustomService } from '../intf'
import i18n from '@renderer/main'

export class BaseXmlConverterError extends CustomError {}

export class BaseXmlConverter extends CustomService {
  private _parser: DOMParser = new DOMParser()

  protected get parser(): DOMParser {
    return this._parser
  }

  protected calcGroupNode(root: Document | Element, tagName: string): Element | null {
    const nodes: HTMLCollectionOf<Element> = root.getElementsByTagName(tagName)
    if (nodes.length <= 0) {
      return null
    } else if (nodes.length > 1) {
      throw new BaseXmlConverterError(
        i18n.global.t('ImportFailedMoreThanOneElement', { element: tagName })
      )
    }

    const node: Element = nodes[0]
    if (node.nodeType == Node.ELEMENT_NODE) {
      return node
    } else {
      throw new BaseXmlConverterError(
        i18n.global.t('ImportFailedMalformedElement', { tag: tagName })
      )
    }
  }

  protected calcRequiredGroupNode(root: Document | Element, tagName: string): Element {
    const node: Element | null = this.calcGroupNode(root, tagName)
    if (node) {
      return node
    } else {
      throw new BaseXmlConverterError(i18n.global.t('ImportFailedNoElement', { element: tagName }))
    }
  }

  private calcGroupNodeList(
    root: Document | Element,
    groupTag: string,
    itemTag: string
  ): HTMLCollectionOf<Element> | null {
    let group: Document | Element | null
    if (groupTag != '') {
      group = this.calcGroupNode(root, groupTag)
    } else {
      group = root
    }

    if (group) {
      return group.getElementsByTagName(itemTag)
    } else {
      return null
    }
  }

  protected readGroup<T>(
    item: T,
    root: Document | Element,
    groupTag: string,
    itemTag: string,
    readNode: (item: T, node: Element) => void
  ) {
    const nodes: HTMLCollectionOf<Element> | null = this.calcGroupNodeList(root, groupTag, itemTag)
    if (nodes) {
      for (const node of nodes) {
        if (node.nodeType == Node.ELEMENT_NODE) {
          readNode.call(this, item, node)
        }
      }
    }
  }
}
