import { ModelDAO } from '@renderer/dao/ModelDAO'
import { CustomService, IServiceManager } from '../intf'
import { ISimulationService } from '../intf/ISimulationService'
import { CustomError } from '@renderer/utils/CustomError'
import { SimulationCompiler } from '../../utils/SimulationCompiler'
import { SimulationServer } from '@renderer/utils/SimulationServer'
import { SimulationExecuter } from '@renderer/utils/SimulationExecuter'
import { References } from '@renderer/core/References'

export class SimulationException extends CustomError {}

export class SimulationService extends CustomService implements ISimulationService {
  private _compilerPath: string = ''
  private _workingDir: string = ''

  public startSimulation(
    dao: ModelDAO,
    optionalCompilerArgs: string,
    optionalSimulationArgs: string,
    stopTime: number,
    intervals: number,
    integrator: string,
    log: (text: string) => void
  ): [AbortController, Promise<boolean>] {
    const controller: AbortController = new AbortController()
    const promise: Promise<boolean> = new Promise((resolve, _) => {
      controller.signal.addEventListener('abort', () => resolve(false))

      const thread: SimulationThread = new SimulationThread(
        this.services,
        dao,
        optionalCompilerArgs,
        optionalSimulationArgs,
        stopTime,
        intervals,
        integrator,
        log
      )
      thread.run().then(() => resolve(true))
    })

    return [controller, promise]
  }

  public get simulationCompilerPath(): string {
    if (this._compilerPath == '') {
      this._compilerPath = this.getCompilerPath()
    }
    return this._compilerPath
  }

  public get simulationWorkingDir(): string {
    if (this._workingDir == '') {
      this._workingDir = this.getWorkingDirectory()
    }
    return this._workingDir
  }

  private getCompilerPath(): string {
    const openModelicaHomeDir: string = 'OPENMODELICAHOME'
    const pathOpenModelica: string | undefined = window.electron.process.env[openModelicaHomeDir]
    if (!pathOpenModelica) {
      throw new SimulationException(
        "'" +
          openModelicaHomeDir +
          "' environment variable is not set! Please install OpenModelica or set the variable correctly."
      )
    }

    if (window.api.fileExists(pathOpenModelica) && window.api.isDirectory(pathOpenModelica)) {
      let pathCompiler: string = window.api.joinPaths(pathOpenModelica, 'bin', 'omc')
      if (window.api.platform == 'win32') {
        pathCompiler = pathCompiler + '.exe'
      }
      return pathCompiler
    } else {
      throw new SimulationException(
        "'" +
          openModelicaHomeDir +
          "' environment variable is not set correctly! Please set the variable correctly or reinstall OpenModelica."
      )
    }
  }

  private getWorkingDirectory(): string {
    let dir: string = window.api.tempDir
    if (!window.api.fileExists(dir) || !window.api.isDirectory(dir)) {
      throw new SimulationException("Application's working directory not accessible!")
    }

    dir = window.api.joinPaths(dir, 'JFX_PetriNet', 'data')
    if (!window.api.fileExists(dir) || !window.api.isDirectory(dir)) {
      window.api.createDir(dir)
    }

    return dir
  }
}

class SimulationThread extends CustomService {
  private _dao: ModelDAO
  private _optionalCompilerArgs: string
  private _optionalSimulationArgs: string
  private _stopTime: number
  private _intervals: number
  private _integrator: string
  private _log: (text: string) => void

  public constructor(
    services: IServiceManager,
    dao: ModelDAO,
    optionalCompilerArgs: string,
    optionalSimulationArgs: string,
    stopTime: number,
    intervals: number,
    integrator: string,
    log: (text: string) => void
  ) {
    super(services)
    this._dao = dao
    this._optionalCompilerArgs = optionalCompilerArgs
    this._optionalSimulationArgs = optionalSimulationArgs
    this._stopTime = stopTime
    this._intervals = intervals
    this._integrator = integrator
    this._log = log
  }

  public async run() {
    this._log('Simulation: Initializing...')

    this._log('Simulation: Building...')
    const simulationReferences: References = await this.runCompiler()

    this._log('Simulation: Creating communication server socket...')
    const simulationServer = new SimulationServer(this._dao, simulationReferences, this._log)
    if (!(await simulationServer.run())) {
      throw new SimulationException('Simulation communication server cannot be started!')
    }

    const simulationExecuter = new SimulationExecuter(
      simulationReferences.pathSimulationExecutable,
      simulationServer.serverPort,
      this._optionalSimulationArgs,
      this._stopTime,
      this._intervals,
      this._integrator
    )
    const [isFailed, output]: [boolean, string] = await simulationExecuter.run()
    if (isFailed) {
      throw new SimulationException('Executing simulation failed!')
    }

    this._log('Simulation: Reading and storing results...')

    this._log('Simulation: Output [START]')
    this._log(output)
    this._log('Simulation: Output [END]')
  }

  private async runCompiler(): Promise<References> {
    const simulationCompiler: SimulationCompiler = new SimulationCompiler(
      this.services,
      this._dao,
      this._optionalCompilerArgs,
      this._log
    )
    return simulationCompiler.run()
  }
}
