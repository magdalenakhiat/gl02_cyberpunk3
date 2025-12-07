/**
 * Abstraction pour géré mieux les commandes CLI
 */
export default class Action {
    static command = '';
    static description = '';
    static options = [];
    static arguments = [];

    static execute(args, options, logger) {
        throw new Error('execute() must be implemented');
    }

    static register(program) {
        let cmd = program.command(this.command, this.description);

        for (const arg of this.arguments) {
            cmd = cmd.argument(arg.name, arg.description, arg.options || {});
        }

        for (const opt of this.options) {
            cmd = cmd.option(opt.name, opt.description, opt.options || {});
        }

        cmd.action(this.execute.bind(this));
    }
}
