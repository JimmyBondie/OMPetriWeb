import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataType } from '@renderer/data/intf/DataType'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

export interface IFactoryService {
  createNode(modelDao: ModelDAO, type: DataType, posX: number, posY: number): IGraphNode
}
