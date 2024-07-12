import { IElement } from '@renderer/entity/intf/IElement'
import i18n from '@renderer/main'
import { ParameterException } from '@renderer/services/impl/Exceptions'

export enum ParameterType {
  LOCAL,
  GLOBAL,
  REFERENCE
}

export namespace ParameterType {
  export function fromString(value: string | null): ParameterType {
    switch (value) {
      case 'LOCAL':
        return ParameterType.LOCAL
      case 'GLOBAL':
        return ParameterType.GLOBAL
      case 'REFERENCE':
        return ParameterType.REFERENCE
      default:
        return ParameterType.LOCAL
    }
  }

  export function toString(placeType: ParameterType): string {
    switch (placeType) {
      case ParameterType.LOCAL:
        return 'LOCAL'
      case ParameterType.GLOBAL:
        return 'GLOBAL'
      case ParameterType.REFERENCE:
        return 'REFERENCE'
    }
  }

  export function toText(arcType: ParameterType): string {
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
        name: ParameterType.toText(ParameterType.LOCAL)
      },
      {
        type: ParameterType.GLOBAL,
        name: ParameterType.toText(ParameterType.GLOBAL)
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
    } else {
      throw new ParameterException(i18n.global.t('ShouldNotChangeParameterID'))
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
