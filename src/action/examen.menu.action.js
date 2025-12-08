import MenuAction from './MenuAction.js';
import Examen from '../Examen.js';
import Question from '../Question.js';
import writeGIFT from '../writeGift.js';

export default class ExamenMenuAction extends MenuAction {
    static id = 1;
    static label = 'Creer un examen GIFT';

    static async execute(rl, question) {
        console.log('\n--- Creer un examen GIFT ---\n');

        const examId = await question('ID de l\'examen: ');
        const examen = new Examen(examId);

        let ajouterQuestion = true;
        let questionNum = 1;

        while (ajouterQuestion) {
            console.log(`\n--- Question ${questionNum} ---`);
            const enonce = await question('Enonce de la question: ');

            console.log('Types disponibles: choix_multiple, vrai_faux, correspondance, mot_manquant, numerique, ouverte');
            const type = await question('Type de question: ');

            const reponsesStr = await question('Reponses (separees par des virgules): ');
            const reponses = reponsesStr.split(',').map(r => r.trim());

            const correctesStr = await question('Reponses correctes (separees par des virgules): ');
            const reponsesCorrectes = correctesStr.split(',').map(r => r.trim());

            const q = new Question(enonce, type, '', '', reponses, reponsesCorrectes);
            examen.ajouterQ(q);

            questionNum++;
            const continuer = await question('\nAjouter une autre question? (o/n): ');
            ajouterQuestion = continuer.toLowerCase() === 'o';
        }

        const conformite = examen.verifierConformite();
        if (!conformite.estValide) {
            console.log('\nAttention, l\'examen presente des problemes:');
            conformite.erreurs.forEach(err => console.log(`  - ${err}`));
        }

        const filePath = await question('\nChemin du fichier de sortie (ex: ./mon_examen.gift): ');
        const [content, result] = writeGIFT(examen, filePath);

        if (result === -1) {
            console.log('\nErreur lors de la sauvegarde ou examen invalide.');
            if (content) {
                console.log('\nContenu genere:');
                console.log(content);
            }
        } else {
            console.log(`\nExamen sauvegarde dans: ${result}`);
        }
    }
}
