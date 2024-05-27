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

  // Parses a substring. Parses a subject String from a given starting String
  // to a given ending String. Returns NULL if the String cannot be parsed.
  public parseSubstring(subject: string, start: string, end: string): string {
    if (subject == '') return ''

    const s: number = subject.indexOf(start) + start.length
    const e: number = subject.indexOf(end, s)

    if (s >= e) return ''

    return subject.substring(s, e)
  }
}

export const utils: UtilManager = new UtilManager()
