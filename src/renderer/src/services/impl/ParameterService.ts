import { Model } from '@renderer/core/Model'
import { CustomService } from '../intf'
import { IParameterService } from '../intf/IParameterService'
import { Parameter } from '@renderer/core/Parameter'
import { ElementType, IElement } from '@renderer/entity/intf/IElement'
import { Function } from '@renderer/core/Function'
import i18n from '@renderer/main'
import { utils } from '@renderer/utils'
import { ReferenceType, ReferencingParameter } from '@renderer/core/Parameter/ReferencingParameter'
import { Color } from '@renderer/core/Color'
import { Arc } from '@renderer/entity/impl/Arc'
import { Weight } from '@renderer/core/Weight'
import { Transition } from '@renderer/entity/impl/Transition'
import { CustomError } from '@renderer/utils/CustomError'

export class ParameterException extends CustomError {}

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

  private findParameter(model: Model, id: string, element: IElement): Parameter | undefined {
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
      if (par.id.localeCompare(paramId)) {
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
}
