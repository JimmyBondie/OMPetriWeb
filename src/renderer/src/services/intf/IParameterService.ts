import { Color } from '@renderer/core/Color'
import { Function } from '@renderer/core/Function'
import { Model } from '@renderer/core/Model'
import { Parameter } from '@renderer/core/Parameter'
import { IDataElement } from '@renderer/data/intf/IDataElement'
import { IElement } from '@renderer/entity/intf/IElement'

export interface IParameterService {
  add(model: Model, param: Parameter): void
  getFilteredAndSortedParameterList(
    model: Model,
    element: IDataElement,
    filter: string
  ): Array<Parameter>
  getFilteredChoicesForLocalParameters(model: Model, filter: string): Array<IDataElement>
  setElementFunction(model: Model, element: IElement, func: Function, color?: Color): void
  updateRelatedParameterIds(element: IElement, elementIdNew: string): void
  validateAndGetFunction(model: Model, element: IElement, functionString: string): Function
  validateElementRemoval(element: IDataElement): void
}
