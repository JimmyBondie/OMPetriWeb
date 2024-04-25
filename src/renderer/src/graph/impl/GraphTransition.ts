import { DataTransition } from '@renderer/data/impl/DataTransition'
import { GraphNode } from './GraphNode'

export class GraphTransition extends GraphNode {
  public constructor(id: string, transition: DataTransition) {
    super(id, transition)
  }

  public get type(): string {
    return 'graphTransition'
  }
}
