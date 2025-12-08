import fs from 'fs';
import MenuAction from './MenuAction.js';
import GiftParser from '../gift_parser.js';
import Examen from '../Examen.js';

export default class PassageMenuAction extends MenuAction {
    static id = 3;
    static label = 'Simuler le passage d\'un examen';

    static async execute(rl, question) {
        console.log('\n--- Simuler le passage d\'un examen ---\n');

        const IdExam = await question('ID de l\'examen : '); // CONTINUER ICI

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

        const stats = {};
        parser.parsedQ.forEach(q => {
            stats[q.type] = (stats[q.type] || 0) + 1;
        });

        console.log('\n========================================');
        console.log('         PROFIL DE L\'EXAMEN');
        console.log('========================================');
        console.log(`Fichier: ${filePath}`);
        console.log(`Nombre total de questions: ${parser.parsedQ.length}`);
        console.log('\nRepartition par type:');

        Object.entries(stats).forEach(([type, count]) => {
            const pourcentage = ((count / parser.parsedQ.length) * 100).toFixed(1);
            console.log(`  - ${type}: ${count} (${pourcentage}%)`);
        });

        if (parser.categories.length > 0) {
            console.log(`\nCategories: ${parser.categories.join(', ')}`);
        }

        const examen = new Examen('temp');
        parser.parsedQ.forEach(q => examen.ajouterQ(q));
        const conformite = examen.verifierConformite();

        console.log('\nConformite:');
        if (conformite.estValide) {
            console.log('  L\'examen est conforme aux regles.');
        } else {
            console.log('  Problemes detectes:');
            conformite.erreurs.forEach(err => console.log(`    - ${err}`));
        }
        console.log('========================================');
    }
}
