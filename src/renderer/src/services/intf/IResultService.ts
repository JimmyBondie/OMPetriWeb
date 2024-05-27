import { IElement } from '@renderer/entity/intf/IElement'
import { Simulation } from '@renderer/result/Simulation'

export interface IResultService {
  addResult(simulationResult: Simulation): boolean
  getSharedValues(results: Simulation, elements: Array<IElement>): Map<string, Array<string>>
  getValueName(value: string, simulation: Simulation): string
  readonly simulationResults: Array<Simulation>
}
