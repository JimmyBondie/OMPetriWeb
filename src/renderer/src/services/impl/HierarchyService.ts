import { ModelDAO } from '@renderer/dao/ModelDAO'
import { CustomService } from '../intf'
import { IHierarchyService } from '../intf/IHierarchyService'
import { IGraphElement } from '@renderer/graph/intf/IGraphElement'
import { IGraphCluster } from '@renderer/graph/intf/IGraphCluster'
import { CustomError } from '@renderer/utils/CustomError'
import i18n from '@renderer/main'
import { GraphCluster } from '@renderer/graph/impl/GraphCluster'
import { IGraphNode } from '@renderer/graph/intf/IGraphNode'
import { DataType } from '@renderer/data/intf/DataType'
import { Graph } from '@renderer/graph/Graph'
import { DataCluster } from '@renderer/data/impl/DataCluster'
import { IGraphArc } from '@renderer/graph/intf/IGraphArc'
import { DataException } from './Exceptions'
import { GraphArc } from '@renderer/graph/impl/GraphArc'
import { DataClusterArc } from '@renderer/data/impl/DataClusterArc'

export class HierarchyServiceError extends CustomError {}

export class HierarchyService extends CustomService implements IHierarchyService {
  public cluster(dao: ModelDAO, selected: Array<IGraphElement>, clusterId: string): IGraphCluster {
    if (selected.length == 0) {
      throw new HierarchyServiceError(i18n.global.t('NoElementsSelected'))
    }

    const clusters: Set<GraphCluster> = new Set<GraphCluster>()
    const nodes: Set<IGraphNode> = new Set<IGraphNode>()

    for (const element of selected) {
      switch (element.data.type) {
        case DataType.CLUSTER: {
          clusters.add(element as GraphCluster)
          break
        }
        case DataType.PLACE:
        case DataType.TRANSITION: {
          nodes.add(element as IGraphNode)
          break
        }
      }
    }

    if (nodes.size + clusters.size <= 1) {
      throw new HierarchyServiceError(i18n.global.t('InvalidSelectionForClustering'))
    }

    const cluster: IGraphCluster = this.create(dao, nodes, clusters, clusterId)
    dao.hasChanges = true

    return cluster
  }

  private create(
    dao: ModelDAO,
    nodes: Set<IGraphNode>,
    clusters: Set<GraphCluster>,
    clusterId: string
  ): IGraphCluster {
    for (const cluster of clusters) {
      nodes.add(cluster)
    }

    // Create cluster data and shape.
    const dataCluster: DataCluster = new DataCluster(clusterId)
    const cluster: GraphCluster = new GraphCluster(dataCluster.id, dataCluster)
    const clusterArcs: Array<IGraphArc> = new Array<IGraphArc>()
    const arcs: Array<IGraphArc> = new Array<IGraphArc>()

    // Reassign graph hierarchy.
    const graph: Graph = dao.graph
    const graphChild: Graph = dataCluster.graph
    graphChild.parentGraph = graph
    for (const cluster of clusters) {
      cluster.graph.parentGraph = graphChild
    }

    for (const node of nodes) {
      node.parentCluster = dataCluster
    }

    // Add the cluster node.
    graph.addNode(cluster)

    // Move nodes and determine wether node is connected to node in or
    // outside of the cluster. All arcs connecting to nodes outside the
    // cluster will be stored in cluster arcs.
    for (const node of nodes) {
      const nodeConnections: Array<IGraphArc> = new Array<IGraphArc>()
      // copy, references are lost after removing from graph
      nodeConnections.push(...node.connections)

      graph.removeNode(node)
      graphChild.addNode(node)

      for (const connection of nodeConnections) {
        if (!nodes.has(connection.targetNode)) {
          // target OUTSIDE
          this.getClusterArc(clusterArcs, cluster, connection.targetNode, connection)
        } else if (!nodes.has(connection.sourceNode)) {
          // source OUTSIDE
          this.getClusterArc(clusterArcs, connection.sourceNode, cluster, connection)
        } else {
          // connection INSIDE
          arcs.push(connection)
        }
      }
    }

    for (const conn of arcs) {
      graphChild.addConnection(conn)
    }

    for (const conn of clusterArcs) {
      graph.addConnection(conn)
    }

    return cluster
  }

  private getClusterArc(
    clusterArcs: Array<IGraphArc>,
    source: IGraphNode,
    target: IGraphNode,
    arcRelated: IGraphArc
  ): IGraphArc | null {
    // DataClusterArc data, dca;

    if (source.data.type != DataType.CLUSTER && target.data.type != DataType.CLUSTER) {
      throw new DataException(i18n.global.t('CannotCreateClusterArc'))
    }

    const idShape: string = this.services.factoryService.getConnectionId(source, target)
    const idData: string = this.services.factoryService.getArcId(source.data, target.data)

    // Check if connection already exists.
    const existingArc: IGraphArc | undefined = clusterArcs.filter(
      (a: IGraphArc) => a.data.source.equals(source.data) && a.data.target.equals(target.data)
    )[0]

    let shape: IGraphArc
    let shapeNew: IGraphArc | null = null
    let data: DataClusterArc
    if (existingArc) {
      shape = existingArc
      data = shape.data as DataClusterArc
    } else {
      data = new DataClusterArc(idData)
      shape = new GraphArc(idShape, source, target, data)
      shapeNew = shape
      clusterArcs.push(shapeNew)
    }

    // Check if the related arc is also a cluster arc. Add all stored arcs
    // to the higher level cluster arc.
    if (arcRelated.data.type == DataType.CLUSTERARC) {
      const dca: DataClusterArc = arcRelated.data as DataClusterArc
      for (const storedArc of dca.storedArcs.values()) {
        data.storedArcs.set(storedArc.id, storedArc)
        // remove reference to currently hidden shape
        storedArc.data.shapes.clear()
        // replace by reference to cluster arc shape
        storedArc.data.shapes.add(shape)
      }
    } else {
      data.storedArcs.set(arcRelated.id, arcRelated)
      // remove reference to currently hidden shape
      arcRelated.data.shapes.clear()
      // replace by reference to cluster arc shape
      arcRelated.data.shapes.add(shape)
    }

    return shapeNew
  }
}
