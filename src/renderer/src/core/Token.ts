import { Color } from './Color'

export class Token extends Object {
  private _color: Color
  private _unit: string = ''
  private _valueMax: number = Number.MAX_VALUE
  private _valueMin: number = 0
  private _valueStart: number = 0

  public constructor(color: Color) {
    super()
    this._color = color
  }

  public get color(): Color {
    return this._color
  }

  public get unit(): string {
    return this._unit
  }

  public get valueMax(): number {
    return this._valueMax
  }

  public get valueMin(): number {
    return this._valueMin
  }

  public get valueStart(): number {
    return this._valueStart
  }

  public set unit(unit: string) {
    this._unit = unit
  }

  public set valueMax(valueMax: number) {
    this._valueMax = valueMax
  }

  public set valueMin(valueMin: number) {
    this._valueMin = valueMin
  }

  public set valueStart(valueStart: number) {
    this._valueStart = valueStart
  }
}
