import { ElementType } from '../intf/IElement'
import { Node } from './Node'

export enum TransitionType {
  CONTINUOUS,
  DISCRETE,
  STOCHASTIC
}

export class Transition extends Node {
  private _transitionType: TransitionType

  public constructor(id: string, transitionType: TransitionType) {
    super(id, ElementType.TRANSITION)
    this._transitionType = transitionType
  }

  public get transitionType(): TransitionType {
    return this._transitionType
  }

  public set transitionType(transitionType: TransitionType) {
    this._transitionType = transitionType
  }
}
