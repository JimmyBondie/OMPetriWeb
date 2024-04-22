import { ModelDAO } from '@renderer/dao/ModelDAO'

export class ModelService extends Object {
  private _models: ModelDAO[] = []

  public get models(): Array<ModelDAO> {
    return this._models
  }
}
