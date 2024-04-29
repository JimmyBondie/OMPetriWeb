import { Weight } from '@renderer/core/Weight'
import { IElement } from './IElement'
import { INode } from './INode'
import { Color } from '@renderer/core/Color'

export enum ArcType {
  NORMAL,
  INHIBITORY,
  TEST
}

export interface IArc extends IElement {
  arcType: ArcType
  conflictResolutionValue: number
  readonly source: INode
  readonly target: INode
  readonly weights: Array<Weight>

  addWeight(weight: Weight)

  getWeight(color: Color): Weight | undefined
}
