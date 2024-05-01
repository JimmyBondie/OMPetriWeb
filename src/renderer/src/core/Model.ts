import { Arc } from '@renderer/entity/impl/Arc'
import { Color } from './Color'
import { Parameter, ParameterType } from './Parameter'
import { Place } from '@renderer/entity/impl/Place'
import { Transition } from '@renderer/entity/impl/Transition'
import { IArc } from '@renderer/entity/intf/IArc'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import i18n from '@renderer/main'
import { CustomError } from '@renderer/utils/CustomError'

export class ModelError extends CustomError {}

export class Model extends Object {
  private _arcs: Map<string, Arc> = new Map<string, Arc>()
  private _colors: Map<string, Color> = new Map<string, Color>()
  private _parameters: Map<string, Parameter> = new Map<string, Parameter>()
  private _places: Map<string, Place> = new Map<string, Place>()
  private _transitions: Map<string, Transition> = new Map<string, Transition>()

  public get arcs(): Array<Arc> {
    return Array.from(this._arcs.values())
  }

  public get colors(): Array<Color> {
    return Array.from(this._colors.values())
  }

  public get parameters(): Array<Parameter> {
    return Array.from(this._parameters.values())
  }

  public get places(): Array<Place> {
    return Array.from(this._places.values())
  }

  public get transitions(): Array<Transition> {
    return Array.from(this._transitions.values())
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
      case ElementType.ARC: {
        this.addArc(element as IArc)
        break
      }
      case ElementType.PLACE: {
        this._places.set(element.id, element as Place)
        break
      }
      case ElementType.TRANSITION: {
        this._transitions.set(element.id, element as Transition)
        break
      }
    }
  }

  public addParameter(param: Parameter) {
    switch (param.type) {
      case ParameterType.GLOBAL: {
        if (this.containsParameter(param.id)) {
          throw new ModelError('ParameterHasSameId')
        }
        this._parameters.set(param.id, param)
        break
      }

      case ParameterType.LOCAL: {
        if (!param.relatedElement || param.relatedElement.getLocalParameter(param.id)) {
          throw new ModelError(i18n.global.t('ParameterHasSameId'))
        }
        param.relatedElement.addLocalParameter(param)
        break
      }

      case ParameterType.REFERENCE: {
        if (param.relatedElement) {
          param.relatedElement.addLocalParameter(param)
        }
        break
      }

      default: {
        throw new ModelError(i18n.global.t('ImportFailedUnhandledParamType'))
      }
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
      case ElementType.ARC: {
        found = this._arcs.get(element.id)
        break
      }

      case ElementType.PLACE: {
        found = this._places.get(element.id)
        break
      }

      case ElementType.TRANSITION: {
        found = this._transitions.get(element.id)
        break
      }
    }

    return found ? found.equals(element) : false
  }

  private containsParameter(id: string): boolean {
    return this._parameters.has(id)
  }

  public getColor(id: string): Color | undefined {
    return this._colors.get(id)
  }

  public getElement(id: string): IElement | undefined {
    if (this._places.has(id)) {
      return this._places.get(id)
    } else if (this._transitions.has(id)) {
      return this._transitions.get(id)
    } else if (this._arcs.has(id)) {
      return this._arcs.get(id)
    } else {
      return undefined
    }
  }

  public getParameter(id: string): Parameter | undefined {
    return this._parameters.get(id)
  }
}
