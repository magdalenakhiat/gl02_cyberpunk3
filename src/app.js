import pkg from "@caporal/core";
import helloAction from "./action/helloAction.js";
const { program } = pkg;

program
  .name("My super program")
  .description("A program that does something.")
  .action(() => {
    console.log("Hello from main action!");
  })
  
  .command("hello", "Say hello")
  .action(helloAction);

program.run()