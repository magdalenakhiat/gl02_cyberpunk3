export default class Question {
    constructor(enonce, type, matiere, auteur, reponses, reponsesCorrectes) {
        this.enonce = enonce;
        this.type = type;
        /*
            Type possible d'après le CDC :
                choix_multiple, vrai_faux, correspondance, mot_manquant, numérique, ouverte
        */
        this.matiere = matiere;
        this.auteur = auteur;
        this.reponses = reponses;
        this.reponsesCorrectes = reponsesCorrectes;
    }
    
    estEgale = function (question) {
    return (this.enonce === question.enonce && this.type === question.type);
    }
}

