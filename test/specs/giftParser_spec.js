import GIFTParser from "../../src/giftParser.js";

describe("Suite de tests pour le parser de GIFT simplifié", function () {
    
    it("Parser un GIFT bien formée correctement", function () {
        var gParser = new GIFTParser();
        var testText1 = "Q1:Quel est la capitale de la France ?{~Londres;=Paris;~Berlin;~Rome}\n";
        var testText2 = testText1 + "Q2:Quel est la capitale de l'Italie ?{~Londres;~Paris;=Rome;~Berlin}\n";
        
        gParser.parse(testText2);
        let testEnonc = gParser.parsedQ[0].enonce;
        let testRep = gParser.parsedQ[0].reponses;
        let testRepCorr = gParser.parsedQ[0].reponsesCorrectes;
        
        expect(testEnonc).toEqual("Quel est la capitale de la France ?");
        expect(testRep).toEqual(["Londres", "Paris", "Berlin", "Rome"]);
        expect(testRepCorr).toEqual(["Paris"]);
        
        testEnonc = gParser.parsedQ[1].enonce;
        testRep = gParser.parsedQ[1].reponses;
        testRepCorr = gParser.parsedQ[1].reponsesCorrectes;
        
        expect(testEnonc).toEqual("Quel est la capitale de l'Italie ?");
        expect(testRep).toEqual(["Londres", "Paris", "Rome", "Berlin"]);
        expect(testRepCorr).toEqual(["Rome"]);
    });
    
    it("Ne pas accepter un GIFT mal formée", function () {
        var gParser = new GIFTParser();
        var testText1 = "Q1:Quel est la capitale de la France ?{~Londres;=Paris;~Berlin;~Rome}\n";
        var testText2 = testText1 + "Q2 Quel est la capitale de l'Italie ?{~Londres;~Paris;=Rome;~Berlin}\n";
        var testText3 = testText2 + "Q3:Quel est la capitale de l'Italie ?~Londres;~Paris;=Rome;~Berlin}\n";
        var testText4 = testText3 + "Q4:Quel est la capitale de l'Italie ?{~Londres;~Paris;=Rome;~Berlin\n";
        var testText5 = testText4 + "Q5:Quel est la capitale de l'Italie ?{Londres;~Paris;Rome;~Berlin}\n";
        var testText6 = testText5 + "Q6:Quel est la capitale de l'Italie ?{~Londres;~Paris;=Rome;~Berlin}\n";
        
        gParser.parse(testText6);
        let testEnonc = gParser.parsedQ[0].enonce;
        let testRep = gParser.parsedQ[0].reponses;
        let testRepCorr = gParser.parsedQ[0].reponsesCorrectes;
        expect(testEnonc).toEqual("Quel est la capitale de la France ?");
        expect(testRep).toEqual(["Londres", "Paris", "Berlin", "Rome"]);
        expect(testRepCorr).toEqual(["Paris"]);
        
        expect(gParser.parsedQ.length).toBe(2);
    });
});