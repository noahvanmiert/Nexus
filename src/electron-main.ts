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
import Serializer from "./serializer";


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


    private static prepareURL(homepage: string): string | null {
        if (!isValidURL(homepage)) {
            return null;
        }

        let url: string;

        if (hasValidDomain(homepage)) {
            url = 'https://' + homepage;
        } else {
            url = homepage;
        }

        return url;
    }


    private static handleSettings(settings): void {
        settings.homepage = Main.prepareURL(settings.homepage);

        /* if the homepage URL is invalid */
        if (!settings.homepage) {
            console.error('Homepage URL received from settings is invalid, no changed to the dafault homepage will be made.');
        }

        Serializer.serialize(settings);

        Main.mainWindow.webContents.send('browser-settings', settings);
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
        
        const settings = Serializer.deserialize();
        Main.mainWindow.webContents.on('did-finish-load', () => {
            Main.mainWindow.webContents.send('browser-settings', settings);
        });


        Main.mainWindow.on('closed', Main.onClose);
        Main.application.on('web-contents-created', Main.onWebContentsCreated);

        ipcMain.on('cancel-settings', (event) => {
            Main.settingWindow.close();
        });

        ipcMain.on('save-settings', (event, settings) => {
            Main.handleSettings(settings);

            /* close the window after saving */
            Main.settingWindow.close();
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

        Main.settingWindow.on('ready-to-show', () => {
            /* deserialize the settings */
            Main.settingWindow.webContents.send('settings', Serializer.deserialize());
        })

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


function hasValidDomain(text: string): boolean {
    const domainRegex = /^(?!.*\s)\b\w+(?:-?\w)*\.\w{2,}(?:\.\w{2,})?(?:$|[^a-zA-Z0-9])/i;

    return domainRegex.test(text);
}


function isValidURL(url: string): boolean {
    // Regular expression to match the protocol part of the URL
    const protocolRegex = /^(https?|ftp):\/\//i;

    // Check if the URL starts with a protocol
    if (protocolRegex.test(url)) {
        try {
            // Try to create a new URL object with the URL
            new URL(url);

            return true;
        } catch (_) {
            return false;
        }
    }

    // Returns true if the url has a valid domain an no spaces (so it is a url without protocol)
    // else it will return false because it is a search term.
    return hasValidDomain(url);
}