import { IElement } from '@renderer/entity/intf/IElement'
import i18n from '@renderer/main'

export enum ParameterType {
  LOCAL,
  GLOBAL,
  REFERENCE
}

export namespace ParameterType {
  export function toString(arcType: ParameterType): string {
    switch (arcType) {
      case ParameterType.LOCAL:
        return i18n.global.t('Local')
      case ParameterType.GLOBAL:
        return i18n.global.t('Global')
      case ParameterType.REFERENCE:
        return i18n.global.t('Reference')
    }
  }

  export function values(): Array<{ type: ParameterType; name: string }> {
    return [
      {
        type: ParameterType.LOCAL,
        name: ParameterType.toString(ParameterType.LOCAL)
      },
      {
        type: ParameterType.GLOBAL,
        name: ParameterType.toString(ParameterType.GLOBAL)
      }
    ]
  }
}

export abstract class Parameter extends Object {
  private _id: string
  private _relatedElement: IElement | null
  private _type: ParameterType
  private _unit: string = ''
  private _usingElements: Set<IElement> = new Set<IElement>()
  private _value: string

  public constructor(
    type: ParameterType,
    id: string,
    value: string,
    relatedElement: IElement | null
  ) {
    super()
    this._id = id
    this._relatedElement = relatedElement
    this._type = type
    this._value = value
  }

  public get id() {
    return this._id
  }

  public get relatedElement(): IElement | null {
    return this._relatedElement
  }

  public get type(): ParameterType {
    return this._type
  }

  public get unit(): string {
    return this._unit
  }

  public get usingElements(): Set<IElement> {
    return this._usingElements
  }

  public get value() {
    return this._value
  }

  public set id(id: string) {
    if (this._type == ParameterType.REFERENCE) {
      this._id = id
    }
  }

  public set type(type: ParameterType) {
    this._type = type
  }

  public set unit(unit: string) {
    this._unit = unit
  }

  public set value(value: string) {
    this._value = value
  }

  public equals(parameter: Parameter): boolean {
    return parameter && parameter.id == this.id && parameter.type == this.type
  }
}
