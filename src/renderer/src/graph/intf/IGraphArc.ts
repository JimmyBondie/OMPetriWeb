import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IGraphElement } from './IGraphElement'
import { IGraphNode } from './IGraphNode'
import { DefaultEdge } from '@vue-flow/core'

export interface IGraphArc extends IGraphElement, DefaultEdge<IDataArc, any, string> {
  readonly data: IDataArc
  readonly sourceNode: IGraphNode
  readonly targetNode: IGraphNode
}
