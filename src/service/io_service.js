import fs from 'fs';
import path from 'path';

class IOService {
    constructor(basePath = '') {
        this.basePath = basePath;
    }

    resolvePath(filePath) {
        if (path.isAbsolute(filePath)) {
            return filePath;
        }
        return path.join(this.basePath, filePath);
    }

    readFile(filePath) {
        const fullPath = this.resolvePath(filePath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Fichier non trouvé: ${fullPath}`);
        }
        return fs.readFileSync(fullPath, 'utf-8');
    }

    writeFile(filePath, content) {
        const fullPath = this.resolvePath(filePath);
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, content, 'utf-8');
    }

    listFiles(dirPath, extension = null) {
        const fullPath = this.resolvePath(dirPath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`Dossier non trouvé: ${fullPath}`);
        }
        let files = fs.readdirSync(fullPath);
        if (extension) {
            files = files.filter(f => f.endsWith(extension));
        }
        return files;
    }

    fileExists(filePath) {
        return fs.existsSync(this.resolvePath(filePath));
    }
}

export default IOService;
