import i18n from '@renderer/main'
import { services } from '@renderer/services'
import { SimulationException } from '@renderer/services/impl/SimulationService'

export class SimulationExecuter extends Object {
  private _integrator: string
  private _intervals: number
  private _log: (text: string) => void
  private _optionalSimulationArgs: string
  private _serverPort: number
  private _simulationExecutable: string
  private _stopTime: number

  public constructor(
    simulationExecutable: string,
    serverPort: number,
    optionalSimulationArgs: string,
    stopTime: number,
    intervals: number,
    integrator: string,
    log: (text: string) => void
  ) {
    super()
    this._integrator = integrator
    this._intervals = intervals
    this._log = log
    this._optionalSimulationArgs = optionalSimulationArgs
    this._serverPort = serverPort
    this._simulationExecutable = simulationExecutable
    this._stopTime = stopTime
  }

  public async run(): Promise<[boolean, string]> {
    let isFailed: boolean = false
    if (this._stopTime == 0 || this._intervals == 0) {
      return [isFailed, '']
    }

    let output: string = ''
    try {
      output = await this.runSimulation()
    } catch (e: any) {
      isFailed = true
      throw new SimulationException(i18n.global.t('FailedToStartSimulationProcess'))
    }

    return [isFailed, output]
  }

  private async runSimulation(): Promise<string> {
    const override: string = `-override=outputFormat=ia,stopTime=${this._stopTime},stepSize=${this._stopTime / this._intervals},tolerance=0.0001`

    const cmdLineArgs: Array<string> = new Array<string>()
    cmdLineArgs.push(`-s=${this._integrator}`)
    cmdLineArgs.push(override)
    cmdLineArgs.push(`-port=${this._serverPort}`)
    cmdLineArgs.push('-lv=LOG_STATS')

    if (this._optionalSimulationArgs != '') {
      cmdLineArgs.push(...this._optionalSimulationArgs.split(' '))
    }

    let output: string = ''
    this._log(i18n.global.t('SimulationOutputStart'))
    await window.api.spawn(
      this._simulationExecutable,
      cmdLineArgs,
      services.simulationService.simulationWorkingDir,
      (text: string) => {
        output += text
        this._log(text)
      }
    )
    this._log(i18n.global.t('SimulationOutputEnd'))

    return output
  }
}
