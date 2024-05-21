import { contextBridge, nativeImage } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import TitleBarPkg from 'custom-electron-titlebar'
import { TitleBarOptions } from 'custom-electron-titlebar/titlebar/options'
import path, { join } from 'path'
import { userInfo } from 'os'
import { ContextBridgeAPI } from './ContextBridgeAPI'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
  PathOrFileDescriptor,
  WriteFileOptions
} from 'fs'
import { platform } from 'process'
import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import { Server, Socket, createServer } from 'net'
const { TitlebarColor, Titlebar } = TitleBarPkg

// Custom APIs for renderer
const api: ContextBridgeAPI = {
  createDir(path: string) {
    mkdirSync(path, { recursive: true })
  },
  createSocket(
    port: number,
    receiveData: (data: Buffer) => void,
    onClose: (hadError: boolean) => void
  ): Promise<boolean> {
    return new Promise((resolve, _) => {
      const server: Server = createServer((socket: Socket) => {
        socket.on('data', receiveData)
        socket.on('close', (hadError: boolean) => {
          server.close()
          onClose(hadError)
        })
      })
      server.on('error', () => resolve(false))
      server.listen(port, () => resolve(true))
    })
  },
  deleteFile(path: string): void {
    rmSync(path)
  },
  fileExists(path: string): boolean {
    return existsSync(path)
  },
  getLastModifiedTime(path: string): number {
    return lstatSync(path).mtime.getTime()
  },
  isDirectory(path: string): boolean {
    return lstatSync(path).isDirectory()
  },
  joinPaths: join,
  listFiles(path: string): Array<string> {
    return readdirSync(path, { encoding: 'utf-8', withFileTypes: false, recursive: true })
  },
  platform: platform,
  userName: userInfo().username,
  spawn(
    command: string,
    args: readonly string[],
    workingDir: string,
    log: (text: string) => void
  ): Promise<void> {
    return new Promise((resolve, _) => {
      const process: ChildProcessWithoutNullStreams = spawn(command, args, { cwd: workingDir })
      process.stdout.setEncoding('utf-8')
      process.stdout.on('data', (data: string) => log(data))
      process.stderr.setEncoding('utf-8')
      process.stderr.on('data', (data: string) => log(data))
      process.on('exit', () => resolve())
    })
  },
  tempDir: await electronAPI.ipcRenderer.invoke('getTempDir'),
  writeFile(
    file: PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions
  ) {
    return writeFileSync(file, data, options)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process && process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

window.addEventListener('DOMContentLoaded', () => {
  const options: TitleBarOptions = {
    icon: nativeImage.createFromPath(path.join(__dirname, '../../resources/icon.png')),
    backgroundColor: TitlebarColor.fromHex('#2196F3'), // "blue" color from vuetify
    titleHorizontalAlignment: 'left'
  }
  new Titlebar(options)
})
