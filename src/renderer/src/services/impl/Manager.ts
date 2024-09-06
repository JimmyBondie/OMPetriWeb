import { ModelService } from './ModelService'
import { ModelXMLConverter } from './ModelXMLConverter'
import { IServiceManager } from '../intf'
import { ParameterService } from './ParameterService'
import { IModelService } from '../intf/IModelService'
import { IParameterService } from '../intf/IParameterService'
import { IModelXMLConverter } from '../intf/IModelXMLConverter'
import { FactoryService } from './FactoryService'
import { IFactoryService } from '../intf/IFactoryService'
import { ModelSBMLConverter } from './ModelSBMLConverter'
import { IModelSBMLConverter } from '../intf/IModelSBMLConverter'
import { SimulationService } from './SimulationService'
import { ISimulationService } from '../intf/ISimulationService'
import { ResultService } from './ResultService'
import { IResultService } from '../intf/IResultService'
import { ResultsXMLConverter } from './ResultsXMLConverter'
import { IResultsXMLConverter } from '../intf/IResultsXMLConverter'
import { HierarchyService } from './HierarchyService'
import { IHierarchyService } from '../intf/IHierarchyService'

export class ServiceManager extends Object implements IServiceManager {
  private _factoryService: FactoryService = new FactoryService(this)
  private _hierarchyService: HierarchyService = new HierarchyService(this)
  private _modelSBMLConverter: ModelSBMLConverter = new ModelSBMLConverter(this)
  private _modelService: ModelService = new ModelService(this)
  private _modelXMLConverter: ModelXMLConverter = new ModelXMLConverter(this)
  private _parameterService: ParameterService = new ParameterService(this)
  private _resultService: ResultService = new ResultService(this)
  private _resultsXMLConverter: ResultsXMLConverter = new ResultsXMLConverter(this)
  private _simulationService: SimulationService = new SimulationService(this)

  public get factoryService(): IFactoryService {
    return this._factoryService
  }

  public get hierarchyService(): IHierarchyService {
    return this._hierarchyService
  }

  public get modelSBMLConverter(): IModelSBMLConverter {
    return this._modelSBMLConverter
  }

  public get modelService(): IModelService {
    return this._modelService
  }

  public get modelXMLConverter(): IModelXMLConverter {
    return this._modelXMLConverter
  }

  public get parameterService(): IParameterService {
    return this._parameterService
  }

  public get resultService(): IResultService {
    return this._resultService
  }

  public get resultsXMLConverter(): IResultsXMLConverter {
    return this._resultsXMLConverter
  }

  public get simulationService(): ISimulationService {
    return this._simulationService
  }
}
