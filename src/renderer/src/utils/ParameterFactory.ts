import { Parameter } from '@renderer/core/Parameter'
import { GlobalParameter } from '@renderer/core/Parameter/GlobalParameter'
import { LocalParameter } from '@renderer/core/Parameter/LocalParameter'
import { IElement } from '@renderer/entity/intf/IElement'

export class ParameterFactory extends Object {
  public createGlobalParameter(id: string, value: string): Parameter {
    return new GlobalParameter(id, value)
  }

  public createLocalParameter(id: string, value: string, reference: IElement): Parameter {
    return new LocalParameter(id, value, reference)
  }
}
