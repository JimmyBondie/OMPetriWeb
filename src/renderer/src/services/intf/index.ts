import { IFactoryService } from './IFactoryService'
import { IHierarchyService } from './IHierarchyService'
import { IModelSbmlConverter } from './IModelSbmlConverter'
import { IModelService } from './IModelService'
import { IModelXmlConverter } from './IModelXmlConverter'
import { IParameterService } from './IParameterService'
import { IResultService } from './IResultService'
import { IResultsXmlConverter } from './IResultsXmlConverter'
import { ISimulationService } from './ISimulationService'

export interface IServiceManager {
  readonly factoryService: IFactoryService
  readonly hierarchyService: IHierarchyService
  readonly modelSbmlConverter: IModelSbmlConverter
  readonly modelService: IModelService
  readonly modelXmlConverter: IModelXmlConverter
  readonly parameterService: IParameterService
  readonly resultService: IResultService
  readonly resultsXmlConverter: IResultsXmlConverter
  readonly simulationService: ISimulationService
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
