import { Model } from '@renderer/core/Model'
import { CustomService } from '../intf'
import { IParameterService } from '../intf/IParameterService'
import { Parameter } from '@renderer/core/Parameter'

export class ParameterService extends CustomService implements IParameterService {
  public add(model: Model, param: Parameter): void {
    model.addParameter(param)
  }
}
