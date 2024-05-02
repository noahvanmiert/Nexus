// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Class that is responsible for organizing tabs
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


class TabManager {
    private tabs: Tab[] = [];
    private webViewContainer: HTMLElement;

    
    constructor(webviewContainer: HTMLElement) {
        this.webViewContainer = webviewContainer;
    }

    
    addTab(title: string, url: string, id: number): Tab {
        const tab = new Tab(title, url, id);
        this.tabs.push(tab);

        return tab;
    }

    
    closeTab(id: number): void {
        // Ensure there is more than one tab open
        if (this.tabs.length <= 1) {
            return;
        }

        // find if the tab with id is at index zero or not and do different things then
        const tabIndex = this.tabs.findIndex(tab => tab.id === id);

        // Check if the tab to be closed is the first tab
        if (tabIndex === 0) {
            this.activateTab(this.tabs[1]);
        } else {
            this.activateTab(this.tabs[tabIndex - 1]);
        }

        this.tabs.splice(tabIndex, 1);
    }

    
    getTabs(): Tab[] {
        return this.tabs;
    }

    
    getActive(): Tab {
        for (const tab of this.tabs) {
            if (tab.active) {
                return tab;
            }
        }

        return null;
    }

    
    activateTab(tab: Tab): void {
        tab.activate();

        // Update the content of the webview based on the selected tab's state
        const webview = this.webViewContainer.querySelector('webview');
        
        if (webview) {
            webview.setAttribute('src', tab.webviewState.url);
        }

        this.tabs.forEach((t) => {
            if (t !== tab) {
                t.deactivate();
            }
        })
    }

    
    setActiveURL(url: string): void {
        this.getActive().webviewState.url = url;
    }
    

    setActiveTitle(title: string): void {
        this.getActive().title = title;
    }
    

    updateHTMLTabTitle(title: string): void {
        const tabElement = document.getElementById(this.getActive().id.toString());
        
        if (!tabElement) {
            console.error('Could not get HTML element of current tab');
            
            return;
        }
        
        tabElement.textContent = title;
    }
}