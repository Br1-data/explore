const { app, BrowserWindow, shell, session } = require('electron');
const path = require('node:path');
const { pathToFileURL, URL } = require('node:url');

const entryPath = path.join(__dirname, 'app', 'index.html');
const entryUrl = pathToFileURL(entryPath);
let window;

function trustedNavigation(target) {
  try {
    const url = new URL(target);
    return url.protocol === 'file:' && url.pathname === entryUrl.pathname;
  } catch {
    return false;
  }
}

function openExternal(target) {
  try {
    const url = new URL(target);
    if (url.protocol === 'https:' && !url.username && !url.password) {
      void shell.openExternal(url.href);
    }
  } catch {
    // Malformed URLs and non-HTTPS links never reach the operating system.
  }
}

function createWindow() {
  window = new BrowserWindow({
    title: 'Segnale Remoto',
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#102c3a',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });
  window.webContents.setWindowOpenHandler(({ url }) => {
    openExternal(url);
    return { action: 'deny' };
  });
  window.webContents.on('will-navigate', (event, target) => {
    if (!trustedNavigation(target)) {
      event.preventDefault();
      openExternal(target);
    }
  });
  window.webContents.on('will-attach-webview', (event) => event.preventDefault());
  window.once('ready-to-show', () => window?.show());
  window.on('closed', () => {
    window = undefined;
  });
  void window.loadFile(entryPath);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (window) {
      if (window.isMinimized()) window.restore();
      window.show();
      window.focus();
    }
  });
  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_contents, permission, callback) => {
      callback(permission === 'pointerLock' || permission === 'fullscreen');
    });
    session.defaultSession.setPermissionCheckHandler(
      (_contents, permission) => permission === 'pointerLock' || permission === 'fullscreen',
    );
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}
