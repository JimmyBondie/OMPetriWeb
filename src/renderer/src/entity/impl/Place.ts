import { ConflictResolutionStrategy } from '@renderer/core/ConflictResolutionStrategy'
import { ElementType } from '../intf/IElement'
import { Node } from './Node'
import { Color } from '@renderer/core/Color'
import { Token } from '@renderer/core/Token'

export enum PlaceType {
  CONTINUOUS,
  DISCRETE
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

  public get tokens(): IterableIterator<Token> {
    return this._tokens.values()
  }

  public set conflictResolutionType(conflictResolutionType: ConflictResolutionStrategy) {
    this._conflictResolutionType = conflictResolutionType
  }

  public set placeType(placeType: PlaceType) {
    this._placeType = placeType
  }

  public addToken(token: Token) {
    if (token) {
      this._tokens.set(token.color, token)
    }
  }

  public getToken(color: Color): Token | undefined {
    return this._tokens.get(color)
  }
}
