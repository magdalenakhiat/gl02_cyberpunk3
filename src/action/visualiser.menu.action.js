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

        console.log(`\n${parser.parsedQ.length} question(s) trouvee(s).\n`);

        parser.parsedQ.forEach((q, index) => {
            console.log(`--- Question ${index + 1} ---`);
            console.log(`Type: ${q.type}`);
            console.log(`Enonce: ${q.enonce}`);
            console.log(`Reponses: ${q.reponses.join(', ')}`);
            console.log(`Correcte(s): ${q.reponsesCorrectes.join(', ')}`);
            console.log('');
        });

        if (parser.categories.length > 0) {
            console.log(`Categories: ${parser.categories.join(', ')}`);
        }
    }
}
