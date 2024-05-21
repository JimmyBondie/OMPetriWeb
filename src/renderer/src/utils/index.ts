import { FunctionFactory } from './FunctionFactory'
import { OpenModelicaExporter } from './OpenModelicaExporter'
import { ParameterFactory } from './ParameterFactory'

class UtilManager extends Object {
  private _functionFactory: FunctionFactory = new FunctionFactory()
  private _openModelicaExporter: OpenModelicaExporter = new OpenModelicaExporter()
  private _parameterFactory: ParameterFactory = new ParameterFactory()

  public get functionFactory(): FunctionFactory {
    return this._functionFactory
  }

  public get openModelicaExporter(): OpenModelicaExporter {
    return this._openModelicaExporter
  }

  public get parameterFactory(): ParameterFactory {
    return this._parameterFactory
  }
}

export const utils: UtilManager = new UtilManager()
