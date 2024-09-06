import { IFactoryService } from './IFactoryService'
import { IHierarchyService } from './IHierarchyService'
import { IModelSBMLConverter } from './IModelSBMLConverter'
import { IModelService } from './IModelService'
import { IModelXMLConverter } from './IModelXMLConverter'
import { IParameterService } from './IParameterService'
import { IResultService } from './IResultService'
import { IResultsXMLConverter } from './IResultsXMLConverter'
import { ISimulationService } from './ISimulationService'

export interface IServiceManager {
  readonly factoryService: IFactoryService
  readonly hierarchyService: IHierarchyService
  readonly modelSBMLConverter: IModelSBMLConverter
  readonly modelService: IModelService
  readonly modelXMLConverter: IModelXMLConverter
  readonly parameterService: IParameterService
  readonly resultService: IResultService
  readonly resultsXMLConverter: IResultsXMLConverter
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
