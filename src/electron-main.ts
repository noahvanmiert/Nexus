// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: All Electron specific code
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


import * as path from 'path';
import getTemplate from './menu';
import { WebContents, ipcMain } from 'electron';

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: typeof Electron.BrowserWindow;
    static settingWindow: Electron.BrowserWindow;
    

    private static onWindowAllClosed(): void {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose(): void {
        Main.mainWindow = null;

        if (Main.settingWindow) {
            Main.settingWindow.close();
        }
    }


    private static handleSettings(settings): void {
        Main.mainWindow.webContents.send('engine-changed', settings.engine);

        if (settings.homepage.trim() !== '') {
            Main.mainWindow.webContents.send('default-homepage-changed', settings.homepage.trim())
        }
    }


    private static onReady(): void {
        Main.mainWindow = new Main.BrowserWindow({
            width: 1280,
            height: 720,
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true,
                devTools: true,
                preload: path.join(__dirname, 'preload.js')
            }
        });
        

        Main.mainWindow.loadFile(
            path.join(path.join(Main.application.getAppPath(), '..'), 'interface/index.html')
        );
        
        Main.mainWindow.on('closed', Main.onClose);
        Main.application.on('web-contents-created', Main.onWebContentsCreated);

        ipcMain.on('cancel-settings', (event) => {
            Main.settingWindow.close();
        });

        ipcMain.on('save-settings', (event, settings) => {
            Main.handleSettings(settings);
        });
    }


    private static onWebContentsCreated(_e: Event, webContents: WebContents) {
        webContents.setWindowOpenHandler((details: Electron.HandlerDetails) => {
            Main.mainWindow.webContents.send('new-webview-created', details);

            // If we would allow, the new tab would be opened in a popup screen
            return { action: 'deny' }
        })
    }


    static createSettingsWindow(): void {
        Main.settingWindow = new Main.BrowserWindow({
            width: 600,
            height: 400,
            resizable: false,
            webPreferences: {
                devTools: true,     // TODO: change this after we don't need it for debugging
                preload: path.join(__dirname, 'preload-settings.js')
            }
        })

        Main.settingWindow.loadFile(
            path.join(path.join(Main.application.getAppPath(), '..'), 'interface/settings.html')
            );

        Main.settingWindow.on('closed', () => {
            Main.settingWindow = null;
        })
    }


    static main(app: Electron.App, browserWindow: typeof Electron.BrowserWindow, Menu): void {
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