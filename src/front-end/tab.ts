// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Class that implements tab logic
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


class Tab {

    constructor(public title: string, public url: string, public id: number, public active: boolean = false) {
        
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

}
