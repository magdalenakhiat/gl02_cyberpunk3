#!/usr/bin/env node
const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
Usage: cyberpunk <command> [options]

Commands:
  hello         Affiche un message de bienvenue
  help          Affiche cette aide

Options:
  -v, --version Affiche la version
  `);
}

function showVersion() {
  const packageJson = require('../package.json');
  console.log(`v${packageJson.version}`);
}

switch (command) {
  case 'hello':
    console.log('Bienvenue dans le CLI Cyberpunk GL02!');
    break;

  case 'help':
  case undefined:
    showHelp();
    break;

  case '-v':
  case '--version':
    showVersion();
    break;

  default:
    console.log(`Commande inconnue: ${command}`);
    showHelp();
    process.exit(1);
}
