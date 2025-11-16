import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      hide: () => void
      getColors: () => Promise<object | null>
      setBedtime: () => void
    }
  }
}
