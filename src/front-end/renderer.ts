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
    const errorContainer = document.getElementById('error-container');

    Defaults.setEngine(SearchEngine.Google);

    const tabManager = new TabManager(webviewContainer);
    newTab(Defaults.getHomePageTitle(), Defaults.getHomePage());

    
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    })



    document.getElementById('go-back-icon').addEventListener('click', () => {
        tabManager.goBack();
    })


    document.getElementById('go-forward-icon').addEventListener('click', () => {
        tabManager.goForward();
    })


    document.getElementById('reload-icon').addEventListener('click', () => {
        reloadCurrentTab();
    })


    document.getElementById('home-icon').addEventListener('click', () => {
        handleSearch(Defaults.getHomePage());
    })


    // @ts-ignore
    electronAPI.onNewTab(() => {
        newTab(Defaults.getHomePageTitle(), Defaults.getHomePage());
    })
    
    
    // @ts-ignore
    electronAPI.onCloseTab(() => {
        closeCurrentTab();
    })

    
    // @ts-ignore
    electronAPI.onReloadTab(() => {
        reloadCurrentTab();
    })


    // @ts-ignore
    electronAPI.onGoBack(() => {
        tabManager.goBack();
    })


    // @ts-ignore
    electronAPI.onGoForward(() => {
        tabManager.goForward();
    })


    // @ts-ignore
    electronAPI.onNextTab(() => {
        tabManager.goToNext();
        updateTabStyles();
        searchInput.value = tabManager.getActive().url;
    })


    // @ts-ignore
    electronAPI.onPreviousTab(() => {
        tabManager.goToPrevious();
        updateTabStyles();
        searchInput.value = tabManager.getActive().url;
    })


    // @ts-ignore
    electronAPI.onDevTools(() => {
        tabManager.toggleDeveloperTools();
    })


    // @ts-ignore
    electronAPI.onNewWebviewCreated((details: Electron.HandlerDetails) => {
        /* When a site should be opened in another tab, this function is called */

        newTab('Untitled', details.url);
    })


    // @ts-ignore
    electronAPI.onEngineChanged((engine: string) => {
        const searchEngine: SearchEngine = Utils.engineNameToEngine(engine);

        if (engine) {
            Defaults.setEngine(searchEngine);
        }
    })


    // @ts-ignore
    electronAPI.onHomepageChanged((url_: string) => {
        if (!Utils.isValidURL(url_)) {
            console.error('invalid url for homepage');
            return;
        }

        let url: string;

        if (Utils.hasValidDomain(url_)) {
            url = 'https://' + url_;
        } else {
            url = url_;
        }

        Defaults.setCustomHomepage(url);
    })


    function handleSearch(url: string = ''): void {
        let searchTerm: string = url;

        if (url === '') {
            searchTerm = searchInput.value.trim();
        }
        
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
            
            // Remove error page
            errorContainer.style.display = 'none';
            tabManager.getActiveWebview().style.display = '';

            // Create webview and set active url
            searchInput.value = url;
            tabManager.setActiveURL(url);
            tabManager.setActiveWebviewURL(url);
        } else {
            const searchURL = Defaults.getSearchURL(searchTerm);
            errorContainer.style.display = 'none';
            tabManager.setActiveWebviewURL(searchURL);
        }
    }
    

    // Function to create and load a webview
    function createWebview(url: string, id: number): void {

        // Create new webview element
        const webview = document.createElement('webview');
        webview.setAttribute('src', url);
        webview.setAttribute('id', `webview-${id}`);

        // Needs to be on the handle target:_blank links
        webview.allowpopups = true;

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


        webview.addEventListener('did-fail-load', (event) => {
            // -105 => Unresolved name
            // -102 => Connection refused
            
            if (event.errorCode === -105 || event.errorCode === -102 || event.errorCode === -202) {
                webview.style.display = 'none';

                errorContainer.style.display = 'block';

                const errorWebview = document.createElement(`webview`);
                errorWebview.setAttribute('src', 'error.html');

                errorContainer.append(errorWebview);
            }
        })

        webviewContainer.appendChild(webview);
    }
    
    
    function updateTabStyles(): void {
        const tabElements = Array.from(document.querySelectorAll('.tab'));

        tabElements.forEach((tabElement, index) => {
            const tab = tabManager.getTabs()[index];
    
            if (tab && tabElement) {
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
            searchInput.value = tabManager.getActive().url;
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

        const webview = tabManager.getActiveWebview();
        if (webview) {
            webview.remove();

        }

        tabManager.closeTab(activeTabId); // Close the tab in the TabManager
        updateTabStyles();
    }


    function reloadCurrentTab(): void {
        const view: Electron.WebviewTag = tabManager.getActiveWebview();

        if (!view) {
            console.error('Could not retrieve current webview');
            return;
        }

        view.reload();
    }
})
