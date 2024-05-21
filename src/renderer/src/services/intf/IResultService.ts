import { Simulation } from '@renderer/result/Simulation'

export interface IResultService {
  addResult(simulationResult: Simulation): boolean
}
