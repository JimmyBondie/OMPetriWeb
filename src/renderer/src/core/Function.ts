export enum FunctionType {
  FUNCTION,
  NUMBER,
  OPERATOR,
  PARAMETER
}

export class Function extends Object {
  private _elements: Array<Function> = new Array<Function>()
  private _type: FunctionType
  private _unit: string = ''
  private _value: string

  public constructor(type: FunctionType, value: string = '') {
    super()
    this._type = type
    this._value = value
  }

  public get elementIds(): Set<string> {
    let parameterIds: Set<string> = new Set<string>()
    for (const element of this._elements) {
      if (element.type == FunctionType.FUNCTION) {
        element.elementIds.forEach(parameterIds.add, parameterIds)
      } else if (element.type == FunctionType.PARAMETER) {
        parameterIds.add(element.value)
      }
    }
    return parameterIds
  }

  public get elements(): Array<Function> {
    let elementsRecursive: Array<Function> = new Array<Function>()
    for (const element of this._elements) {
      if (element.type == FunctionType.FUNCTION) {
        elementsRecursive = elementsRecursive.concat(element.elements)
      } else {
        elementsRecursive.push(element)
      }
    }
    return elementsRecursive
  }

  public get type(): FunctionType {
    return this._type
  }

  public get unit(): string {
    return this._unit
  }

  public get value(): string {
    return this._value
  }

  public set unit(unit: string) {
    this._unit = unit
  }

  public set value(value: string) {
    this._value = value
  }

  public addElement(element: Function) {
    this._elements.push(element)
  }

  public addElementFirst(element: Function) {
    this._elements.unshift(element)
  }

  public formatString(): string {
    if (this._type == FunctionType.FUNCTION) {
      let functionString: string = ''
      for (const element of this._elements) {
        functionString += element.formatString() + ' '
      }
      return functionString.trim()
    } else {
      return this._value
    }
  }
}
