// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Electron preload script
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


import { ipcRenderer, contextBridge } from 'electron';


contextBridge.exposeInMainWorld("electronAPI", {

    onNewTab: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('new-tab', callback);
    },

    onCloseTab: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('close-tab', callback);
    },

    onReloadTab: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('reload-tab', callback);
    },

    onNextTab: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('next-tab', callback);
    },

    onPreviousTab: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('previous-tab', callback);
    },

    onGoBack: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('go-back', callback);
    },

    onGoForward: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('go-forward', callback);
    },

    onDevTools: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('dev-tools', callback);
    },

    onNewWebviewCreated: (callback) => {
        ipcRenderer.on('new-webview-created', (_event, ...args) => {
            // Pass all received arguments to the callback function
            callback(...args);
        });
    },

    onEngineChanged: (callback) => {
        ipcRenderer.on('engine-changed', (_event, ...args) => {
            callback(...args);
        })
    },

    onHomepageChanged: (callback) => {
        ipcRenderer.on('default-homepage-changed', (_event, ...args) => {
            callback(...args);
        })
    },

    onBrowserSettings: (callback) => {
        ipcRenderer.on('browser-settings', (_event, ...args) => {
            callback(...args);
        })
    }

})