import Examen from "../src/Examen.js";

describe("Module Examen", function() {

    describe("constructeur", function() {

        it("crée correctement un examen (test élémentaire)", function() {
            let e = new Examen(10);

            expect(e.id).toBe(10);
            expect(e.questions).toEqual([]);
        });

    });

});
