import { ElectronAPI } from '@electron-toolkit/preload'
import { ContextBridgeAPI } from './ContextBridgeAPI'

declare global {
  interface Window {
    electron: ElectronAPI
    api: ContextBridgeAPI
  }
}
