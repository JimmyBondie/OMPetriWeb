import { contextBridge, nativeImage } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import TitleBarPkg from 'custom-electron-titlebar'
import { TitleBarOptions } from 'custom-electron-titlebar/titlebar/options'
import path from 'path'
import { userInfo } from 'os'
import { ContextBridgeAPI } from './ContextBridgeAPI'
const { TitlebarColor, Titlebar } = TitleBarPkg

// Custom APIs for renderer
const api: ContextBridgeAPI = {
  userName: userInfo().username
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
