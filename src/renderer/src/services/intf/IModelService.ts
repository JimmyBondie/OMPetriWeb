import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IElement } from '@renderer/entity/intf/IElement'

export interface IModelService {
  readonly models: Array<ModelDAO>

  addElement(dao: ModelDAO, element: IElement)
  addModel(newModel: ModelDAO): ModelDAO
  newModel(): ModelDAO
  removeModel(model: ModelDAO)
}
