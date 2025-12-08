import IOService from './io_service.js';

class GiftIOService extends IOService {
    constructor(basePath = '') {
        super(basePath);
    }

    readGiftFile(filePath) {
        if (!filePath.endsWith('.gift')) {
            throw new Error(`Extension invalide, fichier .gift attendu: ${filePath}`);
        }
        return this.readFile(filePath);
    }

    writeGiftFile(filePath, content) {
        if (!filePath.endsWith('.gift')) {
            filePath += '.gift';
        }
        this.writeFile(filePath, content);
    }

    listGiftFiles(dirPath = '.') {
        return this.listFiles(dirPath, '.gift');
    }

    readAllGiftFiles(dirPath = '.') {
        const files = this.listGiftFiles(dirPath);
        const results = [];
        for (const file of files) {
            const filePath = `${dirPath}/${file}`;
            results.push({
                filename: file,
                content: this.readFile(filePath)
            });
        }
        return results;
    }
}

export default GiftIOService;
