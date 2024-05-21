import { PathOrFileDescriptor, WriteFileOptions } from 'fs'

export interface ContextBridgeAPI {
  createDir(path: string): void
  createSocket(
    port: number,
    receiveData: (data: Buffer) => void,
    onClose: (hadError: boolean) => void
  ): Promise<boolean>
  deleteFile(path: string): void
  fileExists(path: string): boolean
  getLastModifiedTime(path: string): number
  isDirectory(path: string): boolean
  joinPaths(...paths: string[]): string
  listFiles(path: string): Array<string>
  platform: NodeJS.Platform
  readonly userName: string
  spawn(
    command: string,
    args: readonly string[],
    workingDir: string,
    log: (text: string) => void
  ): Promise<void>
  readonly tempDir: string
  writeFile(
    file: PathOrFileDescriptor,
    data: string | NodeJS.ArrayBufferView,
    options?: WriteFileOptions
  ): void
}
