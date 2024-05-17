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

    private static write(settings: string): void {
        if (this.safeFilepath !== '') {
            fs.writeFileSync(Serializer.safeFilepath, settings);
        }
    }


    private static read(): string | null {
        if (!this.safeFilepath) {
            return;
        }

        try {
            const content: string = fs.readFileSync(Serializer.safeFilepath, 'utf-8');
            return content || null;
        } catch (err) {
            /* if file does not exist */
            if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
                return null;
            }

            console.error(`Failed to read setting file: ${err}`);
            throw err;
        }
    }


    static serialize(settings: Settings): void {
        /* null and 4 => formatting with 4 spaces as indent */
        this.write(JSON.stringify(settings, null, 4));
    }


    static deserialize(): Settings | null {
        const content: string | null = this.read();

        if (!content) {
            console.error('Could not load settings file');
            return null;
        }


        try {
            return JSON.parse(content);
        } catch (err) {
            console.error(`Failed to parse JSON: ${err}`)
            return null;
        }
    }

}

export default Serializer;