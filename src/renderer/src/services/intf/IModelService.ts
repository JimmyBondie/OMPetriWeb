import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IElement } from '@renderer/entity/intf/IElement'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

export interface IModelService {
  readonly models: Array<ModelDAO>

  addArc(dao: ModelDAO, arc: IGraphArc): void
  addElement(dao: ModelDAO, element: IElement): void
  addModel(newModel: ModelDAO): ModelDAO
  addNode(dao: ModelDAO, node: IGraphNode): void
  newModel(): ModelDAO
  removeModel(model: ModelDAO)
}
