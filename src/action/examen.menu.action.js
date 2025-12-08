import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import MenuAction from './MenuAction.js';
import Examen from '../Examen.js';
import writeGIFT from '../writeGift.js';
import fs from 'fs';
import path from 'path';
import GiftParser from '../gift_parser.js';

// stockage des IDs
const usedExamIds = new Set();

export default class ExamenMenuAction extends MenuAction {
    static id = 1;
    static label = 'Créer un examen GIFT';

    static async execute(rl, question) {
        console.log('\n--- Création automatique d’un examen GIFT ---\n');

        const dataDir = './data';
        const fichiers = fs.readdirSync(dataDir)
            .filter(f => f.endsWith('.gift'));

        if (fichiers.length === 0) {
            console.log("Aucun fichier .gift trouvé dans /data");
            return;
        }

        console.log(`→ ${fichiers.length} fichiers trouvés dans data/`);
        
        let banqueQuestions = [];

        for (const fic of fichiers) {
            const fullPath = path.join(dataDir, fic);

            const raw = fs.readFileSync(fullPath, 'utf-8');
            const parser = new GiftParser();
            parser.parse(raw);

            console.log(`→ ${fic} : ${parser.parsedQ.length} questions`);

            banqueQuestions.push(...parser.parsedQ);
        }

        console.log(`\nTOTAL des questions disponibles : ${banqueQuestions.length}`);

// === ID unique basé sur les fichiers dans /data ===
let examId;

while (true) {
    examId = await question("ID de l'examen : ");

    // Construit le chemin attendu du fichier
    const destination = path.join(__dirname, '../..', 'data', `examen_${examId}.gift`);

    if (fs.existsSync(destination)) {
        console.log(` Un examen avec l'ID "${examId}" existe déjà.`);
        console.log("Veuillez choisir un ID différent.\n");
    } else {
        break;
    }
}

        const examen = new Examen(examId);

        // Choisir nb questions
        const nbStr = await question("Combien de questions ? (15–20) : ");
        const nb = parseInt(nbStr);

        if (nb < 15 || nb > 20) {
            console.log("Le nombre doit être compris entre 15 et 20.");
            return;
        }


        const uniques = new Map();
        while (uniques.size < nb) {
            const q = banqueQuestions[Math.floor(Math.random() * banqueQuestions.length)];
            uniques.set(q.enonce, q);
        }
        const selection = Array.from(uniques.values());

        // Ajout des questions dans l'examen
        selection.forEach(q => examen.ajouterQ(q));

        // Vérification après ajout
        const rep = examen.verifierConformite();
        if (!rep.estValide) {
            console.log("\nProblèmes détectés :");
            rep.erreurs.forEach(e => console.log(" - " + e));
        }

        // Sauvegarde 
const out = path.join(__dirname, '../..', 'data', `examen_${examId}.gift`);
console.log(`\nLe fichier sera sauvegardé automatiquement dans : ${out}`);

const [content, result] = writeGIFT(examen, out);

if (result === -1) console.log("Erreur lors de la génération.");
else console.log("Examen généré :", result);

    }
}
