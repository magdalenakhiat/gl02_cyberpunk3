import fs from 'fs';
import MenuAction from './MenuAction.js';
import GiftParser from '../gift_parser.js';
import Examen from '../Examen.js';

export default class ProfilMenuAction extends MenuAction {
    static id = 3;
    static label = 'Generer un profil d\'examen';

    static async execute(rl, question) {
        console.log('\n--- Generer un profil d\'examen ---\n');

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

        // Statistiques par type
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

        // histogramme
        console.log("\nHistogramme :");
        console.log("----------------------------------------");

        for (let type in stats) {
            const n = stats[type];
            const bar = "#".repeat(n);  // 1 # = 1 question
            console.log(type.padEnd(15) + " : " + bar + ` (${n})`);
        }

        console.log("----------------------------------------\n");

        // Catégories éventuelles
        if (parser.categories.length > 0) {
            console.log(`Categories: ${parser.categories.join(', ')}`);
        }

        // Vérification de conformité
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
