import { IDataNode } from '@renderer/data/intf/IDataNode'
import { IGraphElement } from './IGraphElement'

export interface IGraphNode extends IGraphElement {
  readonly data: IDataNode
  xCoordinate: number
  yCoordinate: number
}
