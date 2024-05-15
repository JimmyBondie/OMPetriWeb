import { CustomError } from '@renderer/utils/CustomError'
import { IGraphNode } from './intf/IGraphNode'
import i18n from '@renderer/main'
import { IGraphArc } from './intf/IGraphArc'

export class GraphError extends CustomError {}

export class Graph extends Object {
  private _connections: Map<string, IGraphArc> = new Map<string, IGraphArc>()
  private _nodes: Map<string, IGraphNode> = new Map<string, IGraphNode>()

  public get connections(): Array<IGraphArc> {
    return Array.from(this._connections.values())
  }

  public get nodes(): Array<IGraphNode> {
    return Array.from(this._nodes.values())
  }

  public addNode(node: IGraphNode) {
    if (node && !this._nodes.has(node.id)) {
      this._nodes.set(node.id, node)
    }
  }

  public addConnection(connection: IGraphArc) {
    if (!this._connections.has(connection.id) && this._nodes.has(connection.sourceNode.id)) {
      this._connections.set(connection.id, connection)
      if (this._nodes.has(connection.targetNode.id)) {
        connection.sourceNode.children.add(connection.targetNode)
        connection.sourceNode.connections.add(connection)
        connection.targetNode.parents.add(connection.sourceNode)
        connection.targetNode.connections.add(connection)
      }
    }
  }

  public contains(id: string): boolean {
    return this._connections.has(id) || this._nodes.has(id)
  }

  public getNode(id: string): IGraphNode {
    const node: IGraphNode | undefined = this._nodes.get(id)
    if (node) {
      return node
    } else {
      throw new GraphError(i18n.global.t('NodeNotFound', { id: id }))
    }
  }

  public removeConnection(connection: IGraphArc) {
    this._connections.delete(connection.id)
    connection.sourceNode.children.delete(connection.targetNode)
    connection.targetNode.parents.delete(connection.sourceNode)
    connection.sourceNode.connections.delete(connection)
    connection.targetNode.connections.delete(connection)
  }

  public removeNode(node: IGraphNode) {
    while (node.connections.size > 0) {
      this.removeConnection(node.connections.values().next().value) // while to prevent concurrent modification exception
    }
    this._nodes.delete(node.id)
  }
}
