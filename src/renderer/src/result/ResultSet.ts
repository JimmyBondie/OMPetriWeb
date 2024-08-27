import { IElement } from '@renderer/entity/intf/IElement'
import { Simulation } from './Simulation'
import { ResultsException } from '@renderer/exception/ResultsException'
import i18n from '@renderer/main'

export class ResultSet extends Object {
  private _element: IElement
  private _shown: boolean = false
  private _simulation: Simulation
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

  public get data(): Array<bigint | number> {
    return this._simulation.getData(this._variable)
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

  public get variable(): string {
    return this._variable
  }

  public set shown(shown: boolean) {
    this._shown = shown
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
