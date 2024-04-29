import { Color } from '@renderer/core/Color'
import { ArcType, IArc } from '../intf/IArc'
import { ElementType } from '../intf/IElement'
import { INode } from '../intf/INode'
import { Element } from './Element'
import { Weight } from '@renderer/core/Weight'

export class Arc extends Element implements IArc {
  private _arcType: ArcType
  private _conflictResolutionValue: number
  private _source: INode
  private _target: INode
  private _weights: Map<Color, Weight>

  public constructor(id: string, source: INode, target: INode, arcType: ArcType) {
    super(id, ElementType.ARC)
    this._arcType = arcType
    this._conflictResolutionValue = 1.0
    this._source = source
    this._target = target
    this._weights = new Map<Color, Weight>()
  }

  public get arcType(): ArcType {
    return this._arcType
  }

  public get conflictResolutionValue(): number {
    return this._conflictResolutionValue
  }

  public get source(): INode {
    return this._source
  }

  public get target(): INode {
    return this._target
  }

  public get weights(): Array<Weight> {
    return Array.from(this._weights.values())
  }

  public set arcType(arcType: ArcType) {
    this._arcType = arcType
  }

  public set conflictResolutionValue(conflictResolutionValue: number) {
    this._conflictResolutionValue = conflictResolutionValue
  }

  public addWeight(weight: Weight) {
    if (weight) {
      this._weights.set(weight.color, weight)
    }
  }

  public getWeight(color: Color): Weight | undefined {
    return this._weights.get(color)
  }
}
