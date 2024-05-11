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
        
        this.tabs.forEach((t) => {
            if (t !== tab) {
                t.deactivate();
            }
        })

        // Update the content of the webview based on the selected tab's state
        const webviews: NodeListOf<HTMLElement> = this.webViewContainer.querySelectorAll('webview');

        // hide all the webviews
        webviews.forEach(view => {
            view.style.display = 'none';
        });

        const activeWebview: HTMLElement = this.webViewContainer.querySelector(`#webview-${this.getActive().id}`);
        if (activeWebview) {
            activeWebview.style.display = '';
        }
    }

    
    setActiveURL(url: string): void {
        this.getActive().url = url;
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


    getActiveWebview(): Electron.WebviewTag {
        return this.webViewContainer.querySelector(`#webview-${this.getActive().id}`);
    }


    setActiveWebviewURL(url: string): void {
        const view: Electron.WebviewTag = this.getActiveWebview();

        if (!view) {
            console.error('Could not retrieve current webview');
            return;
        }

        view.setAttribute('src', url);
    }


    goToNext(): void {
        const tabIndex = this.tabs.findIndex(tab => tab.active === true);

        // if this is the not last tab
        if (tabIndex + 1 !== this.tabs.length) {
            this.activateTab(this.tabs[tabIndex + 1]);
        }
    }


    goToPrevious(): void {
        const tabIndex = this.tabs.findIndex(tab => tab.active === true);

        // if this is the not first tab
        if (tabIndex > 0) {
            this.activateTab(this.tabs[tabIndex - 1]);
        }
    }


    goBack(): void {
        const webview: Electron.WebviewTag = this.getActiveWebview();

        if (!webview) {
            return;
        }

        webview.goBack();

        this.setActiveTitle(webview.getTitle());
    }


    goForward(): void {
        const webview: Electron.WebviewTag = this.getActiveWebview();

        if (!webview) {
            return;
        }

        webview.goForward();

        this.setActiveTitle(webview.getTitle());
    }


    toggleDeveloperTools(): void {
        const webview: Electron.WebviewTag = this.getActiveWebview();

        if (!webview) {
            return;
        }

        if (webview.isDevToolsOpened()) {
            webview.closeDevTools();
        } else {
            webview.openDevTools();
        }
    }
}