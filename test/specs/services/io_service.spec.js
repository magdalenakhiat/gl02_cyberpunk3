import IOService from '../../../src/service/io_service.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe("IOService", function () {
    let tempDir;
    let ioService;

    beforeEach(function () {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'io-test-'));
        ioService = new IOService(tempDir);
    });

    afterEach(function () {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    describe("constructeur", function () {
        it("initialise avec un basePath vide par défaut", function () {
            const service = new IOService();
            expect(service.basePath).toBe('');
        });

        it("initialise avec un basePath fourni", function () {
            const service = new IOService('/some/path');
            expect(service.basePath).toBe('/some/path');
        });
    });

    describe("resolvePath", function () {
        it("retourne le chemin absolu tel quel", function () {
            const absPath = '/absolute/path/file.txt';
            expect(ioService.resolvePath(absPath)).toBe(absPath);
        });

        it("joint le chemin relatif au basePath", function () {
            const result = ioService.resolvePath('relative/file.txt');
            expect(result).toBe(path.join(tempDir, 'relative/file.txt'));
        });
    });

    describe("readFile", function () {
        it("lit le contenu d'un fichier existant", function () {
            const testFile = path.join(tempDir, 'test.txt');
            fs.writeFileSync(testFile, 'contenu test');

            const content = ioService.readFile('test.txt');
            expect(content).toBe('contenu test');
        });

        it("lance une erreur si le fichier n'existe pas", function () {
            expect(() => ioService.readFile('inexistant.txt'))
                .toThrowError(/Fichier non trouvé/);
        });
    });

    describe("writeFile", function () {
        it("écrit le contenu dans un fichier", function () {
            ioService.writeFile('output.txt', 'nouveau contenu');

            const content = fs.readFileSync(path.join(tempDir, 'output.txt'), 'utf-8');
            expect(content).toBe('nouveau contenu');
        });

        it("crée les dossiers parents si nécessaire", function () {
            ioService.writeFile('sub/dir/file.txt', 'contenu');

            const content = fs.readFileSync(path.join(tempDir, 'sub/dir/file.txt'), 'utf-8');
            expect(content).toBe('contenu');
        });
    });

    describe("listFiles", function () {
        beforeEach(function () {
            fs.writeFileSync(path.join(tempDir, 'file1.txt'), '');
            fs.writeFileSync(path.join(tempDir, 'file2.txt'), '');
            fs.writeFileSync(path.join(tempDir, 'file3.js'), '');
        });

        it("liste tous les fichiers sans filtre", function () {
            const files = ioService.listFiles('.');
            expect(files.length).toBe(3);
            expect(files).toContain('file1.txt');
            expect(files).toContain('file2.txt');
            expect(files).toContain('file3.js');
        });

        it("filtre par extension", function () {
            const files = ioService.listFiles('.', '.txt');
            expect(files.length).toBe(2);
            expect(files).toContain('file1.txt');
            expect(files).toContain('file2.txt');
            expect(files).not.toContain('file3.js');
        });

        it("lance une erreur si le dossier n'existe pas", function () {
            expect(() => ioService.listFiles('inexistant'))
                .toThrowError(/Dossier non trouvé/);
        });
    });

    describe("fileExists", function () {
        it("retourne true si le fichier existe", function () {
            fs.writeFileSync(path.join(tempDir, 'existe.txt'), '');
            expect(ioService.fileExists('existe.txt')).toBeTrue();
        });

        it("retourne false si le fichier n'existe pas", function () {
            expect(ioService.fileExists('inexistant.txt')).toBeFalse();
        });
    });
});
