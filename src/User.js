

export default function User(id, password, nom, prenom, email, role = "enseignant") {
    this.id = id;
    this.password = password;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.role = role;
}

// vérifie le bon mdp 
User.prototype.estMotDePasseCorrect = function (mdp) {
    return this.password === mdp;
};

// retourne nom complet 
User.prototype.nomComplet = function () {
    return `${this.prenom} ${this.nom}`;
};
