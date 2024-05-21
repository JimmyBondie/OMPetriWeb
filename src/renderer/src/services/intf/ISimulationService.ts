import { ModelDAO } from '@renderer/dao/ModelDAO'

export interface ISimulationService {
  readonly simulationCompilerPath: string
  readonly simulationWorkingDir: string
  startSimulation(
    dao: ModelDAO,
    optionalCompilerArgs: string,
    optionalSimulationArgs: string,
    stopTime: number,
    intervals: number,
    integrator: string,
    log: (text: string) => void
  ): [AbortController, Promise<boolean>]
}
