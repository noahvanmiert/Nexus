// ====================================
//  Copyright (C) Nova Industries
//  27/04/2024  
// ====================================


import { BrowserWindow } from 'electron';
import * as path from 'path';


export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;
    
    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        // Dereference the window object. 
        Main.mainWindow = null;
    }

    private static onReady() {
        Main.mainWindow = new Main.BrowserWindow({
            width: 1280,
            height: 720,
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true,
            }
        });
        
        Main.mainWindow.loadFile(
            path.join(path.join(Main.application.getAppPath(), '..'), 'interface/index.html'));
        
        Main.mainWindow.on('closed', Main.onClose);
    }

    static main(app: Electron.App, browserWindow: typeof Electron.BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}