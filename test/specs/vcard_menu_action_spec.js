import VcardMenuAction from "../../src/action/vcard.menu.action.js";

describe("Module VcardMenuAction", function () {

    describe("proprietes statiques", function () {

        it("a un id egal a 4", function () {
            expect(VcardMenuAction.id).toBe(4);
        });

        it("a un label correct", function () {
            expect(VcardMenuAction.label).toBe('Generer ma fiche de contact (vCard)');
        });

    });

    describe("methode generateVCard", function () {

        describe("avec des donnees valides", function () {

            it("genere une vCard complete avec tous les champs", function () {
                const data = {
                    nom: 'Gridel',
                    prenom: 'Alexis',
                    email: 'alexis@test.com',
                    tel: '0123456789',
                    org: 'Ecrin Digital'
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeTrue();
                expect(result.errors).toEqual([]);
                expect(result.vcard).toContain('BEGIN:VCARD');
                expect(result.vcard).toContain('VERSION:3.0');
                expect(result.vcard).toContain('N:Gridel;Alexis;;;');
                expect(result.vcard).toContain('FN:Alexis Gridel');
                expect(result.vcard).toContain('EMAIL:alexis@test.com');
                expect(result.vcard).toContain('TEL:0123456789');
                expect(result.vcard).toContain('ORG:Ecrin Digital');
                expect(result.vcard).toContain('END:VCARD');
            });

            it("genere une vCard sans telephone si non fourni", function () {
                const data = {
                    nom: 'Gridel',
                    prenom: 'Alexis',
                    email: 'alexis@test.com',
                    tel: '',
                    org: ''
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeTrue();
                expect(result.vcard).not.toContain('TEL:');
                expect(result.vcard).not.toContain('ORG:');
            });

            it("genere une vCard avec seulement les champs obligatoires", function () {
                const data = {
                    nom: 'Dupont',
                    prenom: 'Jean',
                    email: 'jean@exemple.fr'
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeTrue();
                expect(result.vcard).toContain('N:Dupont;Jean;;;');
                expect(result.vcard).toContain('FN:Jean Dupont');
                expect(result.vcard).toContain('EMAIL:jean@exemple.fr');
            });

        });

        describe("avec des donnees invalides", function () {

            it("echoue si le nom est vide", function () {
                const data = {
                    nom: '',
                    prenom: 'Alexis',
                    email: 'alexis@test.com'
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeFalse();
                expect(result.errors).toContain('Le nom est obligatoire');
                expect(result.vcard).toBeNull();
            });

            it("echoue si le prenom est vide", function () {
                const data = {
                    nom: 'Gridel',
                    prenom: '',
                    email: 'alexis@test.com'
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeFalse();
                expect(result.errors).toContain('Le prenom est obligatoire');
            });

            it("echoue si l'email est vide", function () {
                const data = {
                    nom: 'Gridel',
                    prenom: 'Alexis',
                    email: ''
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeFalse();
                expect(result.errors).toContain('L\'email est obligatoire');
            });

            it("echoue si l'email est invalide", function () {
                const data = {
                    nom: 'Gridel',
                    prenom: 'Alexis',
                    email: 'email-invalide'
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeFalse();
                expect(result.errors).toContain('L\'email n\'est pas valide');
            });

            it("echoue si l'email n'a pas de domaine", function () {
                const data = {
                    nom: 'Gridel',
                    prenom: 'Alexis',
                    email: 'alexis@'
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeFalse();
                expect(result.errors).toContain('L\'email n\'est pas valide');
            });

            it("retourne plusieurs erreurs si plusieurs champs sont invalides", function () {
                const data = {
                    nom: '',
                    prenom: '',
                    email: ''
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeFalse();
                expect(result.errors.length).toBe(3);
                expect(result.errors).toContain('Le nom est obligatoire');
                expect(result.errors).toContain('Le prenom est obligatoire');
                expect(result.errors).toContain('L\'email est obligatoire');
            });

            it("echoue si le nom contient uniquement des espaces", function () {
                const data = {
                    nom: '   ',
                    prenom: 'Alexis',
                    email: 'alexis@test.com'
                };

                const result = VcardMenuAction.generateVCard(data);

                expect(result.success).toBeFalse();
                expect(result.errors).toContain('Le nom est obligatoire');
            });

        });

    });

    describe("methode isValidEmail", function () {

        it("retourne true pour un email valide simple", function () {
            expect(VcardMenuAction.isValidEmail('test@exemple.com')).toBeTrue();
        });

        it("retourne true pour un email avec sous-domaine", function () {
            expect(VcardMenuAction.isValidEmail('test@mail.exemple.com')).toBeTrue();
        });

        it("retourne true pour un email avec points dans le nom", function () {
            expect(VcardMenuAction.isValidEmail('prenom.nom@exemple.com')).toBeTrue();
        });

        it("retourne false pour un email sans @", function () {
            expect(VcardMenuAction.isValidEmail('testexemple.com')).toBeFalse();
        });

        it("retourne false pour un email sans domaine", function () {
            expect(VcardMenuAction.isValidEmail('test@')).toBeFalse();
        });

        it("retourne false pour un email sans extension", function () {
            expect(VcardMenuAction.isValidEmail('test@exemple')).toBeFalse();
        });

        it("retourne false pour une chaine vide", function () {
            expect(VcardMenuAction.isValidEmail('')).toBeFalse();
        });

        it("retourne false pour un email avec espaces", function () {
            expect(VcardMenuAction.isValidEmail('test @exemple.com')).toBeFalse();
        });

    });

    describe("methode generateFileName", function () {

        it("retourne le nom fourni avec extension .vcf si deja presente", function () {
            const result = VcardMenuAction.generateFileName('Alexis', 'Gridel', 'contact.vcf');
            expect(result).toBe('contact.vcf');
        });

        it("ajoute l'extension .vcf si absente", function () {
            const result = VcardMenuAction.generateFileName('Alexis', 'Gridel', 'contact');
            expect(result).toBe('contact.vcf');
        });

        it("genere un nom par defaut si le nom est vide", function () {
            const result = VcardMenuAction.generateFileName('Alexis', 'Gridel', '');
            expect(result).toBe('Alexis_Gridel.vcf');
        });

        it("genere un nom par defaut si le nom est null", function () {
            const result = VcardMenuAction.generateFileName('Alexis', 'Gridel', null);
            expect(result).toBe('Alexis_Gridel.vcf');
        });

        it("genere un nom par defaut si le nom contient uniquement des espaces", function () {
            const result = VcardMenuAction.generateFileName('Alexis', 'Gridel', '   ');
            expect(result).toBe('Alexis_Gridel.vcf');
        });

    });

    describe("format vCard RFC 2426", function () {

        it("commence par BEGIN:VCARD", function () {
            const data = { nom: 'Test', prenom: 'User', email: 'test@test.com' };
            const result = VcardMenuAction.generateVCard(data);

            expect(result.vcard.startsWith('BEGIN:VCARD\n')).toBeTrue();
        });

        it("termine par END:VCARD", function () {
            const data = { nom: 'Test', prenom: 'User', email: 'test@test.com' };
            const result = VcardMenuAction.generateVCard(data);

            expect(result.vcard.endsWith('END:VCARD\n')).toBeTrue();
        });

        it("contient VERSION:3.0", function () {
            const data = { nom: 'Test', prenom: 'User', email: 'test@test.com' };
            const result = VcardMenuAction.generateVCard(data);

            expect(result.vcard).toContain('VERSION:3.0');
        });

        it("le champ N a le bon format (nom;prenom;;;)", function () {
            const data = { nom: 'Dupont', prenom: 'Marie', email: 'marie@test.com' };
            const result = VcardMenuAction.generateVCard(data);

            expect(result.vcard).toContain('N:Dupont;Marie;;;');
        });

        it("le champ FN contient prenom puis nom", function () {
            const data = { nom: 'Dupont', prenom: 'Marie', email: 'marie@test.com' };
            const result = VcardMenuAction.generateVCard(data);

            expect(result.vcard).toContain('FN:Marie Dupont');
        });

    });

});
