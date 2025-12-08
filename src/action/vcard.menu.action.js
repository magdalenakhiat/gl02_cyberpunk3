import fs from 'fs';
import MenuAction from './MenuAction.js';

export default class VcardMenuAction extends MenuAction {
    static id = 4;
    static label = 'Generer ma fiche de contact (vCard)';

    static generateVCard(data) {
        const errors = [];

        if (!data.nom || !data.nom.trim()) {
            errors.push('Le nom est obligatoire');
        }
        if (!data.prenom || !data.prenom.trim()) {
            errors.push('Le prenom est obligatoire');
        }
        if (!data.email || !data.email.trim()) {
            errors.push('L\'email est obligatoire');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('L\'email n\'est pas valide');
        }

        if (errors.length > 0) {
            return { success: false, errors, vcard: null };
        }

        let vcard = 'BEGIN:VCARD\n';
        vcard += 'VERSION:3.0\n';
        vcard += `N:${data.nom};${data.prenom};;;\n`;
        vcard += `FN:${data.prenom} ${data.nom}\n`;
        vcard += `EMAIL:${data.email}\n`;
        if (data.tel && data.tel.trim()) vcard += `TEL:${data.tel}\n`;
        if (data.org && data.org.trim()) vcard += `ORG:${data.org}\n`;
        vcard += 'END:VCARD\n';

        return { success: true, errors: [], vcard };
    }

    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static generateFileName(prenom, nom, fileName) {
        if (!fileName || !fileName.trim()) {
            fileName = `${prenom}_${nom}.vcf`;
        }
        if (!fileName.endsWith('.vcf')) {
            fileName += '.vcf';
        }
        return fileName;
    }

    static async execute(rl, question) {
        console.log('\n--- Generer ma fiche de contact (vCard) ---\n');

        const nom = await question('Nom: ');
        const prenom = await question('Prenom: ');
        const email = await question('Email: ');
        const tel = await question('Telephone (optionnel): ');
        const org = await question('Organisation (optionnel): ');

        const result = this.generateVCard({ nom, prenom, email, tel, org });

        if (!result.success) {
            console.log('\nErreur(s) de validation:');
            result.errors.forEach(err => console.log(`  - ${err}`));
            return;
        }

        console.log('\n--- vCard generee ---\n');
        console.log(result.vcard);

        const sauvegarder = await question('Sauvegarder dans un fichier? (o/n): ');
        if (sauvegarder.toLowerCase() === 'o') {
            let fileName = await question('Nom du fichier (ex: contact.vcf): ');
            fileName = this.generateFileName(prenom, nom, fileName);

            if (!fileName.trim()) {
                console.log(`Nom vide, utilisation de: ${fileName}`);
            }

            fs.writeFileSync(fileName, result.vcard);
            console.log(`vCard sauvegardee dans: ${fileName}`);
        }
    }
}
