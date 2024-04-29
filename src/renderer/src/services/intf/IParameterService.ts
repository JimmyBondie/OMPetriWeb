import { Color } from '@renderer/core/Color'
import { Function } from '@renderer/core/Function'
import { Model } from '@renderer/core/Model'
import { Parameter } from '@renderer/core/Parameter'
import { IElement } from '@renderer/entity/intf/IElement'

export interface IParameterService {
  add(model: Model, param: Parameter): void
  setElementFunction(model: Model, element: IElement, func: Function, color?: Color): void
  validateAndGetFunction(model: Model, element: IElement, functionString: string): Function
}
