import { DataCluster } from '@renderer/data/impl/DataCluster'
import { IGraphCluster } from '../intf/IGraphCluster'
import { GraphNode } from './GraphNode'
import { Graph } from '../Graph'

export class GraphCluster extends GraphNode implements IGraphCluster {
  private _dataCluster: DataCluster

  public constructor(id: string, dataCluster: DataCluster) {
    super(id, dataCluster)
    this._dataCluster = dataCluster
    this._dataCluster.shapes.add(this)
  }

  public get data(): DataCluster {
    return this._dataCluster
  }

  public get disabled(): boolean {
    return this._dataCluster.disabled
  }

  public get graph(): Graph {
    return this._dataCluster.graph
  }

  public get type(): string {
    return 'graphCluster'
  }

  public get xCoordinate(): number {
    return super.xCoordinate
  }

  public get yCoordinate(): number {
    return super.yCoordinate
  }

  public set disabled(disabled: boolean) {
    this._dataCluster.disabled = disabled
  }

  public set xCoordinate(xCoordinate: number) {
    for (const node of this._dataCluster.graph.nodes) {
      node.xCoordinate += super.xCoordinate - xCoordinate
    }
    let min: number = Infinity
    for (const node of this._dataCluster.graph.nodes) {
      if (node.xCoordinate < min) {
        min = node.xCoordinate
      }
    }
    if (min < 0) {
      for (const node of this._dataCluster.graph.nodes) {
        node.xCoordinate -= min
      }
    }

    super.xCoordinate = xCoordinate
  }

  public set yCoordinate(yCoordinate: number) {
    for (const node of this._dataCluster.graph.nodes) {
      node.yCoordinate += super.yCoordinate - yCoordinate
    }
    let min: number = Infinity
    for (const node of this._dataCluster.graph.nodes) {
      if (node.yCoordinate < min) {
        min = node.yCoordinate
      }
    }
    if (min < 0) {
      for (const node of this._dataCluster.graph.nodes) {
        node.yCoordinate -= min
      }
    }

    super.yCoordinate = yCoordinate
  }
}
