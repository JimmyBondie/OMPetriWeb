import { IElement } from '@renderer/entity/intf/IElement'
import { DataType } from './DataType'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

export interface IDataElement extends IElement {
  description: string
  isSticky: boolean
  labelText: string
  readonly shapes: Set<IGraphElement>
  readonly type: DataType
}
