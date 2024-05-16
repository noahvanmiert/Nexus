// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 13/05/2024
//  Description: Logic for settings window
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


const defaultEngine = document.getElementById('engine') as HTMLSelectElement;
const defaultHomepage = document.getElementById('default-homepage-input') as HTMLInputElement;

const cancelButton = document.getElementById('cancel-button');
const saveButton = document.getElementById('save-button');


/*
* TODO:
*   Privacy Settings
*   Appearance and themes
*   Tabs and windows
*   Security settings
*   Content settings
*   Default applications
*   Sync and Backup
*   Advanced Settings
*/


cancelButton.addEventListener('click', () => {
    // @ts-ignore
    electronAPI.sendToMain('cancel-settings');
})


saveButton.addEventListener('click', () => {
    const settings = {
        engine: defaultEngine.value,
        homepage: defaultHomepage.value
    };
    
    // @ts-ignore
    electronAPI.sendToMain('save-settings', settings);
})


// @ts-ignore
electronAPI.receiveFromMain('settings', (settings) => {
    if (!settings) {
        return;
    }

    if (settings.engine) {
        defaultEngine.value = settings.engine;
    }

    if (settings.value) {
        defaultHomepage.value = settings.homepage;
    }
})