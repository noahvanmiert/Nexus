// ====================================
//  Copyright (C) Nova Industries
//  27/04/2024  
// ====================================

const defaultStartpage: string = 'https://google.com';

class Tab {

    constructor(public title: string, public url: string, public id: number, public active: boolean = false)
    {
    }

    activate() {
        this.active = true;
    }

    deactivate() {
        this.active = false;
    }

}

class TabManager {
    private tabs: Tab[] = [];

    addTab(title: string, url: string, id: number): Tab {
        const tab = new Tab(title, url, id);
        this.tabs.push(tab);

        return tab;
    }

    closeTab(id: number) {
        // There needs to always be at least one tab open.
        if (this.tabs.length === 1) {
            return;
        }

        // find if the tab with id is at index zero or not and do different things then
        const index = this.tabs.findIndex(tab => tab.id === id);

        // Check if the tab to be closed is the first tab
        if (index === 0) {
        // If it's the first tab, activate the next tab (if exists)
            if (this.tabs.length > 1) {
                this.activateTab(this.tabs[1]);
            }
        } else {
            this.activateTab(this.tabs[index - 1]);
        }

        this.tabs = this.tabs.filter(tab => tab.id !== id);
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

    activateTab(tab: Tab) {
        tab.activate();

        this.tabs.forEach((t) => {
            if (t !== tab) {
                t.deactivate();
            }
        })
    }
}

let iotaCounter = 0;

const iota = (): number => {
    let result = iotaCounter;
    iotaCounter++;
    return result;
}


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const tabBar = document.getElementById('tab-bar');

    const tabManager = new TabManager();
    tabManager.addTab('Google', 'https://google.com', 0);
    newTab('Google', 'https://google.com');

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // @ts-ignore
    electronAPI.onNewTab((value) => {
        newTab('Google', 'https://google.com');
    })

    // @ts-ignore
    electronAPI.onCloseTab((value) => {
        closeCurrentTab();
    })

    const handleSearch = () => {
        const searchTerm: string = searchInput.value.trim();

        if (searchTerm !== '') {
            // Check if the input is a valid URL
            if (isValidURL(searchTerm)) {
                // If it's a valid URL, load it in the webview
                
                // if the protocol isn't added but the address is valid, add the protocol
                if (hasValidDomain(searchTerm)) {
                    createWebview('https://' + searchTerm);
                    
                    // change the search input to the whole url with protocol
                    searchInput.value = 'https://' + searchTerm;
                    
                    return;
                }
                
                createWebview(searchTerm);
            } else {
                // If it's not a valid URL, treat it as a search term and search using Google
                const searchURL = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
                createWebview(searchURL);
            }
        }
    }

    // Function to create and load a webview
    const createWebview = (url: string) => {
        const webviewContainer = document.getElementById('webview-container');

        // Remove existing webview elements
        while (webviewContainer.firstChild) {
            webviewContainer.removeChild(webviewContainer.firstChild);
        }

        // Create new webview element
        const webview = document.createElement('webview');
        webview.setAttribute('src', url);
        webviewContainer.appendChild(webview);
    }

    // Load default start page
    createWebview(defaultStartpage);

    // Check if a given text has a valid domain and no spaces (e.g. google.com, youtube.com, ...)
    const hasValidDomain = (text: string) => {
        const domainRegex = /^(?!.*\s)\b\w+\.(com|net|org|be|...)($|[^a-zA-Z0-9])/i;
        return domainRegex.test(text);
    };

    const isValidURL = (url: string) => {
        // Regular expression to match the protocol part of the URL
        const protocolRegex = /^(https?|ftp):\/\//i;

        // Check if the URL starts with a protocol
        if (protocolRegex.test(url)) {
            try {
                // Try to create a new URL object with the URL
                new URL(url);

                // If successful, return true
                return true;
            } catch (_) {
                // If an error occurs, return false
                return false;
            }
        }
        
        // Returns true if the url has a valid domain an no spaces (so it is a url without protocol)
        // else it will return false because it is a search term.
        return hasValidDomain(url);
    }

    function newTab(title: string, url: string) {
        let tabId = iota();

        const newTab = document.createElement('div');
        newTab.setAttribute('class', 'tab');
        newTab.setAttribute('id', tabId.toString());
        newTab.textContent = title;

        tabBar.appendChild(newTab);

        let t = tabManager.addTab(title, url, tabId)
        tabManager.activateTab(t);
        console.log('new: ' + tabId.toString())
    }

    const closeCurrentTab = () => {
        const activeTab = tabManager.getActive();

        console.log(activeTab)

        if (activeTab) {
            // Remove tab from the tab bar
            console.log(activeTab.id.toString())
            const tabElement = document.getElementById(activeTab.id.toString());
            if (tabElement) {
                tabElement.remove();
            }

            // Close the tab in the TabManager
            tabManager.closeTab(activeTab.id);
        }
    }
});
