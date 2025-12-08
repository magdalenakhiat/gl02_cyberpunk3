import Question from "../../src/Question.js";

describe("Module Question", function () {

    describe("constructeur", function () {

        it("crée correctement une question", function () {
            let q = new Question(
                "2+2 ?",
                "QCM",
                "maths",
                "joris falip",
                ["1", "2", "3", "4"],
                ["4"]
            );

            expect(q.enonce).toBe("2+2 ?");
            expect(q.type).toBe("QCM");
            expect(q.matiere).toBe("maths");
            expect(q.auteur).toBe("joris falip");
            expect(q.reponses).toEqual(["1", "2", "3", "4"]);
            expect(q.reponsesCorrectes).toEqual(["4"]);
        });

    });

    describe("méthode estEgale", function () {

        it("renvoie true si deux questions ont même enonce et même type", function () {
            let q1 = new Question("2+2 ?", "QCM");
            let q2 = new Question("2+2 ?", "QCM");

            expect(q1.estEgale(q2)).toBeTrue();
        });

        it("renvoie false si les enonces sont diff", function () {
            let q1 = new Question("2+2 ?", "QCM");
            let q2 = new Question("3+3 ?", "QCM");

            expect(q1.estEgale(q2)).toBeFalse();
        });

        it("renvoie false si les types sknt diff", function () {
            let q1 = new Question("2+2 ?", "QCM");
            let q2 = new Question("2+2 ?", "VraiFaux");

            expect(q1.estEgale(q2)).toBeFalse();
        });

    });

});
