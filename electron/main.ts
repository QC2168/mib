/* eslint-disable import/prefer-default-export */
import Mib from '@qc2168/mib';
import { app, BrowserWindow, ipcMain } from 'electron';
import { release } from 'os';
// import installExtension, {
//   REACT_DEVELOPER_TOOLS,
// } from 'electron-devtools-installer';

const { join } = require('path');

const preload = join(__dirname, './preload.js');

const mibInstance = new Mib();

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, './..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? './..' : './../../public'),
};

let win: BrowserWindow | null = null;
// Here, you can also use other preload
// const preload = join(__dirname, './preload/index.js');
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
// eslint-disable-next-line dot-notation
const url = 'http://127.0.0.1:7777';
// const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;
const indexHtml = join(ROOT_PATH.dist, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(ROOT_PATH.public, 'favicon.svg'),
    frame: true,
    minWidth: 970,
    minHeight: 580,
    width: 970,
    height: 580,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
    },
  });
  if (app.isPackaged) {
    await win.loadFile(indexHtml);
  } else {
    await win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Test actively push message to the Electron-Renderer
  // win.webContents.on('did-finish-load', () => {
  //   win?.webContents.send('main-process-message', new Date().toLocaleString());
  // });
  //
  // // Make all links open with the browser, not with the application
  // win.webContents.setWindowOpenHandler((event) => {
  //   if (event.url.startsWith('https:')) shell.openExternal(event.url);
  //   return { action: 'deny' };
  // });
}

app.whenReady().then(createWindow);
// .then(() => {
//   installExtension(REACT_DEVELOPER_TOOLS.id)
//     .then((name) => console.log(`Added Extension:  ${name}`))
//     .catch((err) => console.log('An error occurred: ', err));
// });

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {},
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    childWindow.loadURL(`${url}/#${arg}`);
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
});

ipcMain.handle('close-win', () => {
  app.exit();
});

ipcMain.handle('minimize-win', () => {
  win.minimize();
});

ipcMain.handle('maximize-win', () => {
  win.maximize();
});

ipcMain.handle('mibInstance', () => mibInstance);