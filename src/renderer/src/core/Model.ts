import { Arc } from '@renderer/entity/impl/Arc'
import { Color } from './Color'
import { Parameter, ParameterType } from './Parameter'
import { Place } from '@renderer/entity/impl/Place'
import { Transition } from '@renderer/entity/impl/Transition'
import { IArc } from '@renderer/entity/intf/IArc'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import i18n from '@renderer/main'
import { CustomError } from '@renderer/utils/CustomError'
import { INode } from '@renderer/entity/intf/INode'

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

  public get placesSorted(): Array<Place> {
    return this.places.sort((a: Place, b: Place): number => a.id.localeCompare(b.id))
  }

  public get transitions(): Array<Transition> {
    return Array.from(this._transitions.values())
  }

  public get transitionsSorted(): Array<Transition> {
    return this.transitions.sort((a: Transition, b: Transition): number => a.id.localeCompare(b.id))
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
      throw new ModelError(i18n.global.t('IDAlreadyUsedByElement', { id: element.id }))
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
          throw new ModelError(i18n.global.t('ParameterHasSameId'))
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

  public changeId(element: IElement, elementIdNew: string) {
    switch (element.elementType) {
      case ElementType.ARC: {
        if (this._arcs.has(element.id)) {
          this._arcs.delete(element.id)
          this._arcs.set(elementIdNew, element as Arc)
        } else {
          throw new ModelError(i18n.global.t('ChangeIDOfNonExistingArc'))
        }
        break
      }

      case ElementType.PLACE: {
        if (this._places.has(element.id)) {
          this._places.delete(element.id)
          this._places.set(elementIdNew, element as Place)
        } else {
          throw new ModelError(i18n.global.t('ChangeIDOfNonExistingPlace'))
        }
        break
      }

      case ElementType.TRANSITION: {
        if (this._transitions.has(element.id)) {
          this._transitions.delete(element.id)
          this._transitions.set(elementIdNew, element as Transition)
        } else {
          throw new ModelError(i18n.global.t('ChangeIDOfNonExistingTransition'))
        }
        break
      }

      default: {
        throw new ModelError(i18n.global.t('ChangeIDOfUnhandledType'))
      }
    }

    element.id = elementIdNew
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

    return found ? !found.equals(element) : false
  }

  public containsElement(id: string): boolean {
    if (this._arcs.has(id)) {
      return true
    } else if (this._places.has(id)) {
      return true
    } else {
      return this._transitions.has(id)
    }
  }

  public containsParameter(id: string): boolean {
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

  private removeArc(arc: IArc) {
    for (const param of arc.relatedParameters) {
      if (param.usingElements.size > 0) {
        if (param.usingElements.values().next().value != arc) {
          throw new ModelError(
            i18n.global.t('RelatedParamCannotBeDeleted', { element: arc.id, param: param.id })
          )
        }
      }
    }
    let index: number = arc.source.arcsOut.indexOf(arc)
    if (index >= 0) {
      arc.source.arcsOut.splice(index, 1)
    }

    index = arc.target.arcsIn.indexOf(arc)
    if (index >= 0) {
      arc.target.arcsIn.splice(index, 1)
    }

    this._arcs.delete(arc.id)
  }

  public removeElement(element: IElement) {
    switch (element.elementType) {
      case ElementType.ARC: {
        this.removeArc(element as IArc)
        break
      }
      case ElementType.PLACE: {
        this.removeNode(element as INode)
        break
      }
      case ElementType.TRANSITION: {
        this.removeNode(element as INode)
        break
      }
      default:
        throw new ModelError(i18n.global.t('UnhandledElementType'))
    }
  }

  private removeNode(node: INode) {
    for (const param of node.relatedParameters) {
      if (param.usingElements.size > 0) {
        if (param.usingElements.values().next().value != node) {
          throw new ModelError(
            i18n.global.t('RelatedParamCannotBeDeleted', { element: node.id, param: param.id })
          )
        }
      }
    }
    while (node.arcsIn.length > 0) {
      this.removeArc(node.arcsIn[0])
      node.arcsIn.splice(0, 1)
    }

    while (node.arcsOut.length > 0) {
      this.removeArc(node.arcsOut[0])
      node.arcsOut.splice(0, 1)
    }

    if (node instanceof Place) {
      this._places.delete(node.id)
    } else {
      this.removeTransition(node as Transition)
    }
  }

  public removeParameter(param: Parameter) {
    for (const elem of param.usingElements) {
      elem.relatedParameters.delete(param)
    }
    this._parameters.delete(param.id)
  }

  private removeTransition(transition: Transition) {
    for (const id of transition.function.elementIds) {
      this._parameters.get(id)?.usingElements.delete(transition)
    }
    this._transitions.delete(transition.id)
  }
}
