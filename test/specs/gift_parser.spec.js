import GIFTParser from "../../src/gift_parser.js";
import fs from 'fs';
import path from 'path';

describe("GiftParser", function () {

    describe("format legacy (Q1:...)", function () {

        it("parse un GIFT legacy bien formé", function () {
            var gParser = new GIFTParser();
            var testText = "Q1:Quel est la capitale de la France ?{~Londres;=Paris;~Berlin;~Rome}\n";
            testText += "Q2:Quel est la capitale de l'Italie ?{~Londres;~Paris;=Rome;~Berlin}\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(2);
            expect(gParser.parsedQ[0].enonce).toEqual("Quel est la capitale de la France ?");
            expect(gParser.parsedQ[0].reponses).toEqual(["Londres", "Paris", "Berlin", "Rome"]);
            expect(gParser.parsedQ[0].reponsesCorrectes).toEqual(["Paris"]);
        });

        it("rejette un GIFT legacy mal formé", function () {
            var gParser = new GIFTParser();
            var testText = "Q1:Quel est la capitale de la France ?{~Londres;=Paris;~Berlin;~Rome}\n";
            testText += "Q2 Quel est la capitale ?{~Londres;~Paris;=Rome}\n";
            testText += "Q3:Question ?{Londres;~Paris;Rome}\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(1);
        });
    });

    describe("preprocessing", function () {

        it("supprime les commentaires //", function () {
            var gParser = new GIFTParser();
            var testText = "// Ceci est un commentaire\n";
            testText += "::Q1::Question ?{=oui~non}\n";
            testText += "// Autre commentaire\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(1);
        });

        it("extrait les catégories $CATEGORY:", function () {
            var gParser = new GIFTParser();
            var testText = "$CATEGORY: $course$/top/Gold B2\n";
            testText += "::Q1::Question ?{=oui~non}\n";

            gParser.parse(testText);

            expect(gParser.categories.length).toBe(1);
            expect(gParser.categories[0]).toContain("Gold B2");
        });

        it("fusionne les questions multi-lignes", function () {
            var gParser = new GIFTParser();
            var testText = "::Q1::Question avec réponses {\n";
            testText += "  ~option A\n";
            testText += "  ~=option B\n";
            testText += "  ~option C\n";
            testText += "}\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].reponsesCorrectes).toContain("option B");
        });

        it("gère questions GIFT consécutives sans ligne vide", function () {
            var gParser = new GIFTParser();
            var testText = "::Q1::Première question{=a~b}\n";
            testText += "::Q2::Deuxième question{=c~d}\n";
            testText += "::Q3::Troisième question{=e~f}\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(3);
        });
    });

    describe("format GIFT standard (::titre::)", function () {

        it("parse ::Titre::Question{...}", function () {
            var gParser = new GIFTParser();
            var testText = "::U1 p10 Grammar::Question de grammaire ?{~a~b~=c}\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].enonce).toBe("Question de grammaire ?");
        });

        it("gère [html] dans la question", function () {
            var gParser = new GIFTParser();
            var testText = "::Q1::[html]<p>Question avec <b>HTML</b></p>{=réponse}\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].enonce).toContain("<p>");
        });

        it("gère [markdown] dans la question", function () {
            var gParser = new GIFTParser();
            var testText = "::Q1::[markdown]Question avec _italique_{=réponse}\n";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].enonce).toContain("_italique_");
        });
    });

    describe("types de questions", function () {

        it("parse QCM {~a~b~=c}", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Capitale de la France ?{~Londres~Berlin~=Paris~Rome}");

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].type).toBe("choix_multiple");
            expect(gParser.parsedQ[0].reponses.length).toBe(4);
            expect(gParser.parsedQ[0].reponsesCorrectes).toEqual(["Paris"]);
        });

        it("parse Short Answer {=réponse}", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Texte avec trou {=answer}");

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].type).toBe("mot_manquant");
            expect(gParser.parsedQ[0].reponsesCorrectes).toEqual(["answer"]);
        });

        it("parse réponses multiples {=a=b=c}", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Conjugue le verbe {=goes=is going}");

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].reponsesCorrectes.length).toBe(2);
        });

        it("parse Moodle SA {1:SA:=rep}", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Texte {1:SA:=réponse}");

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].type).toBe("mot_manquant");
        });

        it("parse Moodle MC {1:MC:~a~=b}", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Choix {1:MC:~a~=b~c}");

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].type).toBe("choix_multiple");
            expect(gParser.parsedQ[0].reponsesCorrectes).toContain("b");
        });

        it("parse matching {=x->y}", function () {
            var gParser = new GIFTParser();
            var testText = "::Q1::Associe {=cat->chat =dog->chien}";

            gParser.parse(testText);

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].type).toBe("correspondance");
        });

        it("parse vrai/faux {TRUE}", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Paris est en France{TRUE}");

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].type).toBe("vrai_faux");
            expect(gParser.parsedQ[0].reponsesCorrectes).toContain("Vrai");
        });

        it("parse vrai/faux {FALSE}", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Paris est en Allemagne{FALSE}");

            expect(gParser.parsedQ.length).toBe(1);
            expect(gParser.parsedQ[0].reponsesCorrectes).toContain("Faux");
        });
    });

    describe("cas limites et erreurs", function () {

        it("ignore format de réponse non reconnu", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Question{texte sans format}");

            expect(gParser.parsedQ.length).toBe(0);
        });

        it("ignore QCM sans réponse correcte", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Question{~a~b~c}");

            expect(gParser.parsedQ.length).toBe(0);
        });

        it("ignore short answer vide", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Question{=}");

            expect(gParser.parsedQ.length).toBe(0);
        });

        it("ignore matching sans paires valides", function () {
            var gParser = new GIFTParser();
            // Un matching invalide est détecté comme format non reconnu
            gParser.parse("::Q1::Question{juste du texte sans fleche}");

            expect(gParser.parsedQ.length).toBe(0);
        });

        it("ignore question sans bloc de réponses", function () {
            var gParser = new GIFTParser();
            gParser.parse("::Q1::Question sans accolades");

            expect(gParser.parsedQ.length).toBe(0);
        });
    });

    describe("tous les fichiers de data/", function () {
        const dataDir = path.join(process.cwd(), 'data');

        const allFiles = [
            "EM-U4-p32_33-Review.gift",
            "EM-U42-Ultimate.gift",
            "EM-U5-p34-Gra-Expressions_of_quantity.gift",
            "EM-U5-p34-Voc.gift",
            "EM-U5-p35-Gra-Subject_verb_agreement.gift",
            "EM-U5-p36_37-Reading.gift",
            "EM-U5-p38-Passive.gift",
            "EM-U6-p46_47-4.gift",
            "U1-p10-Gra-Present_tenses_habits.gift",
            "U1-p7-Adverbs.gift",
            "U1-p8_9-Reading-Coachella.gift",
            "U10-p106-Reading.gift",
            "U11-p114-Mixed_conditionals.gift",
            "U2-p22-Gra-Ing_or_inf.gift",
            "U3-p30-Reading.gift",
            "U3-p31-Gra-ed_adjectives_prepositions.gift",
            "U3-p32-GR-Present_perfect_vs_past_simple.gift",
            "U3-p32-Gra-Present_perfect_simple_vs_continuous.gift",
            "U3-p33-Gra-As_like.gift",
            "U3-p33-UoE-Hygge.gift",
            "U4-p39-Reading-xmen.gift",
            "U4-p42_43-Listening.gift",
            "U4-p47-Review.gift",
            "U5-p49-GR1-Expressions_of_quantity.gift",
            "U5-p49-Subject_verb_agreement.gift",
            "U5-p50-Use_of_English.gift",
            "U5-p52-Reading-The_death_of_cooking.gift",
            "U5-p54-6-Passive.gift",
            "U5-p54-GR4-Passive-reporting.gift",
            "U5-p57-Review.gift",
            "U6-p59-Vocabulary.gift",
            "U6-p60-Listening.gift",
            "U6-p61-5-Future-forms.gift",
            "U6-p61-GR-Future_forms.gift",
            "U6-p62_63-Reading.gift",
            "U6-p64-Future-perfect-&-continuous.gift",
            "U6-p65-Voc-Expressions_with_get.gift",
            "U6-p67-Review.gift",
            "U6-p68_69-ProgressTest2.gift",
            "U7-p76-Relative_clauses.gift",
            "U7-p76_77-So,such,too,enough.gift",
            "U7-p77-6.gift",
            "U7-p77-It is,there is.gift",
            "U7-p79-Review-3.gift",
            "U8-p84-Voc-Linking_words.gift",
            "U9-p94-Listening.gift",
            "U9-p95-Third_cond-4.gift"
        ];

        const filesWithoutQuestions = [
            "U6-p61-5-Future-forms.gift",
            "U9-p95-Third_cond-4.gift"
        ];

        for (const file of allFiles) {
            if (filesWithoutQuestions.includes(file)) {
                it(`parse ${file} sans erreur (fichier sans questions)`, function () {
                    const filePath = path.join(dataDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    var gParser = new GIFTParser();

                    expect(() => gParser.parse(content)).not.toThrow();
                });
            } else {
                it(`parse ${file}`, function () {
                    const filePath = path.join(dataDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');
                    var gParser = new GIFTParser();

                    expect(() => gParser.parse(content)).not.toThrow();
                    expect(gParser.parsedQ.length).toBeGreaterThan(0);
                });
            }
        }
    });
});
