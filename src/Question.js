export default class Question {
    constructor(enonce, type, matiere, auteur, reponses, reponsesCorrectes) {
        this.enonce = enonce;
        this.type = type;
        /*
            Type possible d'après le CDC :
                choix_multiple, vrai_faux, correspondance, mot_manquant, numérique, ouverte
        */
        this.reponses = reponses;
        this.reponsesCorrectes = reponsesCorrectes;
        
        // Ces attributs sont inutiles puisque jamais représenter dans le format GIFT
        this.matiere = matiere;
        this.auteur = auteur;
    }
    
    estEgale = function (question) {
    return (this.enonce === question.enonce && this.type === question.type);
    }
}