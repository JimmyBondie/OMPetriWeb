import { Model } from '@renderer/core/Model'
import { CustomService } from '../intf'
import { IParameterService } from '../intf/IParameterService'
import { Parameter, ParameterType } from '@renderer/core/Parameter'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import { Function, FunctionType } from '@renderer/core/Function'
import i18n from '@renderer/main'
import { utils } from '@renderer/utils'
import { ReferenceType, ReferencingParameter } from '@renderer/core/Parameter/ReferencingParameter'
import { Color } from '@renderer/core/Color'
import { Arc } from '@renderer/entity/impl/Arc'
import { Weight } from '@renderer/core/Weight'
import { Transition } from '@renderer/entity/impl/Transition'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { DataTransition } from '@renderer/data/impl/DataTransition'
import { DataArc } from '@renderer/data/impl/DataArc'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { ParameterException } from './Exceptions'

export class ParameterService extends CustomService implements IParameterService {
  public add(model: Model, param: Parameter): void {
    model.addParameter(param)
  }

  private clearElementFunctionsUsedParameterReferences(model: Model, element: IElement) {
    for (const id of this.getIdsForUsedParameters(element)) {
      const param: Parameter | undefined = this.findParameter(model, id, element)
      if (!param) {
        throw new ParameterException(
          i18n.global.t('UnavailableParameter', { id: id, usedBy: element.id })
        )
      }

      param.usingElements.delete(element)
    }
  }

  private createReferencingParameter(
    element: IElement,
    paramId: string,
    type: ReferenceType
  ): Parameter {
    const value: string = this.generateValueForReferencingParamter(element.id, type)
    return new ReferencingParameter(paramId, value, element, type)
  }

  private filter(param: Parameter, filter: string): boolean {
    return (
      param.id.toLowerCase().includes(filter) ||
      param.relatedElement?.id.toLowerCase().includes(filter) ||
      (param.relatedElement as IDataElement).labelText.toLowerCase().includes(filter)
    )
  }

  public findParameter(model: Model, id: string, element: IElement): Parameter | undefined {
    let param: Parameter | undefined = undefined

    // highest priority - LOCAL param
    if (element) {
      param = element.getLocalParameter(id)
    }

    // GLOBAL param
    if (!param) {
      param = model.getParameter(id)
    }

    // REFERENCE param
    if (!param) {
      param = this.findReferencingParameter(model, id)
    }

    return param
  }

  private findReferencingParameter(model: Model, paramId: string): Parameter | undefined {
    let param: Parameter | undefined = undefined

    const elementId: string = this.recoverElementIdFromReferencingParameterId(paramId)
    const element: IElement | undefined = model.getElement(elementId)
    if (!element) {
      return undefined
    }

    for (const par of element.relatedParameters) {
      // TODO use regex pattern to detect variations of referencing parameters for the same element
      if (par.id.localeCompare(paramId) == 0) {
        param = par
      }
    }

    if (param) {
      return param
    }

    try {
      const referenceType: ReferenceType = this.recoverReferenceTypeFromParameterId(element)
      param = this.createReferencingParameter(element, paramId, referenceType)
      if (param) {
        model.addParameter(param)
      }
    } catch (e: any) {
      throw new ParameterException(
        i18n.global.t('CannotGenerateReferencingParam', { msg: e.message })
      )
    }

    return param
  }

  private generateValueForReferencingParamter(elementId: string, type: ReferenceType): string {
    switch (type) {
      case ReferenceType.TOKEN:
        return "'.+'.t".replaceAll('.+', elementId)

      case ReferenceType.SPEED:
        return "'.+'.actualSpeed".replaceAll('.+', elementId)
    }
  }

