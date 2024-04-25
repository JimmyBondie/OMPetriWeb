import { IElement } from '@renderer/entity/intf/IElement'
import { DataType } from './DataType'

export interface IDataElement extends IElement {
  description: string
  isSticky: boolean
  labelText: string
  readonly type: DataType
}
