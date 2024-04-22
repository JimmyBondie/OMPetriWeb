import { IArc } from '../intf/IArc'
import { ElementType } from '../intf/IElement'
import { INode } from '../intf/INode'
import { Element } from './Element'

export abstract class Node extends Element implements INode {
  private _arcsIn: Array<IArc>
  private _arcsOut: Array<IArc>
  private _constant: boolean

  public constructor(id: string, elementType: ElementType) {
    super(id, elementType)
    this._arcsIn = new Array<IArc>()
    this._arcsOut = new Array<IArc>()
    this._constant = false
  }

  public get arcsIn(): Array<IArc> {
    return this._arcsIn
  }

  public get arcsOut(): Array<IArc> {
    return this._arcsOut
  }

  public get constant(): boolean {
    return this._constant
  }

  public set constant(constant: boolean) {
    this._constant = constant
  }
}
