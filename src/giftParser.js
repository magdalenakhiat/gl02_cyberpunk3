import Question from "../src/Question.js";

//TODO: Mettre des vérifications en place pour les cas où le fichier GIFT est malformé

var GIFTParser = function () {
    // Liste de questions avec les réponses associées
    this.parsedQ = [];
}

GIFTParser.prototype.parse = function(data) {
    // On base ce parser sur la specification en ABNF du format GIFT simplifié
    let unparsedQuestions = data.split("\n"); // Chaque ligne comporte une question
    for (var i=0;i<unparsedQuestions.length;i++) {
        // Regex avec trois groupes de captures : id, question et réponses
        let splitQuestion = /^Q([^:]+):([^{]+){([^}]+)}/.exec(unparsedQuestions[i]);
        if (splitQuestion === null) {
            continue;
        }
        
        // ID (N'est pas utilisé pour le constructeur de Question)
        let id = parseInt(splitQuestion[1]);
        
        // Texte
        let enonc = splitQuestion[2];
        
        // Reponses
        let reponses = splitQuestion[3];
        reponses = reponses.split(";"); // On sépare chaque réponse
        
        // Cette section vérifie que chaque réponse est bien correcte (préfixe '=') ou incorrecte (préfixe '~')
        // On peut envisager de l'intégrer dans le regex, mais cela le rendrait plus compliqué
        let reponsesIsMalformed = false
        for (let k=0;k<reponses.length;k++) {
            if (reponses[k].startsWith("~") || reponses[k].startsWith("=")) {
                continue;
            } else {
                reponsesIsMalformed = true;
                break;
            }
        }
        
        if (reponsesIsMalformed) {
            continue;
        }
        
        // RepCorrectes
        let repCorrectes = reponses.filter((answer) => answer[0] === '=');
        
        reponses = reponses.map((mot) => mot.substring(1)); // On enlève premier caractère de la réponse
        repCorrectes = repCorrectes.map((mot) => mot.substring(1));
        
        // Information qui ne sont pas contenu dans la forme simplifiée d'un GIFT
        let type = "choix_multiple";
        let mat = "inconnue";
        let auteur = "inconnu";
        
        let nquest = new Question(enonc, type, mat, auteur, reponses, repCorrectes);
        if (nquest !== undefined && nquest instanceof Question) {
            this.parsedQ.push(nquest);
        }
    }
}

export default GIFTParser;