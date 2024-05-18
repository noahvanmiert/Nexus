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
    public title: string;
    public url: string;
    public id: number;

    public active: boolean = false;
    public zoomFactor: number = 1;


    constructor(title: string, url: string, id: number) {
        this.title = title;
        this.url = url;
        this.id = id;
    }


    activate() {
        this.active = true;
    }


    deactivate() {
        this.active = false;
    }

}
