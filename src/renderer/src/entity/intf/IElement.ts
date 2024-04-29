import { Parameter } from '@renderer/core/Parameter'

export enum ElementType {
  ARC,
  PLACE,
  TRANSITION
}

export interface IElement {
  disabled: boolean
  elementType: ElementType
  id: string
  readonly localParameters: Array<Parameter>
  readonly relatedParameters: Set<Parameter>

  addLocalParameter(parameter: Parameter)

  equals(element: IElement): boolean

  getLocalParameter(id: string): Parameter | undefined
}
