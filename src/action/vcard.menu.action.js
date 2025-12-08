import fs from 'fs';
import MenuAction from './MenuAction.js';

export default class VcardMenuAction extends MenuAction {
    static id = 4;
    static label = 'Generer ma fiche de contact (vCard)';

    static async execute(rl, question) {
        console.log('\n--- Generer ma fiche de contact (vCard) ---\n');

        const nom = await question('Nom: ');
        const prenom = await question('Prenom: ');
        const email = await question('Email: ');
        const tel = await question('Telephone (optionnel): ');
        const org = await question('Organisation (optionnel): ');

        let vcard = 'BEGIN:VCARD\n';
        vcard += 'VERSION:3.0\n';
        vcard += `N:${nom};${prenom};;;\n`;
        vcard += `FN:${prenom} ${nom}\n`;
        vcard += `EMAIL:${email}\n`;
        if (tel) vcard += `TEL:${tel}\n`;
        if (org) vcard += `ORG:${org}\n`;
        vcard += 'END:VCARD\n';

        console.log('\n--- vCard generee ---\n');
        console.log(vcard);

        const sauvegarder = await question('Sauvegarder dans un fichier? (o/n): ');
        if (sauvegarder.toLowerCase() === 'o') {
            let fileName = await question('Nom du fichier (ex: contact.vcf): ');
            if (!fileName.trim()) {
                fileName = `${prenom}_${nom}.vcf`;
                console.log(`Nom vide, utilisation de: ${fileName}`);
            }
            if (!fileName.endsWith('.vcf')) {
                fileName += '.vcf';
            }
            fs.writeFileSync(fileName, vcard);
            console.log(`vCard sauvegardee dans: ${fileName}`);
        }
    }
}
