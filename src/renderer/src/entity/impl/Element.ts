import { Parameter } from '@renderer/core/Parameter'
import { ElementType, IElement } from '../intf/IElement'

export class Element extends Object implements IElement {
  private _disabled: boolean
  private _elementType: ElementType
  private _id: string
  private _localParameters: Map<string, Parameter>
  private _relatedParameters: Set<Parameter>

  public constructor(id: string, elementType: ElementType) {
    super()
    this._disabled = false
    this._elementType = elementType
    this._id = id
    this._localParameters = new Map<string, Parameter>()
    this._relatedParameters = new Set<Parameter>()
  }

  public get disabled(): boolean {
    return this._disabled
  }

  public get elementType(): ElementType {
    return this._elementType
  }

  public get id(): string {
    return this._id
  }

  public get localParameters(): Array<Parameter> {
    return Array.from(this._localParameters.values())
  }

  public get relatedParameters(): Set<Parameter> {
    return this._relatedParameters
  }

  public set disabled(disabled: boolean) {
    this._disabled = disabled
  }

  public set elementType(elementType: ElementType) {
    this._elementType = elementType
  }

  public set id(id: string) {
    this._id = id
  }

  public addLocalParameter(parameter: Parameter) {
    if (parameter) {
      this._localParameters.set(parameter.id, parameter)
    }
  }

  public getLocalParameter(id: string): Parameter | undefined {
    return this._localParameters.get(id)
  }

  public equals(element: IElement): boolean {
    return element && element.id == this.id && element.elementType == this.elementType
  }

  public removeLocalParameter(parameter: Parameter) {
    this._localParameters.delete(parameter.id)
  }
}
