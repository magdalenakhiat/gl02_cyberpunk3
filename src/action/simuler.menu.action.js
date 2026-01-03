import fs from 'fs';
import MenuAction from './MenuAction.js';
import GiftParser from '../gift_parser.js';

export default class SimulerMenuAction extends MenuAction {
    static id = 5; // garde ton mapping actuel
    static label = 'Simuler un examen';

    static async execute(rl, question) {
        console.log('\n=== Simulation d’examen ===');

        const filePath = (await question('Chemin du fichier .gift : ')).trim();

        let data;
        try {
            data = fs.readFileSync(filePath, 'utf-8');
        } catch (e) {
            console.log('\n Erreur : fichier d’examen introuvable.');
            console.log('Veuillez vérifier le chemin du fichier GIFT.');
            return;
        }

        const parser = new GiftParser();
        parser.parse(data);

        const questions = parser.parsedQ;
        console.log('\nExamen chargé : ' + questions.length + ' question(s).');

        let score = 0;
        let total = 0;

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];

            console.log('\n----------------------------------------');
            console.log(`Question ${i + 1}/${questions.length}`);
            console.log(q.enonce);

            // QCM / Vrai-Faux : on affiche les choix et l'utilisateur tape le texte exact
            if (q.type === 'choix_multiple' || q.type === 'vrai_faux') {
                total++;

                for (let j = 0; j < q.reponses.length; j++) {
                    console.log(`${j + 1}. ${q.reponses[j]}`);
                }

                const repNum = parseInt((await question('Votre réponse (numéro) : ')).trim(), 10);
                const rep = q.reponses[repNum - 1];

                const ok = q.reponsesCorrectes.includes(rep);
                if (ok) score++;

                console.log(ok ? 'Correct' : `Faux (attendu: ${q.reponsesCorrectes.join(' / ')})`);
                continue;
            }

            // Mot manquant (SA)
            if (q.type === 'mot_manquant') {
                total++;

                const rep = await question('Votre réponse : ');

                const ok = q.reponsesCorrectes.includes(rep);
                if (ok) score++;

                console.log(ok ? 'Correct' : `Faux (attendu: ${q.reponsesCorrectes.join(' / ')})`);
                continue;
            }

            // Correspondance et autres : pas gérés
            console.log('Type non géré : ' + q.type);
        }

        console.log('\n=== Fin de simulation ===');
        console.log(`Score : ${score}/${total}`);
    }
}
