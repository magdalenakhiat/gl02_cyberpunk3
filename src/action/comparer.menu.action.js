import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MenuAction from './MenuAction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ComparerMenuAction extends MenuAction {
    static id = 5;
    static label = "Comparer les types de questions (Simple ou Global)";

    static estProfilValide(profil) {
        return profil && 
               typeof profil.nombreQuestions === 'number' && 
               profil.repartitionParType && 
               typeof profil.repartitionParType === 'object';
    }

    static async execute(rl, question) {
        const directoryPath = path.resolve(__dirname, '../../data/profils');

        try {
            if (!fs.existsSync(directoryPath)) {
                console.log(`\n[Erreur] Dossier introuvable : ${directoryPath}`);
                return;
            }

            const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));

            if (files.length < 2) {
                console.log("\n[Erreur] Il faut au moins deux profils JSON pour effectuer une comparaison.");
                return;
            }

            console.log("\n--- MODES DE COMPARAISON ---");
            console.log("1. Comparer deux profils spécifiques (A vs B)");
            console.log("2. Comparer un profil de référence à TOUS les autres");
            
            const mode = await question('\nVotre choix de mode : ');

            console.log("\n--- LISTE DES PROFILS DISPONIBLES ---");
            files.forEach((file, index) => console.log(`${index + 1}. ${file}`));

            if (mode === "1") {
                const choix1 = await question('\nSélectionnez le premier profil (index) : ');
                const choix2 = await question('Sélectionnez le deuxième profil (index) : ');
                
                const f1 = files[parseInt(choix1) - 1];
                const f2 = files[parseInt(choix2) - 1];

                if (!f1 || !f2) return console.log("Sélection invalide.");
                this.afficherComparaisonDeux(path.join(directoryPath, f1), path.join(directoryPath, f2));

            } else if (mode === "2") {
                const choixCible = await question('\nSélectionnez le profil de référence (index) : ');
                const fileCible = files[parseInt(choixCible) - 1];

                if (!fileCible) return console.log("Sélection invalide.");
                this.afficherComparaisonUnContreTous(directoryPath, fileCible, files);
            } else {
                console.log("Mode invalide.");
            }

        } catch (error) {
            console.error("Erreur lors de l'exécution :", error.message);
        }
    }

    // MODE 1 : Comparaison détaillée entre deux fichiers
    static afficherComparaisonDeux(pathA, pathB) {
        const pA = JSON.parse(fs.readFileSync(pathA, 'utf8'));
        const pB = JSON.parse(fs.readFileSync(pathB, 'utf8'));

        if (!this.estProfilValide(pA) || !this.estProfilValide(pB)) return console.log("Format incompatible.");

        console.log('\n=============================================================');
        console.log(`COMPARAISON : ${path.basename(pathA)} VS ${path.basename(pathB)}`);
        console.log('=============================================================');
        
        const tousTypes = new Set([...Object.keys(pA.repartitionParType), ...Object.keys(pB.repartitionParType)]);
        
        console.log(`${"TYPE DE QUESTION".padEnd(25)} | PRF A | PRF B | RÉSULTAT`);
        console.log("-".repeat(70));

        tousTypes.forEach(type => {
            const cA = pA.repartitionParType[type] || 0;
            const cB = pB.repartitionParType[type] || 0;
            let verdict = cA > cB ? "Profil A en a plus" : (cB > cA ? "Profil B en a plus" : "Égalité");
            console.log(`${type.padEnd(25)} | ${cA.toString().padEnd(5)} | ${cB.toString().padEnd(5)} | ${verdict}`);
        });
        console.log('=============================================================\n');
    }

    // MODE 2 : Comparaison d'un fichier contre toute la base
    static afficherComparaisonUnContreTous(dir, fileCible, allFiles) {
        const pCible = JSON.parse(fs.readFileSync(path.join(dir, fileCible), 'utf8'));
        if (!this.estProfilValide(pCible)) return console.log("Profil cible invalide.");

        console.log(`\n=============================================================`);
        console.log(`ANALYSE COMPARATIVE : ${fileCible} contre LA BASE`);
        console.log(`=============================================================`);

        allFiles.forEach(file => {
            if (file === fileCible) return;

            try {
                const pAutre = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
                if (!this.estProfilValide(pAutre)) return;

                console.log(`\n> COMPARAISON AVEC : ${file}`);
                
                
                const typesReference = Object.keys(pCible.repartitionParType);
                
                typesReference.forEach(type => {
                    const qRef = pCible.repartitionParType[type] || 0;
                    const qAutre = pAutre.repartitionParType[type] || 0;
                    
                    let diff = qAutre - qRef;
                    let texte = "";
                    if (diff > 0) texte = `(+${diff}) Ce profil en a PLUS que la référence`;
                    else if (diff < 0) texte = `(${diff}) Ce profil en a MOINS que la référence`;
                    else texte = "(=) Même quantité";

                    console.log(`  - ${type.padEnd(18)}: ${qAutre} questions ${texte}`);
                });
            } catch (e) {
                // Ignore les fichiers corrompus
            }
        });
        console.log(`\n=============================================================\n`);
    }
}