import { Arc } from '@renderer/entity/impl/Arc'
import { Color } from './Color'
import { Parameter } from './Parameter'
import { Place } from '@renderer/entity/impl/Place'
import { Transition } from '@renderer/entity/impl/Transition'
import { IArc } from '@renderer/entity/intf/IArc'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'

export class Model extends Object {
  private _arcs: Map<string, Arc> = new Map<string, Arc>()
  private _colors: Map<string, Color> = new Map<string, Color>()
  private _parameters: Map<string, Parameter> = new Map<string, Parameter>()
  private _places: Map<string, Place> = new Map<string, Place>()
  private _transitions: Map<string, Transition> = new Map<string, Transition>()

  public get arcs(): Map<string, Arc> {
    return this._arcs
  }

  public get colors(): Map<string, Color> {
    return this._colors
  }

  public get parameters(): Map<string, Parameter> {
    return this._parameters
  }

  public get places(): Map<string, Place> {
    return this._places
  }

  public get transitions(): Map<string, Transition> {
    return this._transitions
  }

  private addArc(arc: IArc) {
    this._arcs.set(arc.id, arc as Arc)
    arc.source.arcsOut.push(arc)
    arc.target.arcsIn.push(arc)
  }

  public addColor(color: Color) {
    if (color) {
      this._colors.set(color.id, color)
    }
  }

  public addElement(element: IElement) {
    if (this.containsAndNotEqual(element)) {
      return
    }

    switch (element.elementType) {
      case ElementType.ARC:
        this.addArc(element as IArc)
      case ElementType.PLACE:
        this._places.set(element.id, element as Place)
      case ElementType.TRANSITION:
        this._transitions.set(element.id, element as Transition)
    }
  }

  public clear() {
    this._arcs.clear()
    this._colors.clear()
    this._places.clear()
    this._transitions.clear()
  }

  private containsAndNotEqual(element: IElement): boolean {
    let found: IElement | undefined

    switch (element.elementType) {
      case ElementType.ARC:
        found = this._arcs.get(element.id)

      case ElementType.PLACE:
        found = this._places.get(element.id)

      case ElementType.TRANSITION:
        found = this._transitions.get(element.id)
    }

    return found ? found.equals(element) : false
  }
}
