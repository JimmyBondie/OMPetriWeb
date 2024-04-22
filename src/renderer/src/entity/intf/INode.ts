import { IArc } from './IArc'
import { IElement } from './IElement'

export interface INode extends IElement {
  readonly arcsIn: Array<IArc>
  readonly arcsOut: Array<IArc>
  constant: boolean
}
