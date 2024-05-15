// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 27/04/2024
//  Description: Static class containing all defaults
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


enum SearchEngine {
    Google,
    DuckDuckGo,
    Yahoo,
    Bing,
}


class Defaults {
    private static searchEngine: SearchEngine = SearchEngine.Google;
    private static homePage: string | null = null;


    static setEngine(engine: SearchEngine): void {
        Defaults.searchEngine = engine;
    }


    static setCustomHomepage(url: string) {
        Defaults.homePage = url;
    }


    static getHomePage(): string | null {
        if (this.homePage) {
            return Defaults.homePage;
        }

        switch (Defaults.searchEngine) {
            case SearchEngine.Google:
                return 'https://www.google.com';

            case SearchEngine.DuckDuckGo:
                return 'https://duckduckgo.com';

            case SearchEngine.Yahoo:
                return 'https://www.yahoo.com';

            case SearchEngine.Bing:
                return 'https://www.bing.com';

            default: {
                console.error('Unknown Search Engine');
                return null;
            }
        }
    }


    static getHomePageTitle(): string | null {
        switch (Defaults.searchEngine) {
            case SearchEngine.Google:
                return 'Google';

            case SearchEngine.DuckDuckGo:
                return 'DuckDuckGo';

            case SearchEngine.Yahoo:
                return 'Yahoo';

            case SearchEngine.Bing:
                return 'Bing';

            default: {
                console.error('Unkown Search Engine');
                return null;
            }
        }
    }


    static getSearchURL(searchTerm: string): string | null {
        switch (Defaults.searchEngine) {
            case SearchEngine.Google:
                return `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;

            case SearchEngine.DuckDuckGo:
                return `https://duckduckgo.com/?q=${encodeURIComponent(searchTerm)}`;

            case SearchEngine.Yahoo:
                return `https://www.yahoo.com/search?p=${encodeURIComponent(searchTerm)}`;

            case SearchEngine.Bing:
                return `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`;

            default: {
                console.error('Unknown Search Engine');
                return null;
            }
        }
    }
}