// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Some handy utility functions
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


class Utils {
    private static iotaCounter = 0;
    
    
    static iota(): number {
        let result = Utils.iotaCounter;
        Utils.iotaCounter++;
        
        return result;
    }
    
    
    // Check if a given text has a valid domain and no spaces (e.g. google.com, youtube.com, ...)
    static hasValidDomain(text: string): boolean {
        const domainRegex = /^(?!.*\s)\b\w+(?:-?\w)*\.\w{2,}(?:\.\w{2,})?(?:$|[^a-zA-Z0-9])/i;
        
        return domainRegex.test(text);
    }
    
    
    static isValidURL(url: string): boolean {
        // Regular expression to match the protocol part of the URL
        const protocolRegex = /^(https?|ftp):\/\//i;
    
        // Check if the URL starts with a protocol
        if (protocolRegex.test(url)) {
            try {
                // Try to create a new URL object with the URL
                new URL(url);

                return true;
            } catch (_) {
                return false;
            }
        }
        
        // Returns true if the url has a valid domain an no spaces (so it is a url without protocol)
        // else it will return false because it is a search term.
        return Utils.hasValidDomain(url);
    }
    

    static engineNameToEngine(engine: string): SearchEngine | null {
        switch (engine) {
            case 'google': return SearchEngine.Google;
            case 'duckduckgo': return SearchEngine.DuckDuckGo;
            case 'yahoo': return SearchEngine.Yahoo;
            case 'bing': return SearchEngine.Bing;

            default: {
                console.error('Unknown search engine:', engine);
                return null;
            }
        }
    }

}








