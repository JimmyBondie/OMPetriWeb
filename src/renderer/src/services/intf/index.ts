import { IFactoryService } from './IFactoryService'
import { IModelSbmlConverter } from './IModelSbmlConverter'
import { IModelService } from './IModelService'
import { IModelXmlConverter } from './IModelXmlConverter'
import { IParameterService } from './IParameterService'
import { IResultService } from './IResultService'
import { ISimulationService } from './ISimulationService'

export interface IServiceManager {
  readonly factoryService: IFactoryService
  readonly modelService: IModelService
  readonly parameterService: IParameterService
  readonly resultService: IResultService
  readonly sbmlConverter: IModelSbmlConverter
  readonly simulationService: ISimulationService
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
