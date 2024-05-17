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
    Aol,
    Ask,
}


class Defaults {
    private static searchEngine: SearchEngine = SearchEngine.Google;
    private static homepage: string = '';


    static setEngine(engine: SearchEngine): void {
        Defaults.searchEngine = engine;
    }


    static setCustomHomepage(url: string): void {
        Defaults.homepage = url;
    }


    static resetHomepage(): void {
        Defaults.homepage = '';
        Defaults.homepage = Defaults.getHomepage();
    }


    static getHomepage(): string | null {
        if (this.homepage) {
            return Defaults.homepage;
        }

        switch (Defaults.searchEngine) {
            case SearchEngine.Google:
                return 'https://www.google.com';

            case SearchEngine.DuckDuckGo:
                return 'https://duckduckgo.com';

            case SearchEngine.Yahoo:
                return 'https://www.search.yahoo.com';

            case SearchEngine.Bing:
                return 'https://search.bing.com';

            case SearchEngine.Aol:
                return 'https://search.aol.com';

            default: {
                console.error('Unknown Search Engine');
                return null;
            }
        }
    }


    static getHomepageTitle(): string | null {
        switch (Defaults.searchEngine) {
            case SearchEngine.Google:
                return 'Google';

            case SearchEngine.DuckDuckGo:
                return 'DuckDuckGo';

            case SearchEngine.Yahoo:
                return 'Yahoo';

            case SearchEngine.Bing:
                return 'Bing';

            case SearchEngine.Aol:
                return 'Aol';

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
                return `https://www.search.yahoo.com/search?p=${encodeURIComponent(searchTerm)}`;

            case SearchEngine.Bing:
                return `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`;

            case SearchEngine.Aol:
                return `https://search.aol.com/search?q=${encodeURIComponent(searchTerm)}`;

            default: {
                console.error('Unknown Search Engine');
                return null;
            }
        }
    }
}