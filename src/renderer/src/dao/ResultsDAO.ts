import { ResultSet } from '@renderer/result/ResultSet'
import { Simulation } from '@renderer/result/Simulation'

export class ResultsDAO extends Object {
  private _onAddSimulation: (simulation: Simulation) => void
  private _resultSetStorageMap: Map<[string, Simulation, string, string], ResultSet> = new Map<
    [string, Simulation, string, string],
    ResultSet
  >()
  private _simulations: Array<Simulation> = new Array<Simulation>()

  public constructor(onAddSimulation: (simulation: Simulation) => void) {
    super()
    this._onAddSimulation = onAddSimulation
  }

  public get simulationResults(): Array<Simulation> {
    return this._simulations
  }

  public addResult(resultSet: ResultSet) {
    this._resultSetStorageMap.set(
      [resultSet.simulation.dao.id, resultSet.simulation, resultSet.element.id, resultSet.variable],
      resultSet
    )
  }

  public addSimulation(simulation: Simulation) {
    this._simulations.push(simulation)
    this._onAddSimulation(simulation)
  }

  public containsResult(resultSet: ResultSet): boolean {
    return this._resultSetStorageMap.has([
      resultSet.simulation.dao.id,
      resultSet.simulation,
      resultSet.element.id,
      resultSet.variable
    ])
  }

  public containsSimulation(simulationResult: Simulation): boolean {
    return this._simulations.includes(simulationResult)
  }

  public getResult(resultSet: ResultSet): ResultSet | undefined {
    return this._resultSetStorageMap.get([
      resultSet.simulation.dao.id,
      resultSet.simulation,
      resultSet.element.id,
      resultSet.variable
    ])
  }

  public removeResult(resultSet: ResultSet) {
    this._resultSetStorageMap.delete([
      resultSet.simulation.dao.id,
      resultSet.simulation,
      resultSet.element.id,
      resultSet.variable
    ])
  }
}
