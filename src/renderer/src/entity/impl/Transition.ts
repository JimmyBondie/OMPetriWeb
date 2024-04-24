import { Function, FunctionType } from '@renderer/core/Function'
import { ElementType } from '../intf/IElement'
import { Node } from './Node'

export enum TransitionType {
  CONTINUOUS,
  DISCRETE,
  STOCHASTIC
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
    return this.function
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
