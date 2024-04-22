import { Parameter, ParameterType } from '../Parameter'

export class GlobalParameter extends Parameter {
  public constructor(id: string, value: string) {
    super(ParameterType.GLOBAL, id, value, null)
  }
}
