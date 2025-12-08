export default class MenuAction {
    static id = 0;
    static label = '';

    static async execute(rl, question) {
        throw new Error('execute() must be implemented');
    }
}
