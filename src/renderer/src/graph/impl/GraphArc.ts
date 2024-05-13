import { IDataArc } from '@renderer/data/intf/IDataArc'
import { IGraphArc } from '../intf/IGraphArc'
import { IGraphNode } from '../intf/IGraphNode'
import { DataType } from '@renderer/data/intf/DataType'

export class GraphArc extends Object implements IGraphArc {
  private _data: IDataArc
  private _disabled: boolean = false
  private _id: string
  private _source: IGraphNode
  private _target: IGraphNode

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

    let active: boolean
    if (disabled) {
      // arc disabled

      if (!this._source.disabled) {
        // source not disabled
        // for all related connections
        active = Array.from(this._source.connections).some((conn: IGraphArc) => !conn.disabled) // check if there is any enabled connection

        if (!active) {
          // no active connection found, indicate that node is disabled
          this._source.disabled = disabled
        }
      }

      if (!this._target.disabled) {
        // target not disabled
        // for all related connections
        active = Array.from(this._target.connections).some((conn: IGraphArc) => !conn.disabled) // check if there is any enabled connection

        if (!active) {
          // no active connection found, indicate that node is disabled
          this._target.disabled = disabled
        }
      }
    } else {
      // arc enabled

      if (
        !this._source.data.disabled && // source data enabled
        this._source.disabled
      ) {
        // node disabled
        this._source.disabled = false
      }
      if (
        !this._target.data.disabled && // target data enabled
        this._target.disabled
      ) {
        // node disabled
        this._target.disabled = false
      }
    }
  }
}
