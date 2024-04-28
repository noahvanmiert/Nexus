// ====================================
//  Copyright (C) Nova Industries
//  27/04/2024  
// ====================================

import * as path from 'path';
import getTemplate from './menu';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: typeof Electron.BrowserWindow;
    
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

    static main(app: Electron.App, browserWindow: typeof Electron.BrowserWindow, Menu) {
        Main.application = app;
        Main.BrowserWindow = browserWindow;
        
        // Set the name of the whole application to Nexus (instead of default Electron)
        Main.application.setName('Nexus');
        const appName = Main.application.getName();

        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);

        // Set the menu bar items (see src/menu.ts)
        let menu = Menu.buildFromTemplate(getTemplate(appName));
        Menu.setApplicationMenu(menu);
    }
}