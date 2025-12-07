import GiftIOService from '../../../src/service/gift_io_service.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe("GiftIOService", function () {
    let tempDir;
    let giftService;

    beforeEach(function () {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gift-test-'));
        giftService = new GiftIOService(tempDir);
    });

    afterEach(function () {
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    describe("readGiftFile", function () {
        it("lit un fichier .gift", function () {
            const testFile = path.join(tempDir, 'test.gift');
            fs.writeFileSync(testFile, '::Q1::Question{=reponse}');

            const content = giftService.readGiftFile('test.gift');
            expect(content).toBe('::Q1::Question{=reponse}');
        });

        it("lance une erreur si l'extension n'est pas .gift", function () {
            const testFile = path.join(tempDir, 'test.txt');
            fs.writeFileSync(testFile, 'contenu');

            expect(() => giftService.readGiftFile('test.txt'))
                .toThrowError(/Extension invalide/);
        });
    });

    describe("writeGiftFile", function () {
        it("écrit un fichier .gift", function () {
            giftService.writeGiftFile('output.gift', '::Q1::Test');

            const content = fs.readFileSync(path.join(tempDir, 'output.gift'), 'utf-8');
            expect(content).toBe('::Q1::Test');
        });

        it("ajoute automatiquement l'extension .gift", function () {
            giftService.writeGiftFile('output', '::Q1::Test');

            expect(fs.existsSync(path.join(tempDir, 'output.gift'))).toBeTrue();
        });
    });

    describe("listGiftFiles", function () {
        beforeEach(function () {
            fs.writeFileSync(path.join(tempDir, 'file1.gift'), '');
            fs.writeFileSync(path.join(tempDir, 'file2.gift'), '');
            fs.writeFileSync(path.join(tempDir, 'file3.txt'), '');
        });

        it("liste uniquement les fichiers .gift", function () {
            const files = giftService.listGiftFiles('.');
            expect(files.length).toBe(2);
            expect(files).toContain('file1.gift');
            expect(files).toContain('file2.gift');
            expect(files).not.toContain('file3.txt');
        });
    });

    describe("readAllGiftFiles", function () {
        beforeEach(function () {
            fs.writeFileSync(path.join(tempDir, 'q1.gift'), '::Q1::Question1');
            fs.writeFileSync(path.join(tempDir, 'q2.gift'), '::Q2::Question2');
            fs.writeFileSync(path.join(tempDir, 'other.txt'), 'ignored');
        });

        it("charge tous les fichiers .gift d'un dossier", function () {
            const results = giftService.readAllGiftFiles('.');
            expect(results.length).toBe(2);

            const filenames = results.map(r => r.filename);
            expect(filenames).toContain('q1.gift');
            expect(filenames).toContain('q2.gift');
        });

        it("retourne le contenu de chaque fichier", function () {
            const results = giftService.readAllGiftFiles('.');
            const q1 = results.find(r => r.filename === 'q1.gift');

            expect(q1.content).toBe('::Q1::Question1');
        });
    });
});
