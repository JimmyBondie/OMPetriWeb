import { XYPosition } from '@vue-flow/core'
import { IGraphNode } from '../intf/IGraphNode'
import { IDataNode } from '@renderer/data/intf/IDataNode'
import { IGraphArc } from '../intf/IGraphArc'
import { DataCluster } from '@renderer/data/impl/DataCluster'

export class GraphNode extends Object implements IGraphNode {
  private _children: Set<IGraphNode> = new Set<IGraphNode>()
  private _connections: Set<IGraphArc> = new Set<IGraphArc>()
  private _data: IDataNode
  private _disabled: boolean = false
  private _id: string
  private _labelText: string = ''
  private _parentCluster: DataCluster | null = null
  private _parents: Set<IGraphNode> = new Set<IGraphNode>()

  public expandParent: boolean = true
  public position: XYPosition = { x: 0, y: 0 }

  public constructor(id: string, data: IDataNode) {
    super()
    this._data = data
    this._data.shapes.add(this)
    this._id = id
  }

  public get children(): Set<IGraphNode> {
    return this._children
  }

  public get connections(): Set<IGraphArc> {
    return this._connections
  }

  public get data(): IDataNode {
    return this._data
  }

  public get disabled(): boolean {
    return this._disabled
  }

  public get id(): string {
    return this._id
  }

  public get labelText(): string {
    return this._labelText
  }

  public get parentCluster(): DataCluster | null {
    return this._parentCluster
  }

  public get parentNode(): string {
    if (this._parentCluster) {
      return this._parentCluster.id
    } else {
      return ''
    }
  }

  public get parents(): Set<IGraphNode> {
    return this._parents
  }

  public get xCoordinate(): number {
    return this.position.x
  }

  public get yCoordinate(): number {
    return this.position.y
  }

  public set disabled(disabled: boolean) {
    this._disabled = disabled
    for (const connection of this._connections) {
      ;(connection as IGraphArc).data.disabled = disabled
    }
  }

  public set labelText(labelText: string) {
    this._labelText = labelText
  }

  public set parentCluster(parentCluster: DataCluster | null) {
    this._parentCluster = parentCluster
  }

  public set xCoordinate(xCoordinate: number) {
    this.position.x = xCoordinate
  }

  public set yCoordinate(yCoordinate: number) {
    this.position.y = yCoordinate
  }
}
