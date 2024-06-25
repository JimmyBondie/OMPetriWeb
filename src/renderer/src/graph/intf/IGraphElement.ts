import { DataCluster } from '@renderer/data/impl/DataCluster'
import { IDataElement } from '@renderer/data/intf/IDataElement'

export interface IGraphElement {
  readonly data: IDataElement
  disabled: boolean
  id: string
  parentCluster: DataCluster | null
}
