import { IElement } from '@renderer/entity/intf/IElement'
import { Parameter, ParameterType } from '../Parameter'

export class LocalParameter extends Parameter {
  public constructor(id: string, value: string, relatedElement: IElement | null) {
    super(ParameterType.LOCAL, id, value, relatedElement)
  }
}
