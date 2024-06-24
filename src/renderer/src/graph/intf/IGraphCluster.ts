import { DataCluster } from '@renderer/data/impl/DataCluster'
import { IGraphNode } from './IGraphNode'
import { Graph } from '../Graph'

export interface IGraphCluster extends IGraphNode {
  readonly data: DataCluster
  readonly graph: Graph
}
