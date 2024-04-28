// ====================================
//  Copyright (C) Nova Industries
//  27/04/2024  
// ====================================


import { app, BrowserWindow, Menu } from 'electron';
import Main from './electron-main';

Main.main(app, BrowserWindow, Menu);