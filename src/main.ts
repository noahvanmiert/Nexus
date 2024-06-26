// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Electron Entry Point
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


import { app, BrowserWindow, Menu } from 'electron';
import Main from './electron-main';


/* Electron entrypoint */
Main.main(app, BrowserWindow, Menu);