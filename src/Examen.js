export default class Examen {
    constructor(id) {
        this.id = id;               // ID unique de l'examen
        this.questions = [];        // Liste des questions
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
