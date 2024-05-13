import { Color } from '@renderer/core/Color'
import { Function } from '@renderer/core/Function'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataType } from '@renderer/data/intf/DataType'
import { IElement } from '@renderer/entity/intf/IElement'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

export interface IModelService {
  readonly models: Array<ModelDAO>

  addArc(dao: ModelDAO, arc: IGraphArc): void
  addElement(dao: ModelDAO, element: IElement): void
  addModel(newModel: ModelDAO): ModelDAO
  addNode(dao: ModelDAO, node: IGraphNode): void
  create(dao: ModelDAO, type: DataType, posX: number, posY: number): IGraphNode
  newModel(): ModelDAO
  removeElement(dao: ModelDAO, element: IGraphElement): void
  removeModel(model: ModelDAO): void
  setElementFunction(dao: ModelDAO, element: IElement, func: Function, color?: Color): void
}
