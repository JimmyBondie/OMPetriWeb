import { IDataNode } from '@renderer/data/intf/IDataNode'
import { IGraphElement } from './IGraphElement'

export interface IGraphNode extends IGraphElement {
  readonly data: IDataNode
  labelText: string
  xCoordinate: number
  yCoordinate: number
}
