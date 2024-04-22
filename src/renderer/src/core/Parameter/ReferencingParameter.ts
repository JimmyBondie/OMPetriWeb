import { IElement } from '@renderer/entity/intf/IElement'
import { Parameter, ParameterType } from '../Parameter'

export enum ReferenceType {
  TOKEN,
  SPEED
}

export class ReferencingParameter extends Parameter {
  private _referenceType: ReferenceType

  public constructor(
    id: string,
    value: string,
    relatedElement: IElement | null,
    referenceType: ReferenceType
  ) {
    super(ParameterType.REFERENCE, id, value, relatedElement)
    this._referenceType = referenceType
  }

  public get referenceType(): ReferenceType {
    return this._referenceType
  }
}
