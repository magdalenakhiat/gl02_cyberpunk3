import Question from "../src/Question.js";

//TODO: Mettre des vérifications en place pour les cas où le fichier GIFT est malformé

var GIFTParser = function () {
    // Liste de questions avec les réponses associées
    this.parsedQ = [];
}

GIFTParser.prototype.parse = function(data) {
    // On base ce parser sur la specification en ABNF du format GIFT simplifié
    var unparsedQuestions = data.split("\n"); // Chaque ligne comporte une question
    for (var i=0;i<unparsedQuestions.length;i++) {
        // Regex avec trois groupes de captures : id, question et réponses
        var splitQuestion = /^Q([^:]+):([^{]+){([^}]+)}/.exec(unparsedQuestions[i]);
        if (splitQuestion === null) {
            continue;
        }
        
        // ID (N'est pas utilisé pour le constructeur de Question)
        var id = parseInt(splitQuestion[1]);
        
        // Texte
        var enonc = splitQuestion[2];
        
        // Reponses
        var reponses = splitQuestion[3];
        reponses = reponses.split(";"); // On sépare chaque réponse
        
        // RepCorrectes
        var repCorrectes = reponses.filter((answer) => answer[0] === '=');
        
        reponses = reponses.map((mot) => mot.substring(1)); // On enlève premier caractère de la réponse
        repCorrectes = repCorrectes.map((mot) => mot.substring(1));
        
        // Information qui ne sont pas contenu dans la forme simplifiée d'un GIFT
        var type = "choix_multiple";
        var mat = "inconnue";
        var auteur = "inconnu";
        
        this.parsedQ.push(new Question(enonc, type, mat, auteur, reponses, repCorrectes));
    }
}

export default GIFTParser;