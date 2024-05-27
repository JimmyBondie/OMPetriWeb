import { ModelDAO } from '@renderer/dao/ModelDAO'
import { CustomService, IServiceManager } from '../services/intf'
import { SimulationException } from '../services/impl/SimulationService'
import { utils } from '@renderer/utils'
import { References } from '@renderer/core/References'
import i18n from '@renderer/main'

export class SimulationCompiler extends CustomService {
  private _dao: ModelDAO
  private _log: (text: string) => void
  private _optionalCompilerArgs: string

  public constructor(
    services: IServiceManager,
    dao: ModelDAO,
    optionalCompilerArgs: string,
    log: (text: string) => void
  ) {
    super(services)
    this._dao = dao
    this._log = log
    this._optionalCompilerArgs = optionalCompilerArgs
  }

  private async buildSimulation(
    compilerPath: string,
    fileMos: string,
    workingDir: string
  ): Promise<string> {
    const cmdLineArgs: Array<string> = new Array<string>()
    cmdLineArgs.push(fileMos)
    if (this._optionalCompilerArgs != '') {
      cmdLineArgs.push(...this._optionalCompilerArgs.split(' '))
    }

    let output: string = ''
    await window.api.spawn(compilerPath, cmdLineArgs, workingDir, (text: string) => {
      output += text
    })

    return output
  }

  private createStorageDirectory(workingDirectory: string): string {
    const dir: string = window.api.joinPaths(workingDirectory, 'omc')
    if (!window.api.fileExists(dir) || !window.api.isDirectory(dir)) {
      window.api.createDir(dir)
    }
    return dir
  }

  private deleteFiles(workingDir: string) {
    try {
      const date: number = new Date().getTime()
      for (const file of window.api.listFiles(workingDir)) {
        const path: string = window.api.joinPaths(workingDir, file)
        if (!window.api.isDirectory(path)) {
          // File older than 5 minutes
          if (date - window.api.getLastModifiedTime(path) > 300000) {
            this._log(i18n.global.t('DeletingFile', { file: file }))
            window.api.deleteFile(path)
          }
        }
      }
    } catch (e: any) {
      throw new SimulationException(i18n.global.t('FailedToGetDirectories', { message: e.message }))
    }
  }

  private exportFiles(fileMO: string, fileMOS: string, workingDir: string): References {
    try {
      utils.openModelicaExporter.exportMO(this._dao.name, this._dao.model, fileMO)
      return utils.openModelicaExporter.exportMOS(
        this._dao.name,
        this._dao.model,
        fileMOS,
        fileMO,
        workingDir
      )
    } catch (e: any) {
      throw new SimulationException(
        i18n.global.t('FailedToExportDataForOpenModelica', { message: e.message })
      )
    }
  }

  private parseSimulationExecutablePath(output: string): string {
    let path: string = ''

    try {
      path = output.substring(output.lastIndexOf('{'))
      path = utils.parseSubstring(path, '"', '"')
    } catch (e: any) {
      throw new SimulationException(
        i18n.global.t('CannotParsePathForSimulationExecutable', { output: output })
      )
    }

    if (path == '') {
      throw new SimulationException(i18n.global.t('BuildFailed', { output: output }))
    }

    if (window.api.platform == 'win32') {
      path += '.exe'
    }

    this._log(i18n.global.t('SimulationExecutable', { path: path }))

    return path
  }

  public async run(): Promise<References> {
    // Gets the required directories. Cleans the working directory
    // from old files.
    const compilerPath: string = this.services.simulationService.simulationCompilerPath
    const workingDir: string = this.services.simulationService.simulationWorkingDir
    const storageDir: string = this.createStorageDirectory(workingDir)
    this.deleteFiles(workingDir)

    // Export data for OpenModelica.
    const fileMO: string = window.api.joinPaths(storageDir, 'model.mo')
    const fileMOS: string = window.api.joinPaths(storageDir, 'model.mos')
    const simulationReferences: References = this.exportFiles(fileMO, fileMOS, workingDir)

    // Build the simulation.
    let output: string = await this.buildSimulation(compilerPath, fileMOS, workingDir)

    // Read the build process output and
    // parse the path to the executable.
    try {
      output = this.parseSimulationExecutablePath(output)
    } catch (e: any) {
      throw new SimulationException(e.message)
    }
    simulationReferences.pathSimulationExecutable = output
    return simulationReferences
  }
}
