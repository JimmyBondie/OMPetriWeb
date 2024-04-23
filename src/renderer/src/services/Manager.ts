import { ModelXmlConverter } from '@renderer/io/ModelXmlConverter'
import { ModelService } from './ModelService'

export class CustomService extends Object {
  private _services: ServiceManager

  public constructor(services: ServiceManager) {
    super()
    this._services = services
  }

  protected get services(): ServiceManager {
    return this._services
  }
}

export class ServiceManager extends Object {
  private _modelService: ModelService = new ModelService(this)

  public get modelService(): ModelService {
    return this._modelService
  }
}

export const services = new ServiceManager()
