import { IElement } from '@renderer/entity/intf/IElement'
import { Simulation } from './Simulation'
import { ResultsException } from '@renderer/exception/ResultsException'
import i18n from '@renderer/main'

export class ResultSet extends Object {
  private _autoAdding: boolean = false
  private _dataProcessIndex: number = 0
  private _element: IElement
  private _shown: boolean = false
  private _simulation: Simulation
  private _timeLastStatusChange: number = Date.now()
  private _variable: string

  public constructor(simulation: Simulation, element: IElement, variable: string) {
    super()
    this._simulation = simulation
    this._element = element
    this._variable = variable
    if (!simulation.getData(variable)) {
      throw new ResultsException(
        i18n.global.t('DataCannotBeFoundInSimulation', { variable: variable })
      )
    }
  }

  public get autoAdding(): boolean {
    return this._autoAdding
  }

  public get data(): Array<BigInt | number> {
    return this._simulation.getData(this._variable)
  }

  //  Gets the index that indicates which data points have already been
  //  processed for producing the line chart series. Useful when applying
  //  downsampling, as the actual list size will not reflect the number
  //  of processed data points.
  public get dataProcessedIndex(): number {
    return this._dataProcessIndex
  }

  public get element(): IElement {
    return this._element
  }

  public get shown(): boolean {
    return this._shown
  }

  public get simulation(): Simulation {
    return this._simulation
  }

  // Gets the time in milliseconds the for the latest shown status change.
  public get timeLastShownStatusChange(): number {
    return this._timeLastStatusChange
  }

  public get variable(): string {
    return this._variable
  }

  public set autoAdding(autoAdding: boolean) {
    this._autoAdding = autoAdding
  }

  // Sets the index to which data points have already been processed for
  // producing the line chart series.
  public set dataProcessedIndex(dataProcessIndex: number) {
    this._dataProcessIndex = dataProcessIndex
  }

  public set shown(shown: boolean) {
    this._shown = shown
    this._timeLastStatusChange = Date.now()
  }

  public equals(data: ResultSet): boolean {
    if (!data.simulation.equals(this._simulation)) {
      return false
    }
    if (data.element.id.localeCompare(this._element.id) != 0) {
      return false
    }
    return data.variable.localeCompare(this._variable) == 0
  }
}
