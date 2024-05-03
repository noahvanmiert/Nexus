// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Handles all DOM logic (tabs, webview, ...)
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


document.addEventListener('DOMContentLoaded', () => {
    // Query DOM elements once and store references
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const tabBar = document.getElementById('tab-bar');
    const webviewContainer = document.getElementById('webview-container');

    const tabManager = new TabManager(webviewContainer);
    newTab('Google', Defaults.homePage);

    
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    })

    
    // @ts-ignore
    electronAPI.onNewTab(() => {
        newTab('Google', Defaults.homePage);
    })
    
    
    // @ts-ignore
    electronAPI.onCloseTab(() => {
        closeCurrentTab();
    })

    
    function handleSearch(): void {
        const searchTerm: string = searchInput.value.trim();
        
        if (searchTerm === '') {
            return;
        }
        
        if (Utils.isValidURL(searchTerm)) {
            let url: string;
            
            // if the protocol isn't added but the address is valid, add the protocol
            if (Utils.hasValidDomain(searchTerm)) {
                url = 'https://' + searchTerm;
            } else {
                url = searchTerm;
            }
            
            // Create webview and set active url
            searchInput.value = url;
            tabManager.setActiveURL(url);
            tabManager.setActiveWebviewURL(url);
        } else {
            // Treat it as a search term and search using Google
            const searchURL = `https://google.com/search?q=${encodeURIComponent(searchTerm)}`;
            tabManager.setActiveWebviewURL(searchURL);
        }
    }
    

    // Function to create and load a webview
    function createWebview(url: string, id: number): void {

        // Create new webview element
        const webview = document.createElement('webview');
        webview.setAttribute('src', url);
        webview.setAttribute('id', `webview-${id}`);

        // Set additional CSS styles
        webview.setAttribute('style', 'width: 100%; height: 100%;');

        webview.addEventListener('dom-ready', () => {
            let title: string;
            
            try {
                title = webview.getTitle() || '';
            } catch (err) {
                console.error('An error occured while retrieving tab title:', err);
            }
            
            tabManager.setActiveTitle(title);

            // change the title in the tab element itself
            tabManager.updateHTMLTabTitle(title);
        })

        webview.addEventListener('did-navigate-in-page', (event) => {
            // Log the URL of the page where the navigation occurred
            tabManager.setActiveURL(event.url);

            searchInput.value = event.url;
        })

        webviewContainer.appendChild(webview);
    }
    
    
    function updateTabStyles(): void {
        const tabElements = tabManager.getTabs().map(tab => document.getElementById(tab.id.toString())).filter(Boolean);
        
        tabManager.getTabs().forEach((tab, index) => {
            const tabElement = tabElements[index] as HTMLElement;
    
            if (tabElement) {
                // Toggle the 'active' class using the ternary operator
                tab.active ? tabElement.classList.add('active') : tabElement.classList.remove('active');
            }
        })
    }
    

    function handleTabSelect(event: MouseEvent): void {
        const tabElement = event.currentTarget as HTMLElement;
        const tabId = parseInt(tabElement.id);
        const clickedTab = tabManager.getTabs().find(tab => tab.id === tabId);

        if (clickedTab && !clickedTab.active) {
            tabManager.activateTab(clickedTab);
            updateTabStyles();
            searchInput.value = tabManager.getActive().webviewState.url;
        }
    }
    

    function newTab(title: string, url: string): void {
        let tabId = Utils.iota();

        const newTab = document.createElement('div');
        newTab.className = 'tab';
        newTab.id = tabId.toString();
        newTab.textContent = title;
        
        newTab.addEventListener('click', handleTabSelect);

        tabBar.appendChild(newTab);

        let t = tabManager.addTab(title, url, tabId);
        tabManager.activateTab(t);
        updateTabStyles();

        createWebview(url, tabId);
    }
    

    function closeCurrentTab(): void {
        const tabs = tabManager.getTabs();
        const numTabs = tabs.length;
        
        if (numTabs === 1) {
            return; // Do not close if there's only one tab
        }
    
        const activeTab = tabManager.getActive();
        if (!activeTab) {
            return; // No active tab, nothing to close
        }
    
        const activeTabId = activeTab.id;
        const tabElement = document.getElementById(activeTabId.toString());
        
        if (tabElement) {
            tabElement.remove(); // Remove tab from the tab bar
        }

        tabManager.closeTab(activeTabId); // Close the tab in the TabManager
        updateTabStyles();
    }
})
