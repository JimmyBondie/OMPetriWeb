import { DataType } from '../intf/DataType'
import { IDataNode } from '../intf/IDataNode'
import { Transition } from '@renderer/entity/impl/Transition'

export class DataTransition extends Transition implements IDataNode {
  private _description: string = ''
  private _isSticky: boolean = false
  private _labelText: string = ''
  private _type: DataType = DataType.TRANSITION

  public get description(): string {
    return this._description
  }

  public get isSticky(): boolean {
    return this._isSticky
  }

  public get labelText(): string {
    return this._labelText
  }

  public get type(): DataType {
    return this._type
  }

  public set description(description: string) {
    this._description = description
  }

  public set isSticky(isSticky: boolean) {
    this._isSticky = isSticky
  }

  public set labelText(labelText: string) {
    this._labelText = labelText
  }
}
