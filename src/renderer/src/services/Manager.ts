import { ModelService } from './ModelService'

class ServiceManager extends Object {
  private _modelService: ModelService = new ModelService()

  public get modelService(): ModelService {
    return this._modelService
  }
}

export const services = new ServiceManager()
