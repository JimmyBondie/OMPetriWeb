import { Color } from './Color'
import { Function, FunctionType } from './Function'

export class Weight extends Object {
  private _color: Color
  private _function: Function

  public constructor(color: Color) {
    super()
    this._color = color
    this._function = new Function(FunctionType.FUNCTION)
    this._function.addElement(new Function(FunctionType.NUMBER, '1'))
  }

  public get color(): Color {
    return this._color
  }

  public get function(): Function {
    return this._function
  }

  public set function(functionValue: Function) {
    this._function = functionValue
  }
}
