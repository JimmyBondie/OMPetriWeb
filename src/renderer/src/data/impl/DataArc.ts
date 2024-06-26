import { Arc } from '@renderer/entity/impl/Arc'
import { IDataArc } from '../intf/IDataArc'
import { DataError, DataType } from '../intf/DataType'
import i18n from '@renderer/main'
import { IDataNode } from '../intf/IDataNode'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

export class DataArc extends Arc implements IDataArc {
  private _description: string = ''
  private _labelText: string = ''
  private _shapes: Set<IGraphElement> = new Set<IGraphElement>()
  private _type: DataType = DataType.ARC

  public get description(): string {
    return this._description
  }

  public get disabled(): boolean {
    return super.disabled
  }

  public get isSticky(): boolean {
    throw new DataError(i18n.global.t('NotSupported'))
  }

  public get labelText(): string {
    return this._labelText
  }

  public get shapes(): Set<IGraphElement> {
    return this._shapes
  }

  public get source(): IDataNode {
    return super.source as IDataNode
  }

  public get target(): IDataNode {
    return super.target as IDataNode
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

  public set isSticky(_: boolean) {
    throw new DataError(i18n.global.t('NotSupported'))
  }

  public set labelText(labelText: string) {
    this._labelText = labelText
  }
}
