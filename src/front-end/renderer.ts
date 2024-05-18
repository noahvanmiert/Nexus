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
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const tabBar = document.getElementById('tab-bar');
    const webviewContainer = document.getElementById('webview-container');
    const errorContainer = document.getElementById('error-container');

    const tabManager = new TabManager(webviewContainer);

    let firstLoad = true;


    // @ts-ignore
    app.receive('browser-settings', (settings: Settings) => {
        if (!settings) {
            handleFirstLoad();
            return;
        }

        applySettings(settings);
        handleFirstLoad();
    })


    function handleFirstLoad(): void {
        if (firstLoad) {
            newTab(Defaults.getHomepageTitle(), Defaults.getHomepage());
            firstLoad = false;
        }
    }


    function applySettings(settings: Settings): void {
        Defaults.setEngine(Utils.engineNameToEngine(settings.engine));

        /* if the homepage is valid */
        if (!settings.homepage) {
            Defaults.resetHomepage();
            return;
        }

        Defaults.setCustomHomepage(settings.homepage);
    }


    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
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
        handleSearch(Defaults.getHomepage());
    })


    // @ts-ignore
    app.receive('new-tab', () => {
        newTab(Defaults.getHomepageTitle(), Defaults.getHomepage());
    })


    // @ts-ignore
    app.receive('close-tab', () => {
        closeCurrentTab();
    })


    // @ts-ignore
    app.receive('reload-tab', () => {
        reloadCurrentTab();
    })


    // @ts-ignore
    app.receive('go-back', () => {
        tabManager.goBack();
    })


    // @ts-ignore
    app.receive('go-forward', () => {
        tabManager.goForward();
    })


    // @ts-ignore
    app.receive('next-tab', () => {
        tabManager.goToNext();
        updateTabStyles();
        searchInput.value = tabManager.getActive().url;
    })


    // @ts-ignore
    app.receive('previous-tab', () => {
        tabManager.goToPrevious();
        updateTabStyles();
        searchInput.value = tabManager.getActive().url;
    })


    // @ts-ignore
    app.receive('dev-tools', () => {
        tabManager.toggleDeveloperTools();
    })


    // @ts-ignore
    app.receive('new-webview-created', (details: Electron.HandlerDetails) => {
        /* When a site should be opened in another tab, this function is called */
        newTab('Untitled', details.url);
    })


    // @ts-ignore
    app.receive('zoom-in', () => {
        tabManager.zoomIn();
    })


    // @ts-ignore
    app.receive('zoom-out', () => {
        tabManager.zoomOut();
    })


    // @ts-ignore
    app.receive('toggle-mute', () => {
        tabManager.toggleMute();
    })


    function handleSearch(url: string = ''): void {
        let searchTerm = url || searchInput.value.trim();

        if (!searchTerm) {
            return;
        }

        if (Utils.isValidURL(searchTerm)) {
            handleValidURL(searchTerm);
            return;
        }

        handleSearchQuery(searchTerm);
    }


    function handleValidURL(searchTerm: string): void {
        let url = Utils.hasValidDomain(searchTerm) ? `https://${searchTerm}` : searchTerm;

        hideErrorContainer()
        showActiveWebview();

        searchInput.value = url;
        tabManager.setActiveURL(url);
        tabManager.setActiveWebviewURL(url);
    }


    function handleSearchQuery(searchTerm: string): void {
        const searchURL = Defaults.getSearchURL(searchTerm);

        hideErrorContainer();
        tabManager.setActiveWebviewURL(searchURL);
    }


    function createWebview(url: string, id: number): void {
        const webview = document.createElement('webview');

        initializeWebview(webview, url, id);
        attachEventListeners(webview);

        webviewContainer.appendChild(webview);
    }


    function initializeWebview(webview: Electron.WebviewTag, url: string, id: number): void {
        webview.setAttribute('src', url);
        webview.setAttribute('id', `webview-${id}`);
        webview.setAttribute('style', 'width: 100%; height: 100%;');

        /* Needs to be on the handle target:_blank links */
        webview.allowpopups = true;
    }


    function attachEventListeners(webview: Electron.WebviewTag): void {
        webview.addEventListener('dom-ready', handleDomReady);
        webview.addEventListener('did-navigate-in-page', handleDidNavigateInPage);
        webview.addEventListener('did-fail-load', handleDidFailLoad);
    }


    function handleDomReady(this: Electron.WebviewTag): void {
        tabManager.resetZoomFactor();

        const title = this.getTitle() || '';
        tabManager.setActiveTitle(title);
        tabManager.updateHTMLTabTitle(title);
    }


    function handleDidNavigateInPage(this: Electron.WebviewTag, e: any): void {
        tabManager.setActiveURL(e.url);
        searchInput.value = e.url;
    }


    function handleDidFailLoad(this: Electron.WebviewTag, e: any): void {
        const errorCodes = [-105, -102, -202];

        if (errorCodes.includes(e.errorCode)) {
            this.style.display = 'none';
            showErrorPage();
        }
    }


    function showErrorPage(): void {
        errorContainer.style.display = 'block';
        const errorWebview = document.createElement('webview');
        errorWebview.setAttribute('src', 'error.html');
        errorContainer.appendChild(errorWebview);
    }


    function updateTabStyles(): void {
        const tabElements = Array.from(document.querySelectorAll('.tab'));

        tabElements.forEach((tabElement, index) => {
            const tab = tabManager.get()[index];

            if (tab && tabElement) {
                // Toggle the 'active' class using the ternary operator
                tab.active ? tabElement.classList.add('active') : tabElement.classList.remove('active');
            }
        })
    }


    function handleTabSelect(e: MouseEvent): void {
        const tabElement = e.currentTarget as HTMLElement;
        const tabId = parseInt(tabElement.id);
        const clickedTab = tabManager.get().find(tab => tab.id === tabId);

        if (clickedTab && !clickedTab.active) {
            tabManager.activate(clickedTab);
            updateTabStyles();
            searchInput.value = tabManager.getActive().url;
        }
    }


    function newTab(title: string, url: string): void {
        const tabId = Utils.iota();

        const newTabElement = createTabElement(title, tabId);
        tabBar.appendChild(newTabElement);

        const tab = tabManager.add(title, url, tabId);
        tabManager.activate(tab);

        updateTabStyles();
        createWebview(url, tabId);
    }


    function createTabElement(title: string, id: number): HTMLElement {
        const tab = document.createElement('div');

        tab.className = 'tab';
        tab.id = id.toString();
        tab.textContent = title;

        tab.addEventListener('click', handleTabSelect);

        return tab;
    }


    function closeCurrentTab(): void {
        const tabs = tabManager.get();
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

        tabManager.close(activeTabId); // Close the tab in the TabManager
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


    function hideErrorContainer(): void {
        errorContainer.style.display = 'none';
    }


    function showActiveWebview(): void {
        tabManager.getActiveWebview().style.display = '';
    }
})
