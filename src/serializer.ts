import * as fs from 'fs';

type SettingsDict = {
    [key: string]: any;
}
    

class Serializer {
    private static safeFilePath: string = 'nexusSettings.json';
    
    private static writeDictToFile(settings: string) {
        if (this.safeFilePath !== '') {
            fs.writeFileSync(Serializer.safeFilePath, settings);
        }
    }
    
    
    private static readFromFile(): string | null {
        if (this.safeFilePath !== '') {
            const content: Buffer = fs.readFileSync(Serializer.safeFilePath);
            
            if (content) {
                return content.toString();
            }
        }
        
        return null;
    }
    
    
    static serialize(settings: SettingsDict): void {
        this.writeDictToFile(JSON.stringify(settings, null, 4));
    }
    
    
    static deserialize(): SettingsDict | null {
        const content: string | null = this.readFromFile();
        
        if (!content) {
            console.error('Couldn not load settings file');
            return null;
        }
        
        return JSON.parse(content);
    }
    
}

export default Serializer;