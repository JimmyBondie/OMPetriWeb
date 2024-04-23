import { ModelService } from './ModelService'
import { IServiceManager } from './intf'

export class ServiceManager extends Object implements IServiceManager {
  private _modelService: ModelService = new ModelService(this)

  public get modelService(): ModelService {
    return this._modelService
  }

}
