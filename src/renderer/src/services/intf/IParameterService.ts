import { Model } from '@renderer/core/Model'
import { Parameter } from '@renderer/core/Parameter'

export interface IParameterService {
  add(model: Model, param: Parameter): void
}
