import { Simulation } from '@renderer/result/Simulation'
import { CustomService, IServiceManager } from '../intf'
import { IResultService } from '../intf/IResultService'
import { ResultsDAO } from '@renderer/dao/ResultsDAO'
import { utils } from '@renderer/utils'
import { Node } from '@renderer/entity/impl/Node'
import { IArc } from '@renderer/entity/intf/IArc'
import i18n from '@renderer/main'
import { IElement } from '@renderer/entity/intf/IElement'

export class ResultService extends CustomService implements IResultService {
  private readonly valueFire: string = "'.+'.fire"
  private readonly valueSpeed: string = "'.+'.actualSpeed"
  private readonly valueToken: string = "'.+'.t"
  private readonly valueTokenInActual: string = "der\\('.+'.tokenFlow.inflow\\[[0-9]+\\]\\)"
  private readonly valueTokenInTotal: string = "'.+'.tokenFlow.inflow\\[[0-9]+\\]"
  private readonly valueTokenOutActual: string = "der\\('.+'.tokenFlow.outflow\\[[0-9]+\\]\\)"
  private readonly valueTokenOutTotal: string = "'.+'.tokenFlow.outflow\\[[0-9]+\\]"

  private _resultsDAO: ResultsDAO

  public constructor(services: IServiceManager) {
    super(services)
    this._resultsDAO = new ResultsDAO((simulation: Simulation) =>
      this.onAddSimulation.call(this, simulation)
    )
  }

  public get simulationResults(): Array<Simulation> {
    return this._resultsDAO.simulationResults
  }

  public addResult(simulationResult: Simulation): boolean {
    if (this._resultsDAO.containsSimulation(simulationResult)) {
      return false
    }
    this._resultsDAO.addSimulation(simulationResult)
    return true
  }

  public getSharedValues(
    results: Simulation,
    elements: Array<IElement>
  ): Map<string, Array<string>> {
    let valuesTmp: Map<string, Array<string>>
    let valuesShared: Map<string, Array<string>> | undefined = undefined

    for (const element of elements) {
      const values: Set<string> = results.getElementFilter(element)
      valuesTmp = new Map<string, Array<string>>()

      for (const value of values) {
        const name: string = this.getValueName(value, results)
        if (!valuesTmp.has(name)) {
          valuesTmp.set(name, new Array<string>())
        }
        valuesTmp.get(name)?.push(value)
      }

      if (!valuesShared) {
        valuesShared = valuesTmp
      } else {
        const valuesRemoved: Set<string> = new Set<string>()
        for (const key of valuesShared.keys()) {
          if (valuesTmp.has(key)) {
            valuesShared.get(key)?.push(...(valuesTmp.get(key) ?? []))
          } else {
            valuesRemoved.add(key)
          }
        }
        for (const key of valuesRemoved) {
          valuesShared.delete(key)
        }
      }
    }

    if (valuesShared) {
      return valuesShared
    } else {
      return new Map<string, Array<string>>()
    }
  }

  public getValueName(value: string, simulation: Simulation): string {
    let arc: IArc
    let node: Node | undefined
    let indexStr: string
    let index: number

    if (value.match(this.valueTokenInActual)) {
      indexStr = utils.parseSubstring(value, '[', ']')
      if (indexStr == '') {
        return ''
      }

      index = parseInt(indexStr) - 1
      node = simulation.getFilterElement(value) as Node | undefined
      if (!node || node.arcsIn.length == 0) {
        return i18n.global.t('TokenFromIndexActual', { index: index })
      } else {
        arc = node.arcsIn[index]
        return i18n.global.t('TokenFromActual', { element: arc.source.id })
      }
    } else if (value.match(this.valueTokenInTotal)) {
      indexStr = utils.parseSubstring(value, '[', ']')
      if (indexStr == '') {
        return ''
      }

      index = parseInt(indexStr) - 1
      node = simulation.getFilterElement(value) as Node | undefined
      if (!node || node.arcsIn.length == 0) {
        return i18n.global.t('TokenFromIndexTotal', { index: index })
      } else {
        arc = node.arcsIn[index]
        return i18n.global.t('TokenFromTotal', { element: arc.source.id })
      }
    } else if (value.match(this.valueTokenOutActual)) {
      indexStr = utils.parseSubstring(value, '[', ']')
      if (indexStr == '') {
        return ''
      }

      index = parseInt(indexStr) - 1
      node = simulation.getFilterElement(value) as Node | undefined
      if (!node || node.arcsOut.length == 0) {
        return i18n.global.t('TokenToIndexActual', { index: index })
      } else {
        arc = node.arcsOut[index]
        return i18n.global.t('TokenToActual', { element: arc.target.id })
      }
    } else if (value.match(this.valueTokenOutTotal)) {
      indexStr = utils.parseSubstring(value, '[', ']')
      if (indexStr == '') {
        return ''
      }

      index = parseInt(indexStr) - 1
      node = simulation.getFilterElement(value) as Node | undefined
      if (!node || node.arcsOut.length == 0) {
        return i18n.global.t('TokenToIndexTotal', { index: index })
      } else {
        arc = node.arcsOut[index]
        return i18n.global.t('TokenToTotal', { element: arc.target.id })
      }
    } else if (value.match(this.valueFire)) {
      return i18n.global.t('Firing')
    } else if (value.match(this.valueSpeed)) {
      return i18n.global.t('Speed')
    } else if (value.match(this.valueToken)) {
      return i18n.global.t('Token')
    } else {
      return ''
    }
  }

  private onAddSimulation(_: Simulation) {}
}
