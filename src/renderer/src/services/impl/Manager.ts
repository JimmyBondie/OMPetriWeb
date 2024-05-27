import { ModelService } from './ModelService'
import { ModelXmlConverter } from './ModelXmlConverter'
import { IServiceManager } from '../intf'
import { ParameterService } from './ParameterService'
import { IModelService } from '../intf/IModelService'
import { IParameterService } from '../intf/IParameterService'
import { IModelXmlConverter } from '../intf/IModelXmlConverter'
import { FactoryService } from './FactoryService'
import { IFactoryService } from '../intf/IFactoryService'
import { ModelSbmlConverter } from './ModelSbmlConverter'
import { IModelSbmlConverter } from '../intf/IModelSbmlConverter'
import { SimulationService } from './SimulationService'
import { ISimulationService } from '../intf/ISimulationService'
import { ResultService } from './ResultService'
import { IResultService } from '../intf/IResultService'
import { ResultsXmlConverter } from './ResultsXmlConverter'
import { IResultsXmlConverter } from '../intf/IResultsXmlConverter'

export class ServiceManager extends Object implements IServiceManager {
  private _factoryService: FactoryService = new FactoryService(this)
  private _modelSbmlConverter: ModelSbmlConverter = new ModelSbmlConverter(this)
  private _modelService: ModelService = new ModelService(this)
  private _modelXmlConverter: ModelXmlConverter = new ModelXmlConverter(this)
  private _parameterService: ParameterService = new ParameterService(this)
  private _resultService: ResultService = new ResultService(this)
  private _resultsXmlConverter: ResultsXmlConverter = new ResultsXmlConverter(this)
  private _simulationService: SimulationService = new SimulationService(this)

  public get factoryService(): IFactoryService {
    return this._factoryService
  }

  public get modelSbmlConverter(): IModelSbmlConverter {
    return this._modelSbmlConverter
  }

  public get modelService(): IModelService {
    return this._modelService
  }

  public get modelXmlConverter(): IModelXmlConverter {
    return this._modelXmlConverter
  }

  public get parameterService(): IParameterService {
    return this._parameterService
  }

  public get resultService(): IResultService {
    return this._resultService
  }

  public get resultsXmlConverter(): IResultsXmlConverter {
    return this._resultsXmlConverter
  }

  public get simulationService(): ISimulationService {
    return this._simulationService
  }
}
