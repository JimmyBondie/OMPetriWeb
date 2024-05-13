import { IFactoryService } from './IFactoryService'
import { IModelService } from './IModelService'
import { IModelXmlConverter } from './IModelXmlConverter'
import { IParameterService } from './IParameterService'

export interface IServiceManager {
  readonly factoryService: IFactoryService
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
