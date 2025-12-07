import Action from './Action.js';

export default class HelloAction extends Action {
    static command = 'hello';
    static description = 'Say hello';

    static execute(args, options, logger) {
        console.log('Hello from command!');
    }
}
