import { ModelDAO } from '@renderer/dao/ModelDAO'

export interface IModelService {
  readonly models: Array<ModelDAO>

  newModel()
  removeModel(model: ModelDAO)
}
