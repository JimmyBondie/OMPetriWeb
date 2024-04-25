import { DataPlace } from '@renderer/data/impl/DataPlace'
import { GraphNode } from './GraphNode'

export class GraphPlace extends GraphNode {
  public constructor(id: string, place: DataPlace) {
    super(id, place)
  }

  public get type(): string {
    return 'graphPlace'
  }
}
