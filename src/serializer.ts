// ====================================
//  Project: Nexus Browser
//  Author: Noah Van Miert
//  Date: 16/05/2024
//  Description: Serializer class, responsible for serializing and deserializing settings
//
//  Licensed under the MIT License.
//  For details, see the full license text.
//  https://opensource.org/licenses/MIT
// ====================================


import * as fs from 'fs';


type Settings = {
    [key: string]: any;
}
    

class Serializer {
    private static safeFilepath: string = 'nexusSettings.json';
    
    private static writeDictToFile(settings: string) {
        if (this.safeFilepath !== '') {
            fs.writeFileSync(Serializer.safeFilepath, settings);
        }
    }
    
    
    private static readFromFile(): string | null {
        if (this.safeFilepath === '') {
            return;
        }

        try {
            const content: Buffer = fs.readFileSync(Serializer.safeFilepath);

            if (content) {
                return content.toString();
            }
        } catch (err) {
            /* if file does not exist */
            if (err.code === 'ENOENT') {
                return null;
            }

            throw err;
        }
        
        return null;
    }
    
    
    static serialize(settings: Settings): void {
        this.writeDictToFile(JSON.stringify(settings, null, 4));
    }
    
    
    static deserialize(): Settings | null {
        const content: string | null = this.readFromFile();
        
        if (!content) {
            console.error('Couldn not load settings file');
            return null;
        }
        
        return JSON.parse(content);
    }
    
}

export default Serializer;