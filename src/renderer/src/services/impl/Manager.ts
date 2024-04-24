import { ModelService } from './ModelService'
import { ModelXmlConverter } from './ModelXmlConverter'
import { IServiceManager } from '../intf'
import { ParameterService } from './ParameterService'
import { IModelService } from '../intf/IModelService'
import { IParameterService } from '../intf/IParameterService'
import { IModelXmlConverter } from '../intf/IModelXmlConverter'

export class ServiceManager extends Object implements IServiceManager {
  private _modelService: ModelService = new ModelService(this)
  private _parameterService: ParameterService = new ParameterService(this)
  private _xmlConverter: ModelXmlConverter = new ModelXmlConverter(this)

  public get modelService(): IModelService {
    return this._modelService
  }

  public get parameterService(): IParameterService {
    return this._parameterService
  }

  public get xmlConverter(): IModelXmlConverter {
    return this._xmlConverter
  }
}
