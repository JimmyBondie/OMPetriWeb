import { Color } from '@renderer/core/Color'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataType } from '@renderer/data/intf/DataType'
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { INode } from '@renderer/entity/intf/INode'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

export interface IFactoryService {
  readonly colorDefault: Color
  createConnection(source: IGraphNode, target: IGraphNode, dataArc?: IDataArc): IGraphArc
  createDao(): ModelDAO
  createNode(modelDao: ModelDAO, type: DataType, posX: number, posY: number): IGraphNode
  getArcId(source: INode, target: INode): string
  getConnectionId(source: IGraphNode, target: IGraphNode): string
}
