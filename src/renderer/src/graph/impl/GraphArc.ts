import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IGraphArc } from '../intf/IGraphArc'
import { IGraphNode } from '../intf/IGraphNode'
import { EdgeMarkerType, MarkerType } from '@vue-flow/core'
import { DataType } from '@renderer/data/intf/DataType'

export class GraphArc extends Object implements IGraphArc {
  private _data: IDataArc
  private _disabled: boolean = false
  private _id: string
  private _source: IGraphNode
  private _target: IGraphNode

  public markerEnd: EdgeMarkerType = {
    type: MarkerType.ArrowClosed,
    width: 25,
    height: 25
  }

  public constructor(id: string, source: IGraphNode, target: IGraphNode, data: IDataArc) {
    super()
    this._data = data
    this._data.shapes.add(this)
    this._id = id
    this._source = source
    this._target = target
  }

  public get data(): IDataArc {
    return this._data
  }

  public get disabled(): boolean {
    return this._disabled
  }

  public get sourceNode(): IGraphNode {
    return this._source
  }

  public get targetNode(): IGraphNode {
    return this._target
  }

  public get id(): string {
    return this._id
  }

  public get source(): string {
    return this._source.id
  }

  public get target(): string {
    return this._target.id
  }

  public get type(): string {
    if (this._source.data.type == DataType.PLACE) {
      return 'placeToTransition'
    } else {
      return 'transitionToPlace'
    }
  }

  public set disabled(disabled: boolean) {
    this._disabled = disabled
  }
}
