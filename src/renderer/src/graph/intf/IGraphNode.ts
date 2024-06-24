import { IDataNode } from '@renderer/data/intf/IDataNode'
import { IGraphElement } from './IGraphElement'
import { Node } from '@vue-flow/core'
import { IGraphArc } from './IGraphArc'
import { DataCluster } from '@renderer/data/impl/DataCluster'

export interface IGraphNode extends IGraphElement, Node<IDataNode, any, string> {
  readonly children: Set<IGraphNode>
  readonly connections: Set<IGraphArc>
  readonly data: IDataNode
  labelText: string
  parentCluster: DataCluster | null
  readonly parents: Set<IGraphNode>
  xCoordinate: number
  yCoordinate: number
}
