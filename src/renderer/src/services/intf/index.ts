import { IModelService } from './IModelService'

export interface IServiceManager {
  readonly modelService: IModelService
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
