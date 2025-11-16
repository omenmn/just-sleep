import { app, Notification, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { readFileSync } from 'fs'

let mainWindow
let tray
let userBedtime = '23:00'

function getWalColors(): object | null {
  const path = join(process.env.HOME!, '.cache/wal/colors.json')
  try {
    const data = readFileSync(path, 'utf-8')
    const colors = JSON.parse(data).colors
    return colors
  } catch (err) {
    console.error('Failed to get colors: ', err)
    return null
  }
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 230,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    frame: false,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    //mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  tray = new Tray('/home/omen/Pictures/pfp.jpg')
  tray.setToolTip('just sleep')

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Open',
        click: () => mainWindow.show()
      },
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ])
  )

  tray.on('click', () => {
    // toggle window like Discord does
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })
}

ipcMain.handle('get-wal-colors', () => {
  return getWalColors()
})

ipcMain.on('update-bedtime', (_, time: string) => {
  console.log(time)
  userBedtime = time
})

// Check every minute if it's bedtime
setInterval(() => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const currentTime = `${hours}:${minutes}`

  console.log(currentTime)

  if (currentTime === userBedtime) {
    new Notification({
      title: 'Bedtime Alert',
      body: "It's time to go to bed 😴"
    }).show()
  }
}, 60000)

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  ipcMain.on('hide', () => {
    mainWindow.hide()
  })

  if (mainWindow) {
    mainWindow.show()
    mainWindow.focus()
  }
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
