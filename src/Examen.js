export default class Examen {
    constructor(id) {
        this.id = id;               // ID unique de l'examen
        this.questions = [];        // Liste des questions
    }
verifierConformite() {
        const erreurs = [];
        const nbQuestions = this.questions.length;

        // --- RÈGLE 1 : Vérification du nombre de questions (15-20) ---
        
        if (nbQuestions < 15) {
            // Critère d'acceptation 1: 12 questions → Erreur "12/15 minimum"
            erreurs.push(`${nbQuestions}/15 minimum. L'examen doit contenir au moins 15 questions.`);
        }
        
        if (nbQuestions > 20) {
            // Règle: Maximum 20 questions
            erreurs.push(`${nbQuestions}/20 maximum. L'examen ne peut pas contenir plus de 20 questions.`);
        }

        // --- RÈGLE 2 : Détection des doublons ---
        // Nous allons utiliser une Map pour stocker une représentation unique de chaque question 
        // et détecter rapidement si nous en rencontrons une identique (enonce + type).
        
        const signaturesUniques = new Map(); 
        
        for (let i = 0; i < nbQuestions; i++) {
            const questionA = this.questions[i];
            
            // Créer une clé unique basée sur l'énoncé et le type (car Question.estEgale les compare)
            const signature = `${questionA.enonce.trim().toLowerCase()}::${questionA.type}`;

            if (signaturesUniques.has(signature)) {
                // Doublon trouvé
                const premiereApparition = signaturesUniques.get(signature) + 1; // Le premier index est 0
                const indexActuel = i + 1; // L'index actuel
                
                // Critère d'acceptation 2: Question dupliquée → Erreur "Question X apparaît 2 fois"
                erreurs.push(
                    `Question "${questionA.enonce.substring(0, 30)}..." apparaît 2 fois (Index ${premiereApparition} et ${indexActuel}).`
                );
            } else {
                signaturesUniques.set(signature, i); // Stocker l'index de la première apparition
            }
        }

        // --- RAPPORT DÉTAILLÉ ---
        return {
            estValide: erreurs.length === 0,
            erreurs: erreurs
        };
    }
    
    // ... (Autres méthodes de la classe Examen : ajouterQ, etc.)
}


    // Ajoute une question
    ajouterQ(question) {
        if (!this.contientQ(question)) {
            this.questions.push(question);
        }
        return this;
    }

    // Supp une question
    supprimerQ(question) {
        this.questions = this.questions.filter(q => !q.estEgale(question));
        return this;
    }

    // Vérifie que la question soit déjà dans l'exam
    contientQ(question) {
        return this.questions.some(q => q.estEgale(question));
    }

    //nb question
    nbQuestions() {
        return this.questions.length;
    }

    //pas de doublons
    estValide() {
        const n = this.nbQuestions();

        // on vérifie l'unicité sur l'énoncé
        const uniqueCount = new Set(this.questions.map(q => q.enonce)).size;
        const noDuplicate = (uniqueCount === n);

        return noDuplicate && n >= 15 && n <= 20;
    }
    
}
