import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IGraphArc } from '../intf/IGraphArc'
import { IGraphNode } from '../intf/IGraphNode'

export class GraphArc extends Object implements IGraphArc {
  private _data: IDataArc
  private _id: string
  private _source: IGraphNode
  private _target: IGraphNode

  public constructor(id: string, source: IGraphNode, target: IGraphNode, data: IDataArc) {
    super()
    this._data = data
    this._id = id
    this._source = source
    this._target = target
  }

  public get data(): IDataArc {
    return this._data
  }

  public get disabled(): boolean {
    return this._data.disabled
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
    return 'graphArc'
  }

  public set disabled(disabled: boolean) {
    this._data.disabled = disabled
  }
}