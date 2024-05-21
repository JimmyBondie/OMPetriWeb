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

export class ServiceManager extends Object implements IServiceManager {
  private _factoryService: FactoryService = new FactoryService(this)
  private _modelService: ModelService = new ModelService(this)
  private _parameterService: ParameterService = new ParameterService(this)
  private _resultService: ResultService = new ResultService(this)
  private _sbmlConverter: ModelSbmlConverter = new ModelSbmlConverter(this)
  private _simulationService: SimulationService = new SimulationService(this)
  private _xmlConverter: ModelXmlConverter = new ModelXmlConverter(this)

  public get factoryService(): IFactoryService {
    return this._factoryService
  }

  public get modelService(): IModelService {
    return this._modelService
  }

  public get parameterService(): IParameterService {
    return this._parameterService
  }

  public get resultService(): IResultService {
    return this._resultService
  }

  public get sbmlConverter(): IModelSbmlConverter {
    return this._sbmlConverter
  }

  public get simulationService(): ISimulationService {
    return this._simulationService
  }

  public get xmlConverter(): IModelXmlConverter {
    return this._xmlConverter
  }
}
