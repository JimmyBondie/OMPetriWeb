import { Color } from '@renderer/core/Color'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { DataType } from '@renderer/data/intf/DataType'
import { IDataArc } from '@renderer/data/intf/IDataArc'
import { PlaceType } from '@renderer/entity/impl/Place'
import { TransitionType } from '@renderer/entity/impl/Transition'
import { INode } from '@renderer/entity/intf/INode'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

export interface IFactoryService {
  readonly colorDefault: Color
  createConnection(source: IGraphNode, target: IGraphNode, dataArc?: IDataArc): IGraphArc
  createDao(): ModelDAO
  createNode(
    modelDao: ModelDAO,
    type:
      | { dataType: DataType.PLACE; elemType: PlaceType }
      | { dataType: DataType.TRANSITION; elemType: TransitionType },
    posX: number,
    posY: number
  ): IGraphNode
  getArcId(source: INode, target: INode): string
  getConnectionId(source: IGraphNode, target: IGraphNode): string
}
