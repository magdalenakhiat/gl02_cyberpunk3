import readline from 'readline';
import { registerMenuActions } from './action/index.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

function afficherMenu(actions) {
    console.log('\n========================================');
    console.log('        CYBERPUNK CLI - Menu Principal');
    console.log('========================================');
    actions.forEach(action => {
        console.log(`${action.id}. ${action.label}`);
    });
    console.log('========================================');
}

async function main() {
    console.log('\nBienvenue dans Cyberpunk CLI!');

    const actions = await registerMenuActions();
    let continuer = true;

    while (continuer) {
        afficherMenu(actions);
        const choix = await question('\nVotre choix (1-' + actions.length + '): ');

        const action = actions.find(a => a.id === parseInt(choix, 10));

        if (action) {
            const result = await action.execute(rl, question);
            if (result && result.quit) {
                continuer = false;
            }
        } else {
            console.log('\nChoix invalide. Veuillez entrer un numero entre 1 et ' + actions.length + '.');
        }
    }

    rl.close();
}

main();
