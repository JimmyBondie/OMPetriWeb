import { CustomError } from '@renderer/utils/CustomError'
import { IGraphNode } from './intf/IGraphNode'
import i18n from '@renderer/main'
import { GraphNode } from './impl/GraphNode'
import { GraphArc } from './impl/GraphArc'

export class GraphError extends CustomError {}

export class Graph extends Object {
  private _connections: Map<string, GraphArc> = new Map<string, GraphArc>()
  private _nodes: Map<string, GraphNode> = new Map<string, GraphNode>()

  public get connections(): Array<GraphArc> {
    return Array.from(this._connections.values())
  }

  public get nodes(): Array<GraphNode> {
    return Array.from(this._nodes.values())
  }

  public addNode(node: GraphNode) {
    if (node && !this._nodes.has(node.id)) {
      this._nodes.set(node.id, node)
    }
  }

  public addConnection(connection: GraphArc) {
    if (
      connection &&
      connection.source &&
      connection.target &&
      !this._connections.has(connection.id)
    ) {
      this._connections.set(connection.id, connection)
    }
  }

  public getNode(id: string): IGraphNode {
    const node: IGraphNode | undefined = this._nodes.get(id)
    if (node) {
      return node
    } else {
      throw new GraphError(i18n.global.t('NodeNotFound', { id: id }))
    }
  }
}
