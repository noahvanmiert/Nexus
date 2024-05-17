// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Electron Menu
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


import { BrowserWindow } from 'electron';
import Main from './electron-main'


const getTemplate = (appName: string) => {
    return [
        {
            label: appName,
            submenu: [
                {
                    label: 'About ' + appName,
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Settings',
                    click: () => {
                        Main.createSettingsWindow();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Services',
                    role: 'services',
                    submenu: []
                },
                {
                    label: 'Dev Tools',
                    role: 'toggledevtools'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Hide ' + appName,
                    role: 'hide'
                },
                {
                    label: 'Hide Others',
                    role: 'hideothers'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Quit ' + appName,
                    role: 'quit'
                }
            ]

        },
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Tab',
                    accelerator: 'CmdOrCtrl+T',
                    click: () => {
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        mainWindow.webContents.send('new-tab');
                    }
                },
                {
                    label: 'Close Tab',
                    accelerator: 'CmdOrCtrl+W',
                    click: () => {
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        mainWindow.webContents.send('close-tab');
                    }
                },
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        mainWindow.webContents.send('reload-tab');
                    }
                },
                {
                    label: 'Next Tab',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        mainWindow.webContents.send('next-tab');
                    }
                },
                {
                    label: 'Previous Tab',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        mainWindow.webContents.send('previous-tab');
                    }
                },
                {
                    label: 'Developer Tools',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => {
                       const mainWindow = BrowserWindow.getAllWindows()[0];
                       mainWindow.webContents.send('dev-tools');
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                }
            ]
        },
        {
            label: 'Tab',
            submenu: [
                {
                    label: 'Go Back',
                    accelerator: 'CmdOrCtrl+[',
                    click: () => {
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        mainWindow.webContents.send('go-back');
                    }
                },
                {
                    label: 'Go Forward',
                    accelerator: 'CmdOrCtrl+]',
                    click: () => {
                        const mainWindow = BrowserWindow.getAllWindows()[0];
                        mainWindow.webContents.send('go-forward');
                    }
                }
            ]
        }
    ]
}


export default getTemplate;