function Examen(id) {
    this.id = id;               // ID unique de l'examen
    this.questions = [];        // Liste de questions
}


// Ajoute une question à l'examen
Examen.prototype.ajouterQ = function(question) {
    if (!this.contientQ(question)) {
        this.questions.push(question);
    }
    return this;
};

// supp une question de l'examen 
Examen.prototype.supprimerQ = function(question) {
    this.questions = this.questions.filter(q => !q.estEgale(question));
    return this;
};

// vérifie si la question est deja dans l'exam
Examen.prototype.contientQ = function(question) {
    return this.questions.some(q => q.estEgale(question));
};

// nb de questions dans l'exam
Examen.prototype.nbQuestions = function() {
    return this.questions.length;
};

// aucune questions dupliquée et ente 15 et 20 questions par exam
Examen.prototype.estValide = function() {
    const n = this.nbQuestions();

    // Vérification des doublons avec Set sur l'énoncé
    const uniqueCount = new Set(this.questions.map(q => q.enonce)).size;
    const noDuplicate = (uniqueCount === n);

    // Contraintes du cahier des charges
    return noDuplicate && n >= 15 && n <= 20;
};

module.exports = Examen;
