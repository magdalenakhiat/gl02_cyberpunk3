import MenuAction from './MenuAction.js';

export default class QuitterMenuAction extends MenuAction {
    static id = 6;
    static label = 'Quitter';

    static async execute(rl, question) {
        console.log('\nAu revoir!');
        return { quit: true };
    }
}
