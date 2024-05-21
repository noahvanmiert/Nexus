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


import {BrowserWindow} from 'electron';
import Main from './electron-main'


function send(channel: string, ...args: any[]): void {
    const mainWindow = BrowserWindow.getAllWindows()[0];
    mainWindow.webContents.send(channel, ...args);
}


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
                        send('new-tab');
                    }
                },
                {
                    label: 'Close Tab',
                    accelerator: 'CmdOrCtrl+W',
                    click: () => {
                        send('close-tab');
                    }
                },
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        send('reload-tab');
                    }
                },
                {
                    label: 'Next Tab',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        send('next-tab');
                    }
                },
                {
                    label: 'Previous Tab',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        send('previous-tab');
                    }
                },
                {
                    label: 'Developer Tools',
                    accelerator: 'CmdOrCtrl+I',
                    click: () => {
                        send('dev-tools');
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
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Search bar',
                    accelerator: 'CmdOrCtrl+Shift+F',
                    click: () => {
                        send('toggle-bar');
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+=',
                    click: () => {
                        send('zoom-in');
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        send('zoom-out');
                    }
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
                        send('go-back');
                    }
                },
                {
                    label: 'Go Forward',
                    accelerator: 'CmdOrCtrl+]',
                    click: () => {
                        send('go-forward');
                    }
                },
                {
                    label: 'Toggle Mute',
                    accelerator: 'CmdOrCtrl+M',
                    click: () => {
                        send('toggle-mute');
                    }
                }
            ]
        }
    ]
}


export default getTemplate;