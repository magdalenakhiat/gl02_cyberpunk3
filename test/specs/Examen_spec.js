<<<<<<< HEAD:spec/Examen_spec.js
import Examen from "../src/Examen.js";
import Question from "../src/Question.js"; 

=======
import Examen from "../../src/Examen.js";
>>>>>>> 811b4f4e774343aeaeb23530f3428fd4875bd358:test/specs/Examen_spec.js

describe("Module Examen", function() {

    describe("constructeur", function() {

        it("crée correctement un examen (test élémentaire)", function() {
            let e = new Examen(10);

            expect(e.id).toBe(10);
            expect(e.questions).toEqual([]);
        });

    });

});



describe("Méthode verifierConformite (SPEC F5)", function() {

    // Helper pour créer une question unique rapidement
    const creerQ = (i) => new Question(`Question unique ${i}`, "QCM");
    // Question spécifique pour tester les doublons
    const creerDoublon = () => new Question("Question Dupliquée !", "QCM");

    // Scénario 1: Moins de 15 questions
    it("doit être INVALIDE si moins de 15 questions (Critère 1)", function() {
        let examen = new Examen(1);
        for (let i = 1; i <= 12; i++) { // 12 questions
            examen.questions.push(creerQ(i));
        }
        
        const rapport = examen.verifierConformite();
        
        expect(rapport.estValide).toBeFalse();
        // Vérifie l'erreur "12/15 minimum"
        expect(rapport.erreurs).toContain("12/15 minimum. L'examen doit contenir au moins 15 questions."); 
        expect(rapport.erreurs.length).toBe(1);
    });

    // Scénario 2: Plus de 20 questions
    it("doit être INVALIDE si plus de 20 questions", function() {
        let examen = new Examen(2);
        for (let i = 1; i <= 21; i++) { // 21 questions
            examen.questions.push(creerQ(i));
        }
        
        const rapport = examen.verifierConformite();
        
        expect(rapport.estValide).toBeFalse();
        // Vérifie l'erreur "21/20 maximum"
        expect(rapport.erreurs).toContain("21/20 maximum. L'examen ne peut pas contenir plus de 20 questions.");
        expect(rapport.erreurs.length).toBe(1);
    });
    
    // Scénario 3: Questions dupliquées
    it("doit être INVALIDE si une question est dupliquée (Critère 2)", function() {
        let examen = new Examen(3);
        
        // Ajout de 15 questions au total (13 uniques + 2 doublons)
        for (let i = 1; i <= 13; i++) {
            examen.questions.push(creerQ(i));
        }
        examen.questions.push(creerDoublon()); 
        examen.questions.push(creerDoublon()); 
        
        const rapport = examen.verifierConformite();
        
        expect(rapport.estValide).toBeFalse();
        // Vérifie l'erreur "Question X apparaît 2 fois"
        expect(rapport.erreurs.some(err => err.includes("Question \"Question Dupliquée !\" apparaît 2 fois"))).toBeTrue();
        expect(rapport.erreurs.length).toBe(1); // Seulement l'erreur de doublon est attendue ici (15 questions total).
    });

    // Scénario 4: Examen valide
    it("doit être VALIDE si entre 15 et 20 questions uniques", function() {
        let examen = new Examen(4);
        for (let i = 1; i <= 17; i++) { // 17 questions uniques
            examen.questions.push(creerQ(i));
        }
        
        const rapport = examen.verifierConformite();
        
        expect(rapport.estValide).toBeTrue();
        expect(rapport.erreurs.length).toBe(0);
    });
});