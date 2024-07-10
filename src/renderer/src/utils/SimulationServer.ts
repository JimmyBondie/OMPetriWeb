import { References } from '@renderer/core/References'
import { ModelDAO } from '@renderer/dao/ModelDAO'
import i18n from '@renderer/main'
import { Simulation } from '@renderer/result/Simulation'
import { services } from '@renderer/services'
import { Buffer } from 'buffer'

export class SimulationServer extends Object {
  private readonly SIZE_OF_INT: number = window.api.platform == 'win32' ? 4 : 8

  private _bools: number = 0
  private _dao: ModelDAO
  private _doubles: number = 0
  private _expected: number = 0
  private _ints: number = 0
  private _log: (text: string) => void
  private _receivedData: Uint8Array = new Uint8Array()
  private _references: References
  private _results: Simulation | undefined = undefined
  private _serverPort: number = 17015
  private _simulationVariables: Array<string> = new Array<string>()
  private _vars: number = 0

  public constructor(dao: ModelDAO, references: References, log: (text: string) => void) {
    super()
    this._dao = dao
    this._log = log
    this._references = references
  }

  public get serverPort(): number {
    return this._serverPort
  }

  private async createServerSocket(): Promise<boolean> {
    let isSocketReady: boolean = false
    let countPortsChecked: number = 0

    while (!isSocketReady && countPortsChecked < 20) {
      isSocketReady = await window.api.createSocket(
        this._serverPort,
        (data: Buffer) => this.receiveData.call(this, data),
        (hadError: boolean) => this.onClose.call(this, hadError)
      )
      if (!isSocketReady) {
        this._log(i18n.global.t('SocketPortAlreadyInUse', { port: this._serverPort }))
        this._serverPort++
        countPortsChecked++
      }
    }

    return isSocketReady
  }

  private onClose(hadError: boolean) {
    if (hadError) {
      return
    }
    let buffer: Buffer = Buffer.from(this._receivedData)
    let position: number = 1 //Skip the first byte

    this._log(i18n.global.t('SimulationInitializingResultsStorage'))
    position = this.readSimulationVariables(buffer, position)
    this._results = new Simulation(this._dao, this._simulationVariables, this._references)
    this.readAndStoreSimulationResults(buffer, position)
    services.resultService.addResult(this._results)
  }

  public run(): Promise<boolean> {
    return this.createServerSocket()
  }

  private readAndStoreSimulationResults(buffer: Buffer, position: number): number {
    if (!this._results) {
      return position
    }

    while (position < buffer.length) {
      const id: number = buffer.readInt8(position)
      position += 1

      const length: number = buffer.readInt16LE(position)
      position += 2

      position += 2 // blocks until msg received

      switch (id) {
        case 4: {
          if (length <= 0) {
            break
          }

          const startPos: number = position
          const data: Array<bigint | number> = new Array<bigint | number>(this._vars)
          let index: number = 0
          for (let r = 0; r < this._doubles; r++) {
            data[index] = buffer.readDoubleLE(position)
            position += 8
            index++
          }
          for (let i = 0; i < this._ints; i++) {
            if (this.SIZE_OF_INT == 4) {
              data[index] = buffer.readInt32LE(position)
            } else {
              data[index] = buffer.readBigInt64LE(position)
            }
            position += this.SIZE_OF_INT
            index++
          }
          for (let b = 0; b < this._bools; b++) {
            data[index] = buffer.readInt8(position)
            position += 1
            index++
          }

          const text: string = new TextDecoder().decode(
            buffer.subarray(startPos + this._expected, startPos + length)
          )
          const messages: Array<string> = text.split('\u0000')
          for (const message of messages) {
            if (message != '') {
              this._log(message)
            }
          }
          this._results.addData(data)
          position = startPos + length
          break
        }

        case 6: {
          return position
        }
      }
    }
    return position
  }

  private readSimulationVariables(buffer: Buffer, position: number): number {
    const length: number = buffer.readInt32LE(position)
    position += 4

    buffer = Buffer.from(buffer.subarray(position, position + length))
    position = 0

    this._doubles = buffer.readInt32LE(position)
    position += 4

    this._ints = buffer.readInt32LE(position)
    position += 4

    this._bools = buffer.readInt32LE(position)
    position += 4

    position += 4 //Skip the number of "strings"

    this._expected = 8 * this._doubles + this.SIZE_OF_INT * this._ints + this._bools
    this._simulationVariables = new TextDecoder()
      .decode(buffer.subarray(position, length - 1))
      .split('\u0000')
    this._vars = this._simulationVariables.length

    return position
  }

  private receiveData(data: Buffer) {
    this._receivedData = new Uint8Array([...this._receivedData, ...data])
  }
}
