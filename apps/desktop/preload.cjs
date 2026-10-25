const { contextBridge } = require('electron');

// The game deliberately has no filesystem, process or arbitrary IPC access.
contextBridge.exposeInMainWorld('segnaleDesktop', Object.freeze({ platform: process.platform }));
