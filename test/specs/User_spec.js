import User from "../../src/User.js";

describe("Module User", function() {

    describe("constructeur", function() {

        it("crée correctement un utilisateur (test élémentaire)", function() {
            let u = new User(1, "pwd", "Falip", "Joris", "joris@test.com", "admin");

            expect(u.id).toBe(1);
            expect(u.password).toBe("pwd");
            expect(u.nom).toBe("Falip");
            expect(u.prenom).toBe("Joris");
            expect(u.email).toBe("joris@test.com");
            expect(u.role).toBe("admin");
        });

    });

});
