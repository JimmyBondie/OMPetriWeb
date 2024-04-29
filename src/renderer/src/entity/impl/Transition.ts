import { Function, FunctionType } from '@renderer/core/Function'
import { ElementType } from '../intf/IElement'
import { Node } from './Node'
import i18n from '@renderer/main'

export enum TransitionType {
  CONTINUOUS,
  DISCRETE,
  STOCHASTIC
}

export namespace TransitionType {
  export function toString(transitionType: TransitionType): string {
    switch (transitionType) {
      case TransitionType.CONTINUOUS:
        return i18n.global.t('Continuous')
      case TransitionType.DISCRETE:
        return i18n.global.t('Discrete')
      case TransitionType.STOCHASTIC:
        return i18n.global.t('Stochastic')
    }
  }

  export function values(): Array<{ type: TransitionType; name: string }> {
    return [
      {
        type: TransitionType.CONTINUOUS,
        name: TransitionType.toString(TransitionType.CONTINUOUS)
      },
      {
        type: TransitionType.DISCRETE,
        name: TransitionType.toString(TransitionType.DISCRETE)
      },
      {
        type: TransitionType.STOCHASTIC,
        name: TransitionType.toString(TransitionType.STOCHASTIC)
      }
    ]
  }
}

export class Transition extends Node {
  private _function: Function
  private _transitionType: TransitionType

  public constructor(id: string, transitionType: TransitionType) {
    super(id, ElementType.TRANSITION)
    this._function = new Function(FunctionType.FUNCTION)
    this._function.addElement(new Function(FunctionType.NUMBER, '1'))
    this._transitionType = transitionType
  }

  public get function(): Function {
    return this._function
  }

  public get transitionType(): TransitionType {
    return this._transitionType
  }

  public set function(value: Function) {
    this._function = value
  }

  public set transitionType(transitionType: TransitionType) {
    this._transitionType = transitionType
  }
}
