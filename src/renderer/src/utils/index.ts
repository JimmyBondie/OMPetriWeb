import { FunctionFactory } from './FunctionFactory'
import { ParameterFactory } from './ParameterFactory'

class UtilManager extends Object {
  private _functionFactory: FunctionFactory = new FunctionFactory()
  private _parameterFactory: ParameterFactory = new ParameterFactory()

  public get functionFactory(): FunctionFactory {
    return this._functionFactory
  }

  public get parameterFactory(): ParameterFactory {
    return this._parameterFactory
  }
}

export const utils: UtilManager = new UtilManager()
