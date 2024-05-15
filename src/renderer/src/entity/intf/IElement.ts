import { Parameter } from '@renderer/core/Parameter'
import i18n from '@renderer/main'

export enum ElementType {
  ARC,
  PLACE,
  TRANSITION
}

export namespace ElementType {
  export function fromString(value: string): ElementType {
    switch (value) {
      case 'ARC':
        return ElementType.ARC
      case 'PLACE':
        return ElementType.PLACE
      case 'TRANSITION':
        return ElementType.TRANSITION
      default:
        return ElementType.ARC
    }
  }

  export function toText(elementType: ElementType): string {
    switch (elementType) {
      case ElementType.ARC:
        return i18n.global.t('Arc')
      case ElementType.PLACE:
        return i18n.global.t('Place')
      case ElementType.TRANSITION:
        return i18n.global.t('Transition')
    }
  }
}

export interface IElement {
  disabled: boolean
  elementType: ElementType
  id: string
  readonly localParameters: Array<Parameter>
  readonly relatedParameters: Set<Parameter>

  addLocalParameter(parameter: Parameter): void

  equals(element: IElement): boolean

  getLocalParameter(id: string): Parameter | undefined
}
