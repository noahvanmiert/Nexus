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


import {ipcRenderer, contextBridge} from 'electron';


contextBridge.exposeInMainWorld("app", {

    send: (channel: string, data: any) => {
        ipcRenderer.send(channel, data);
    },

    receive: (channel: string, func: any) => {
        ipcRenderer.on(channel, (_e, ...args) => func(...args));
    }

})