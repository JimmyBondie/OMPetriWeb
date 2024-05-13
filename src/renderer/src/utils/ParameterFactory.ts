import { Parameter } from '@renderer/core/Parameter'
import { GlobalParameter } from '@renderer/core/Parameter/GlobalParameter'
import { LocalParameter } from '@renderer/core/Parameter/LocalParameter'
import { ReferenceType } from '@renderer/core/Parameter/ReferencingParameter'
import { IElement } from '@renderer/entity/intf/IElement'
import { CustomError } from './CustomError'
import i18n from '@renderer/main'

export class ParameterFactoryException extends CustomError {}

export class ParameterFactory extends Object {
  public createGlobalParameter(id: string, value: string): Parameter {
    return new GlobalParameter(id, value)
  }

  public createLocalParameter(id: string, value: string, reference: IElement): Parameter {
    return new LocalParameter(id, value, reference)
  }

  public generateIdForReferencingParameter(
    elementId: string,
    referenceType: ReferenceType
  ): string {
    // TODO generate pattern for additional types
    switch (referenceType) {
      case ReferenceType.SPEED: {
        return elementId
      }

      case ReferenceType.TOKEN: {
        return elementId
      }

      default:
        return ''
    }
  }

  public generateValueForReferencingParameter(elementId: string, type: ReferenceType): string {
    switch (type) {
      case ReferenceType.TOKEN: {
        return "'.+'.t".replaceAll('.+', elementId)
      }

      case ReferenceType.SPEED: {
        return "'.+'.actualSpeed".replaceAll('.+', elementId)
      }

      default:
        throw new ParameterFactoryException(
          i18n.global.t('ValueGenerationReferenceTypeNotImplemented')
        )
    }
  }

  public recoverReferenceTypeFromParameterValue(parameterValue: string): ReferenceType | null {
    if (parameterValue.match("der\\('.+'.tokenFlow.inflow\\[[0-9]+\\]\\)")) {
      return null
    } else if (parameterValue.match("'.+'.tokenFlow.inflow\\[[0-9]+\\]")) {
      return null
    } else if (parameterValue.match("der\\('.+'.tokenFlow.outflow\\[[0-9]+\\]\\)")) {
      return null
    } else if (parameterValue.match("'.+'.tokenFlow.outflow\\[[0-9]+\\]")) {
      return null
    } else if (parameterValue.match("'.+'.t")) {
      return ReferenceType.TOKEN
    } else if (parameterValue.match("'.+'.actualSpeed")) {
      return ReferenceType.SPEED
    } else if (parameterValue.match("'.+'.fire")) {
      return null
    } else {
      return null
    }
  }
}
