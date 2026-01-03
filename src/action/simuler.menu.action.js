import fs from 'fs';
import MenuAction from './MenuAction.js';
import GiftParser from '../gift_parser.js';

export default class SimulerMenuAction extends MenuAction {
    static id = 5;
    static label = 'Simuler un examen';

    static async execute(rl, question) {
        console.log('\n=== Simulation d’examen (V1) ===');

        const filePath = await question('Chemin complet du fichier .gift : ');
        const data = fs.readFileSync(filePath, 'utf-8');

        const parser = new GiftParser();
        parser.parse(data);

        console.log('\nExamen chargé : ' + parser.parsedQ.length + ' question(s).');
        console.log('Simulation non implémentée (V1).');
    }
}
