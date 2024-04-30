// ====================================
//  Copyright (C) Nova Industries
//  27/04/2024  
// ====================================
import {BrowserWindow, ipcMain} from 'electron';

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
                }
            ]
        }
    ]
    
}

export default getTemplate;