  public getFilteredAndSortedParameterList(
    model: Model,
    element: IDataElement,
    filter: string
  ): Array<Parameter> {
    const all: Array<Parameter> = new Array<Parameter>()
    const locals: Array<Parameter> = new Array<Parameter>()
    const others: Array<Parameter> = new Array<Parameter>()

    for (const arc of model.arcs) {
      if (arc.equals(element)) {
        locals.push(...arc.localParameters)
      } else {
        others.push(...arc.localParameters)
      }
    }

    for (const transition of model.transitions) {
      if (transition.equals(element)) {
        locals.push(...transition.localParameters)
      } else {
        others.push(...transition.localParameters)
      }
    }

    all.push(
      ...locals
        .filter((param: Parameter) => this.filter(param, filter))
        .sort((p1: Parameter, p2: Parameter) => p1.id.localeCompare(p2.id))
    )

    all.push(
      ...model.parameters
        .filter(
          (param: Parameter) => param.type == ParameterType.GLOBAL && this.filter(param, filter)
        )
        .sort((p1: Parameter, p2: Parameter) => p1.id.localeCompare(p2.id))
    )

    all.push(
      ...others
        .filter((param: Parameter) => this.filter(param, filter))
        .sort((p1: Parameter, p2: Parameter) => p1.id.localeCompare(p2.id))
    )

    return all
  }

  public getFilteredChoicesForLocalParameters(model: Model, filter: string): Array<IDataElement> {
    const list: Array<IDataElement> = new Array<IDataElement>()

    list.push(
      ...(model.transitions
        .filter(
          (transition: Transition) =>
            transition.id.toLowerCase().includes(filter) ||
            (transition as DataTransition).labelText.toLowerCase().includes(filter)
        )
        .sort((e1: Transition, e2: Transition) =>
          e1.id.localeCompare(e2.id)
        ) as Array<DataTransition>)
    )

    list.push(
      ...(model.arcs
        .filter(
          (arc: Arc) =>
            arc.id.toLowerCase().includes(filter) ||
            (arc as DataArc).labelText.toLowerCase().includes(filter)
        )
        .sort((e1: Arc, e2: Arc) => e1.id.localeCompare(e2.id)) as Array<DataArc>)
    )

    return list
  }

  private getIdsForUsedParameters(element: IElement): Set<string> {
    switch (element.elementType) {
      case ElementType.ARC: {
        const parameterIds: Set<string> = new Set<string>()
        for (const weight of (element as Arc).weights) {
          for (const id of weight.function.elementIds) {
            parameterIds.add(id)
          }
        }
        return parameterIds
      }

      case ElementType.TRANSITION: {
        return (element as Transition).function.elementIds
      }

      default: {
        throw new ParameterException(i18n.global.t('ElementHasNoFunction', { element: element.id }))
      }
    }
  }

  private recoverElementIdFromReferencingParameterId(paramId: string): string {
    // TODO use regex pattern detection for additional types
    return paramId // simplest and only yet implemented case, paramId matches elementId
  }

  private recoverReferenceTypeFromParameterId(element: IElement): ReferenceType {
    // TODO use regex pattern detection for additional types
    switch (element.elementType) {
      case ElementType.PLACE:
        return ReferenceType.TOKEN

      case ElementType.TRANSITION:
        return ReferenceType.SPEED

      default:
        throw new ParameterException(i18n.global.t('ValueGenerationForTypeNotImplemented'))
    }
  }

  public remove(dao: ModelDAO, param: Parameter) {
    this.validateParamRemoval(param)
    if (param.type == ParameterType.LOCAL) {
      if (param.relatedElement && param.relatedElement instanceof DataTransition) {
        ;(param.relatedElement as DataTransition).removeLocalParameter(param)
      } else {
        throw new ParameterException(i18n.global.t('InconsistencyParamRelatedToNonTransition'))
      }
    } else {
      dao.model.removeParameter(param)
    }
  }

