import GIFTParser from "../../src/gift_parser.js";
import writeGIFT from "../../src/writeGift.js";
import Question from "../../src/Question.js";
import Examen from "../../src/Examen.js";

describe("Suite de tests pour le programme de sauvegarde de GIFT simplifié", function () {
    
    it("Sauvegarde correctement un examen GIFT", function () {
        
        let exam1 = new Examen(1);
        for (let i=1;i<=8;i++) {
            exam1.ajouterQ(new Question( //enonce, type, matiere, auteur, reponses, reponsesCorrectes
            "Quel est la capitale de la France ?" + i,
            "choix_multiple",
            "",
            "",
            ["Londres", "Paris", "Berlin", "Rome"],
            ["Paris"]))
            exam1.ajouterQ(new Question( //enonce, type, matiere, auteur, reponses, reponsesCorrectes
            "Quel est la capitale de l'Italie ?" + i,
            "choix_multiple",
            "",
            "",
            ["Londres", "Paris", "Rome", "Berlin"],
            ["Rome"]))
        }
        
        let generatedText = writeGIFT(exam1, "")[0];
        
        var gParser = new GIFTParser();
        gParser.parse(generatedText);
        //console.log(gParser.parsedQ);
        let testEnonc = gParser.parsedQ[0].enonce;
        let testRep = gParser.parsedQ[0].reponses;
        let testRepCorr = gParser.parsedQ[0].reponsesCorrectes;
        
        expect(testEnonc).toEqual("Quel est la capitale de la France ?1");
        expect(testRep).toEqual(["Londres", "Paris", "Berlin", "Rome"]);
        expect(testRepCorr).toEqual(["Paris"]);
        
        testEnonc = gParser.parsedQ[1].enonce;
        testRep = gParser.parsedQ[1].reponses;
        testRepCorr = gParser.parsedQ[1].reponsesCorrectes;
        
        expect(testEnonc).toEqual("Quel est la capitale de l'Italie ?1");
        expect(testRep).toEqual(["Londres", "Paris", "Rome", "Berlin"]);
        expect(testRepCorr).toEqual(["Rome"]);
    });
});
