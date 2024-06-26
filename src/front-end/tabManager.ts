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

        this.getZoomFactorHTMLElement().style.display = 'none';
    }


    add(title: string, url: string, id: number): Tab {
        const tab = new Tab(title, url, id);
        this.tabs.push(tab);

        return tab;
    }


    close(id: number): void {
        /* ensure there is more than one tab open */
        if (this.tabs.length <= 1) {
            return;
        }

        /* find if the tab with id is at index zero or not and do different things then */
        const index = this.tabs.findIndex(tab => tab.id === id);

        // Check if the tab to be closed is the first tab
        if (index === 0) {
            this.activate(this.tabs[1]);
        } else {
            this.activate(this.tabs[index - 1]);
        }

        this.tabs.splice(index, 1);
    }


    get(): Tab[] {
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


    activate(tab: Tab): void {
        tab.activate();

        this.tabs.forEach((t) => {
            if (t !== tab) {
                t.deactivate();
            }
        })

        this.hideAllWebviews();
        this.showActiveWebview();

        const zoomFactor = this.getActive().zoomFactor;
        const zoomFactorPercentage = (100 * zoomFactor).toFixed(0);
        const zoomFactorElement = this.getZoomFactorHTMLElement();

        if (zoomFactor !== 1) {
            zoomFactorElement.innerText = zoomFactorPercentage + '%';
            zoomFactorElement.style.display = '';
        } else {
            zoomFactorElement.style.display = 'none';
        }

    }


    private hideAllWebviews(): void {
        const webviews: NodeListOf<HTMLElement> = this.webViewContainer.querySelectorAll('webview');

        webviews.forEach(view => {
            view.style.display = 'none';
        })
    }


    private showActiveWebview(): void {
        const webviewId = `#webview-${this.getActive().id}`;
        const activeWebview: HTMLElement = this.webViewContainer.querySelector(webviewId);

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

        tabElement.innerText = title;
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

        /* if this is the not last tab */
        if (tabIndex + 1 !== this.tabs.length) {
            this.activate(this.tabs[tabIndex + 1]);
        }
    }


    goToPrevious(): void {
        const index = this.tabs.findIndex(tab => tab.active === true);

        /* if this is the not first tab */
        if (index > 0) {
            this.activate(this.tabs[index - 1]);
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

        webview.isDevToolsOpened() ? webview.closeDevTools() : webview.openDevTools();
    }


    getZoomFactorHTMLElement(): HTMLElement {
        return document.getElementById('zoom-level');
    }


    private updateZoomDisplay(): void {
        const zoomElement = this.getZoomFactorHTMLElement();
        const zoomPercentage = (100 * this.getActiveWebview().getZoomFactor()).toFixed(0);

        if (parseInt(zoomPercentage) === 100) {
            zoomElement.style.display = 'none';
            return;
        }

        zoomElement.innerText = zoomPercentage + '%';
        zoomElement.style.display = '';
    }


    private changeZoom(factor: number): void {
        const webview: Electron.WebviewTag = this.getActiveWebview();

        if (!webview) {
            return;
        }

        const currentFactor: number = webview.getZoomFactor();
        let newZoomFactor = Math.round((currentFactor + factor) * 10) / 10;
        webview.setZoomFactor(newZoomFactor);

        this.getActive().zoomFactor = newZoomFactor;

        this.updateZoomDisplay();
    }

    zoomIn(): void {
        /* zoom 10% in */
        this.changeZoom(0.1);
    }


    zoomOut(): void {
        /* zoom 10% out */
        this.changeZoom(-0.1);
    }


    resetZoomFactor(): void {
        const defaultZoomFactor = 1.0; // 100%
        this.getActiveWebview().setZoomFactor(defaultZoomFactor);
        this.updateZoomDisplay();
    }


    toggleMute(): void {
        const webview = this.getActiveWebview();
        const tabElement = document.getElementById(this.getActive().id.toString());

        if (!tabElement) {
            console.error('Could not get HTML element of current tab');
            return;
        }

        if (!webview) {
            return;
        }


        if (webview.isAudioMuted()) {
            webview.setAudioMuted(false);
            tabElement.style.fontStyle = '';
            return;
        }

        webview.setAudioMuted(true);
        tabElement.style.fontStyle = 'italic';
    }
}