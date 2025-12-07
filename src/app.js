import pkg from "@caporal/core";
import { registerActions } from "./action/index.js";

const { program } = pkg;

program
    .name("Cyberpunk CLI")
    .description("CLI pour gérer les examens GIFT");

await registerActions(program);

program.run();
