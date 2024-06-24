import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IGraphCluster } from '@renderer/graph/intf/IGraphCluster'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'

export interface IHierarchyService {
  cluster(dao: ModelDAO, selected: Array<IGraphElement>, clusterId: string): IGraphCluster
}
