import { Node, XYPosition } from '@vue-flow/core'
import { IGraphNode } from '../intf/IGraphNode'
import { IDataNode } from '@renderer/data/intf/IDataNode'

export class GraphNode extends Object implements IGraphNode, Node<IDataNode, any, string> {
  private _data: IDataNode
  private _id: string

  public position: XYPosition = { x: 0, y: 0 }

  public constructor(id: string, data: IDataNode) {
    super()
    this._data = data
    this._id = id
  }

  public get data(): IDataNode {
    return this._data
  }

  public get disabled(): boolean {
    return this._data.disabled
  }

  public get id(): string {
    return this._id
  }

  public get xCoordinate(): number {
    return this.position.x
  }

  public get yCoordinate(): number {
    return this.position.y
  }

  public set disabled(disabled: boolean) {
    this._data.disabled = disabled
  }

  public set xCoordinate(xCoordinate: number) {
    this.position.x = xCoordinate
  }

  public set yCoordinate(yCoordinate: number) {
    this.position.y = yCoordinate
  }
}
