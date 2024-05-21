import { Simulation } from '@renderer/result/Simulation'
import { CustomService, IServiceManager } from '../intf'
import { IResultService } from '../intf/IResultService'
import { ResultsDAO } from '@renderer/dao/ResultsDAO'

export class ResultService extends CustomService implements IResultService {
  private _resultsDAO: ResultsDAO

  public constructor(services: IServiceManager) {
    super(services)
    this._resultsDAO = new ResultsDAO((simulation: Simulation) =>
      this.onAddSimulation.call(this, simulation)
    )
  }

  public addResult(simulationResult: Simulation): boolean {
    if (this._resultsDAO.containsSimulation(simulationResult)) {
      return false
    }
    this._resultsDAO.addSimulation(simulationResult)
    return true
  }

  private onAddSimulation(_: Simulation) {}
}
