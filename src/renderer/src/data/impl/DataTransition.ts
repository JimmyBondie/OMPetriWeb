import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { DataType } from '../intf/DataType'
import { IDataNode } from '../intf/IDataNode'
import { Transition } from '@renderer/entity/impl/Transition'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'

export class DataTransition extends Transition implements IDataNode {
  private _description: string = ''
  private _isSticky: boolean = false
  private _shapes: Set<IGraphElement> = new Set<IGraphElement>()
  private _type: DataType = DataType.TRANSITION

  public get description(): string {
    return this._description
  }

  public get disabled(): boolean {
    return super.disabled
  }

  public get isSticky(): boolean {
    return this._isSticky
  }

  public get labelText(): string {
    if (this._shapes.size == 0) {
      return ''
    } else {
      const element: IGraphElement = this._shapes.values().next().value
      return (element as IGraphNode).labelText
    }
  }

  public get shapes(): Set<IGraphElement> {
    return this._shapes
  }

  public get type(): DataType {
    return this._type
  }

  public set description(description: string) {
    this._description = description
  }

  public set disabled(disabled: boolean) {
    super.disabled = disabled
    for (const shape of this._shapes) {
      shape.disabled = disabled
    }
  }

  public set isSticky(isSticky: boolean) {
    this._isSticky = isSticky
  }

  public set labelText(labelText: string) {
    for (const shape of this._shapes) {
      ;(shape as IGraphNode).labelText = labelText
    }
  }
}
