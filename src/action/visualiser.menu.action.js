import fs from 'fs';
import MenuAction from './MenuAction.js';
import GiftParser from '../gift_parser.js';

export default class VisualiserMenuAction extends MenuAction {
    static id = 2;
    static label = 'Visualiser une question';

    static async execute(rl, question) {
        console.log('\n--- Visualiser une question ---\n');

        const filePath = await question('Chemin du fichier GIFT: ');

        if (!fs.existsSync(filePath)) {
            console.log('Erreur: Le fichier n\'existe pas.');
            return;
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        const parser = new GiftParser();
        parser.parse(data);

        if (parser.parsedQ.length === 0) {
            console.log('Aucune question trouvee dans le fichier.');
            return;
        }

        const total = parser.parsedQ.length;
        console.log(`\n${total} question(s) trouvee(s).`);

        const idStr = await question(`ID de la question (1-${total}): `);
        const id = parseInt(idStr, 10);

        if (isNaN(id) || id < 1 || id > total) {
            console.log(`Erreur: ID invalide. Doit etre entre 1 et ${total}.`);
            return;
        }

        const q = parser.parsedQ[id - 1];
        console.log(`\n--- Question ${id} ---`);
        console.log(`Type: ${q.type}`);
        console.log(`Enonce: ${q.enonce}`);
        console.log(`Reponses: ${q.reponses.join(', ')}`);
        console.log(`Correcte(s): ${q.reponsesCorrectes.join(', ')}`);

        if (parser.categories.length > 0) {
            console.log(`\nCategories: ${parser.categories.join(', ')}`);
        }
    }
}
