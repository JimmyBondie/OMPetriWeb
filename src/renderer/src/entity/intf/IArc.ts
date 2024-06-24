import { Weight } from '@renderer/core/Weight'
import { IElement } from './IElement'
import { INode } from './INode'
import { Color } from '@renderer/core/Color'
import i18n from '@renderer/main'

export enum ArcType {
  NORMAL,
  INHIBITORY,
  TEST
}

export namespace ArcType {
  export function fromString(value: string | null): ArcType {
    switch (value) {
      case 'NORMAL':
        return ArcType.NORMAL
      case 'DISCRETE':
        return ArcType.INHIBITORY
      case 'TEST':
        return ArcType.TEST
      default:
        return ArcType.NORMAL
    }
  }

  export function toString(placeType: ArcType): string {
    switch (placeType) {
      case ArcType.NORMAL:
        return 'NORMAL'
      case ArcType.INHIBITORY:
        return 'INHIBITORY'
      case ArcType.TEST:
        return 'TEST'
    }
  }

  export function toText(arcType: ArcType): string {
    switch (arcType) {
      case ArcType.NORMAL:
        return i18n.global.t('Normal')
      case ArcType.INHIBITORY:
        return i18n.global.t('Inhibitor')
      case ArcType.TEST:
        return i18n.global.t('Test')
    }
  }

  export function values(): Array<{ type: ArcType; name: string }> {
    return [
      {
        type: ArcType.NORMAL,
        name: ArcType.toText(ArcType.NORMAL)
      },
      {
        type: ArcType.INHIBITORY,
        name: ArcType.toText(ArcType.INHIBITORY)
      },
      {
        type: ArcType.TEST,
        name: ArcType.toText(ArcType.TEST)
      }
    ]
  }
}

export interface IArc extends IElement {
  arcType: ArcType
  conflictResolutionValue: number
  readonly source: INode
  readonly target: INode
  readonly weights: Array<Weight>

  addWeight(weight: Weight): void

  getWeight(color: Color): Weight | undefined
}
