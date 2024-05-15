import { Function, FunctionType } from '@renderer/core/Function'
import i18n from '@renderer/main'
import { CustomError } from './CustomError'

export class FunctionError extends CustomError {}

export class FunctionFactory extends Object {
  private _subFunctions: Map<string, Function> = new Map<string, Function>()
  private _subFunctionsCount: number = 0

  public get numberRegex(): string {
    return '[0-9]+(\\.([0-9]+)?)?([eE](-)?[0-9]+)?'
  }

  public get operatorRegex(): string {
    return '\\b(min\\()|\\b(max\\()|[-+*/^()]'
  }

  public get operatorExtRegex(): string {
    return '\\b(min\\()|\\b(max\\()|[-+*/^(),]'
  }

  public get parameterRegex(): string {
    return '[a-zA-Z_]+([a-zA-Z0-9_]+)?'
  }

  public get subfunctionRegex(): string {
    return '#[0-9]+'
  }

  public build(functionString: string): Function {
    return this.buildSub(functionString, false)
  }

  public buildSub(functionString: string, isSubfunction: boolean): Function {
    const value: Function = new Function(FunctionType.FUNCTION)
    if (functionString == '') {
      return value
    }

    let functionElement: Function

    const numberMatcher: RegExp = new RegExp(this.numberRegex, 'g')

    let patternOperator: string
    if (isSubfunction) {
      patternOperator = this.operatorExtRegex
    } else {
      patternOperator = this.operatorRegex
    }
    const operatorMatcher: RegExp = new RegExp(patternOperator, 'g')

    const parameterMatcher: RegExp = new RegExp(this.parameterRegex, 'g')

    const subfunctionMatcher: RegExp = new RegExp(this.subfunctionRegex, 'g')

    functionString = functionString.replaceAll(' ', '')
    functionString = this.substitute(functionString)

    let foundNumber: RegExpExecArray | null = numberMatcher.exec(functionString)
    let foundOperator: RegExpExecArray | null = operatorMatcher.exec(functionString)
    let foundParameter: RegExpExecArray | null = parameterMatcher.exec(functionString)
    let foundSubfunction: RegExpExecArray | null = subfunctionMatcher.exec(functionString)

    let index: number = 0

    while (index < functionString.length) {
      if (foundNumber && foundNumber.index < index) {
        // detects number in ref param IDs - has to be skipped

        foundNumber = numberMatcher.exec(functionString)
      } else if (foundNumber && foundNumber.index == index) {
        functionElement = new Function(FunctionType.NUMBER)
        functionElement.value = foundNumber[0]
        value.addElement(functionElement)

        index = foundNumber.index + foundNumber[0].length
        foundNumber = numberMatcher.exec(functionString)
      } else if (foundOperator && foundOperator.index == index) {
        functionElement = new Function(FunctionType.OPERATOR)
        functionElement.value = foundOperator[0]
        value.addElement(functionElement)

        index = foundOperator.index + foundOperator[0].length
        foundOperator = operatorMatcher.exec(functionString)
      } else if (foundParameter && foundParameter.index == index) {
        functionElement = new Function(FunctionType.PARAMETER)
        functionElement.value = foundParameter[0]
        value.addElement(functionElement)

        index = foundParameter.index + foundParameter[0].length
        foundParameter = parameterMatcher.exec(functionString)
      } else if (foundSubfunction && foundSubfunction.index == index) {
        const subfunction: Function | undefined = this._subFunctions.get(foundSubfunction[0])
        if (subfunction) {
          value.addElement(subfunction)
        }

        index = foundSubfunction.index + foundSubfunction[0].length
        foundSubfunction = subfunctionMatcher.exec(functionString)
      } else {
        throw new FunctionError(
          i18n.global.t('UnrecognizedSymbol', { symbol: functionString[index], position: index })
        )
      }
    }
    return value
  }

  private getSubFunction(subfunction: string): string {
    let foundOpen: RegExpExecArray | null = new RegExp('\\(').exec(subfunction)
    let foundClosed: RegExpExecArray | null = new RegExp('\\)').exec(subfunction)

    let index: number = 3
    let count: number = 1 // open brackets count

    while (index < subfunction.length) {
      if (foundOpen && foundOpen.index == index) {
        count++
      } else if (foundClosed && foundClosed.index == index) {
        count--
      }
      index++
      if (count == 0) {
        break
      }
    }
    return subfunction.substring(0, index)
  }

  private substitute(functionString: string): string {
    const min: string = 'min('
    const max: string = 'max('

    let subFunctionString: string
    let subFunctionId: string
    let subFunction: Function

    while (functionString.includes(max) || functionString.includes(min)) {
      if (functionString.includes(min)) {
        subFunctionString = this.getSubFunction(
          functionString.substring(functionString.indexOf(min) + min.length)
        )
        subFunction = this.buildSub(subFunctionString, true)
        subFunction.addElementFirst(new Function(FunctionType.OPERATOR, min))
        subFunctionString = min + subFunctionString
      } else {
        subFunctionString = this.getSubFunction(
          functionString.substring(functionString.indexOf(max) + max.length)
        )
        subFunction = this.buildSub(subFunctionString, true)
        subFunction.addElementFirst(new Function(FunctionType.OPERATOR, max))
        subFunctionString = max + subFunctionString
      }

      subFunctionId = '#' + this._subFunctionsCount++
      this._subFunctions.set(subFunctionId, subFunction)
      // subFunctionString = subFunctionString.replaceAll('(', '\\(') // avoid regex clash
      // subFunctionString = subFunctionString.replaceAll(')', '\\)')
      functionString = functionString.replace(subFunctionString, subFunctionId)
    }

    return functionString
  }
}