  public setElementFunction(model: Model, element: IElement, func: Function, color?: Color) {
    this.clearElementFunctionsUsedParameterReferences(model, element)
    try {
      switch (element.elementType) {
        case ElementType.ARC: {
          if (color) {
            const arc: Arc = element as Arc
            const weight: Weight | undefined = arc.getWeight(color)
            if (weight) {
              weight.function = func
            }
          }
          break
        }

        case ElementType.TRANSITION: {
          ;(element as Transition).function = func
          break
        }

        default:
          throw new ParameterException(i18n.global.t('ElementNotUsingFunctions'))
      }
    } finally {
      this.setElementFunctionsUsedParameterReferences(model, element)
    }
  }

  private setElementFunctionsUsedParameterReferences(model: Model, element: IElement) {
    for (const id of this.getIdsForUsedParameters(element)) {
      const param: Parameter | undefined = this.findParameter(model, id, element)
      if (!param) {
        throw new ParameterException(
          i18n.global.t('UnavailableParameter', { id: id, usedBy: element.id })
        )
      }

      param.usingElements.add(element)
    }
  }

  public updateParameter(param: Parameter, value: string, unit: string) {
    switch (param.type) {
      case ParameterType.GLOBAL: {
        break
      }

      case ParameterType.LOCAL: {
        break
      }

      default: {
        throw new ParameterException(i18n.global.t('CannotUpdateParameterNonLocalGlobal'))
      }
    }
    param.value = value
    param.unit = unit
  }

  private updateParameterIdsInFunction(functionValue: Function, oldId: string, newId: string) {
    for (const functionElement of functionValue.elements) {
      if (functionElement.type == FunctionType.PARAMETER) {
        if (functionElement.value.localeCompare(oldId) == 0) {
          functionElement.value = newId
        }
      }
    }
  }

  public updateRelatedParameterIds(element: IElement, elementIdNew: string) {
    let paramIdOld: string
    let paramIdNew: string
    let referenceType: ReferenceType | null

    let arc: DataArc
    let transition: DataTransition

    for (const param of element.relatedParameters) {
      referenceType = utils.parameterFactory.recoverReferenceTypeFromParameterValue(param.value)
      if (referenceType == null) {
        continue
      }

      paramIdOld = param.id
      paramIdNew = utils.parameterFactory.generateIdForReferencingParameter(
        elementIdNew,
        referenceType
      )

      for (const usingElement of param.usingElements) {
        if (usingElement instanceof DataArc) {
          arc = usingElement
          for (const weight of arc.weights) {
            this.updateParameterIdsInFunction(weight.function, paramIdOld, paramIdNew)
          }
        } else if (usingElement instanceof DataTransition) {
          transition = usingElement
          this.updateParameterIdsInFunction(transition.function, paramIdOld, paramIdNew)
        }
      }

      param.id = paramIdNew
      param.value = utils.parameterFactory.generateValueForReferencingParameter(
        elementIdNew,
        referenceType
      )
    }
  }

  public validateAndGetFunction(model: Model, element: IElement, functionString: string): Function {
    let func: Function
    try {
      functionString = functionString.replaceAll(' ', '')
      func = utils.functionFactory.build(functionString)
    } catch (e: any) {
      throw new ParameterException(i18n.global.t('MalformedFunctionString'), e)
    }

    for (const candidate of func.elementIds) {
      const param: Parameter | undefined = this.findParameter(model, candidate, element)
      if (!param) {
        throw new ParameterException(
          i18n.global.t('ParameterCannotBeGenerated', { value: candidate })
        )
      }
    }

    return func
  }

  public validateElementRemoval(element: IDataElement) {
    for (const param of element.relatedParameters) {
      this.validateParamRemoval(param)
    }
  }

  private validateParamRemoval(param: Parameter) {
    if (param.usingElements.size > 1) {
      throw new ParameterException(
        i18n.global.t('ParameterReferencedByElement', { param: param.id })
      )
    } else if (param.usingElements.size == 1) {
      if (!param.relatedElement || !param.usingElements.has(param.relatedElement)) {
        throw new ParameterException(
          i18n.global.t('ElementParameterReferencedByElement', {
            element: param.relatedElement ? param.relatedElement.id : 'Null',
            param: param.id
          })
        )
      }
    }
  }
}
