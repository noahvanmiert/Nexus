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