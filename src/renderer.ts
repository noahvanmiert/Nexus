// ====================================
//  Copyright (C) Nova Industries
//  27/04/2024  
// ====================================


const defaultStartpage: string = 'https://google.com';


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

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
});
