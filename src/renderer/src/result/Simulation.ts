import { References } from '@renderer/core/References'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import { IElement } from '@renderer/entity/intf/IElement'
import { ResultsException } from '@renderer/exception/ResultsException'
import i18n from '@renderer/main'

export class Simulation extends Object {
  private _dao: ModelDAO
  private _dateTime: Date = new Date()
  private _resultsMap: Map<string, Array<bigint | number>>
  private _variableReferences: References
  private _variables: Array<string>

  public constructor(dataDao: ModelDAO, variables: Array<string>, variableReferences: References) {
    super()
    this._dao = dataDao
    this._variables = variables
    this._variableReferences = variableReferences
    this._resultsMap = new Map<string, Array<bigint | number>>()
    for (const variable of this._variables) {
      if (this._resultsMap.has(variable)) {
        throw new ResultsException(
          i18n.global.t('ResultsAlreadyContainsListForVariable', { variable: variable })
        )
      }
      this._resultsMap.set(variable, new Array<bigint | number>())
    }
  }

  public get dao(): ModelDAO {
    return this._dao
  }

  public get dateTime(): Date {
    return this._dateTime
  }

  public get dateTimeString(): string {
    return this._dateTime.toLocaleString()
  }

  // Gets all elements that are referenced in the simulation data.
  public get elements(): Array<IElement> {
    return Array.from(this._variableReferences.elementToFilterReferences.keys())
  }

  public get timeData(): Array<bigint | number> | undefined {
    const data: Array<bigint | number> | undefined = this._resultsMap.get('time')
    if (data) {
      return data
    } else {
      return new Array<bigint | number>()
    }
  }

  public set dateTime(dateTime: Date) {
    this._dateTime = dateTime
  }

  // Adds data. Appends data to the existing data lists for each variable.
  public addData(data: Array<bigint | number>) {
    if (data.length != this._variables.length) {
      throw new ResultsException(i18n.global.t('DataSizeDoesNotMatchVariables'))
    }
    for (let i = 0; i < data.length; i++) {
      const result: Array<bigint | number> | undefined = this._resultsMap.get(this._variables[i])
      if (result) {
        result.push(data[i])
      }
    }
  }

  public equals(simulation: Simulation): boolean {
    if (simulation.dateTime != this._dateTime) {
      return false
    }

    return this._dao.id.localeCompare(simulation.dao.id) == 0
  }

  // Gets data associated to a filter variable.
  public getData(variable: string): Array<bigint | number> {
    const data: Array<bigint | number> | undefined = this._resultsMap.get(variable)
    if (data) {
      return data
    } else {
      return new Array<bigint | number>()
    }
  }

  // Gets the filter variables related to an element.
  public getElementFilter(element: IElement): Set<string> {
    const filter: Set<string> | undefined =
      this._variableReferences.elementToFilterReferences.get(element)
    if (filter) {
      return filter
    } else {
      return new Set<string>()
    }
  }

  // Gets the referenced element for a filter variable.
  public getFilterElement(variable: string): IElement | undefined {
    return this._variableReferences.filterToElementReferences.get(variable)
  }
}
