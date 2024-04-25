import { IArc } from '@renderer/entity/intf/IArc'
import { IDataNode } from './IDataNode'
import { IDataElement } from './IDataElement'

export interface IDataArc extends IDataElement, IArc {
  readonly source: IDataNode
  readonly target: IDataNode
}
