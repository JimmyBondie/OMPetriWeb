import { ResultSet } from '@renderer/result/ResultSet'
import { Simulation } from '@renderer/result/Simulation'

export interface IResultsXMLConverter {
  exportResultSets(resultSets: Array<ResultSet>): string
  exportSimulationResults(simulationResults: Array<Simulation>): string
  importXML(content: string): Array<Simulation>
}
