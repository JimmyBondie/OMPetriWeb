import { IDataElement } from '@renderer/data/intf/IDataElement'

export interface IGraphElement {
  readonly data: IDataElement
  disabled: boolean
  id: string
}
