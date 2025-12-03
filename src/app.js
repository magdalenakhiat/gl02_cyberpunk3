import pkg from "@caporal/core";
const { program } = pkg;

program
  .name("My super program")
  .description("A program that does something.")
  .action(() => {
    console.log("Hello from main action!");
  })
  .command("hello", "Say hello")
  .action(() => {
    console.log("Hello from command!");
  });

program.run()