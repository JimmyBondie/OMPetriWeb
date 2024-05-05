import { Node, XYPosition } from '@vue-flow/core'
import { IGraphNode } from '../intf/IGraphNode'
import { IDataNode } from '@renderer/data/intf/IDataNode'

export class GraphNode extends Object implements IGraphNode, Node<IDataNode, any, string> {
  private _data: IDataNode
  private _disabled: boolean = false
  private _id: string
  private _labelText: string = ''

  public position: XYPosition = { x: 0, y: 0 }

  public constructor(id: string, data: IDataNode) {
    super()
    this._data = data
    this._data.shapes.add(this)
    this._id = id
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

  public get xCoordinate(): number {
    return this.position.x
  }

  public get yCoordinate(): number {
    return this.position.y
  }

  public set disabled(disabled: boolean) {
    this._disabled = disabled
  }

  public set labelText(labelText: string) {
    this._labelText = labelText
  }

  public set xCoordinate(xCoordinate: number) {
    this.position.x = xCoordinate
  }

  public set yCoordinate(yCoordinate: number) {
    this.position.y = yCoordinate
  }
}
