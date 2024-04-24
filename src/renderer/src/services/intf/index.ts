import { IModelService } from './IModelService'
import { IModelXmlConverter } from './IModelXmlConverter'
import { IParameterService } from './IParameterService'

export interface IServiceManager {
  readonly modelService: IModelService
  readonly parameterService: IParameterService
  readonly xmlConverter: IModelXmlConverter
}

export class CustomService extends Object {
  private _services: IServiceManager

  public constructor(services: IServiceManager) {
    super()
    this._services = services
  }

  protected get services(): IServiceManager {
    return this._services
  }
}
