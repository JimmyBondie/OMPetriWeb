import { ConflictResolutionStrategy } from '@renderer/core/ConflictResolutionStrategy'
import { ElementType } from '../intf/IElement'
import { Node } from './Node'
import { Color } from '@renderer/core/Color'
import { Token } from '@renderer/core/Token'
import i18n from '@renderer/main'

export enum PlaceType {
  CONTINUOUS = 'CONTINUOUS',
  DISCRETE = 'DISCRETE'
}

export namespace PlaceType {
  export function toString(placeType: PlaceType): string {
    switch (placeType) {
      case PlaceType.CONTINUOUS:
        return i18n.global.t('Continuous')
      case PlaceType.DISCRETE:
        return i18n.global.t('Discrete')
    }
  }

  export function values(): Array<{ type: PlaceType; name: string }> {
    return [
      {
        type: PlaceType.CONTINUOUS,
        name: PlaceType.toString(PlaceType.CONTINUOUS)
      },
      {
        type: PlaceType.DISCRETE,
        name: PlaceType.toString(PlaceType.DISCRETE)
      }
    ]
  }
}

export class Place extends Node {
  private _conflictResolutionType: ConflictResolutionStrategy
  private _placeType: PlaceType
  private _tokens: Map<Color, Token>

  public constructor(
    id: string,
    placeType: PlaceType,
    conflictResolutionType: ConflictResolutionStrategy
  ) {
    super(id, ElementType.PLACE)
    this._conflictResolutionType = conflictResolutionType
    this._placeType = placeType
    this._tokens = new Map<Color, Token>()
  }

  public get conflictResolutionType(): ConflictResolutionStrategy {
    return this._conflictResolutionType
  }

  public get placeType(): PlaceType {
    return this._placeType
  }

  public get token(): number {
    if (this._tokens.size > 0) {
      return this.tokens[0].valueStart
    } else {
      return 0
    }
  }

  public get tokenMax(): number {
    if (this._tokens.size > 0) {
      return this.tokens[0].valueMax
    } else {
      return 0
    }
  }

  public get tokenMin(): number {
    if (this._tokens.size > 0) {
      return this.tokens[0].valueMin
    } else {
      return 0
    }
  }

  public get tokens(): Array<Token> {
    return Array.from(this._tokens.values())
  }

  public set conflictResolutionType(conflictResolutionType: ConflictResolutionStrategy) {
    this._conflictResolutionType = conflictResolutionType
  }

  public set placeType(placeType: PlaceType) {
    this._placeType = placeType
  }

  public set token(token: number) {
    if (this._tokens.size > 0) {
      this.tokens[0].valueStart = token
    }
  }

  public set tokenMax(tokenMax: number) {
    if (this._tokens.size > 0) {
      this.tokens[0].valueMax = tokenMax
    }
  }

  public set tokenMin(tokenMin: number) {
    if (this._tokens.size > 0) {
      this.tokens[0].valueMin = tokenMin
    }
  }

  public addToken(token: Token) {
    if (token) {
      this._tokens.set(token.color, token)
    }
  }

  public getColor(): Color | undefined {
    if (this._tokens.size > 0) {
      return this.getColors()[0]
    } else {
      return undefined
    }
  }

  public getColors(): Array<Color> {
    return Array.from(this._tokens.keys())
  }

  public getToken(color: Color): Token | undefined {
    return this._tokens.get(color)
  }
}
