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
  export function toString(arcType: ArcType): string {
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
        name: ArcType.toString(ArcType.NORMAL)
      },
      {
        type: ArcType.INHIBITORY,
        name: ArcType.toString(ArcType.INHIBITORY)
      },
      {
        type: ArcType.TEST,
        name: ArcType.toString(ArcType.TEST)
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

  addWeight(weight: Weight)

  getWeight(color: Color): Weight | undefined
}
