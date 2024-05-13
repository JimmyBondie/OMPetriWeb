import { IDataNode } from '@renderer/data/intf/IDataNode'
import { IGraphElement } from './IGraphElement'
import { Node } from '@vue-flow/core'
import { IGraphArc } from './IGraphArc'

export interface IGraphNode extends IGraphElement, Node<IDataNode, any, string> {
  readonly connections: Set<IGraphArc>
  readonly data: IDataNode
  labelText: string
  xCoordinate: number
  yCoordinate: number
}
