import { ResultSet } from '@renderer/result/ResultSet'
import { Simulation } from '@renderer/result/Simulation'

export interface IResultsXmlConverter {
  exportResultSets(resultSets: Array<ResultSet>): string
  exportSimulationResults(simulationResults: Array<Simulation>): string
  importXml(content: string): Array<Simulation>
}
