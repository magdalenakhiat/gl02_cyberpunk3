import GiftParser from '../gift_parser.js';
import GiftIOService from '../service/gift_io_service.js';

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

        cmd = cmd.argument('<file>', 'Fichier GIFT à traiter', {
            validator: (value) => {
                if (!value.endsWith('.gift')) {
                    throw new Error('Le fichier doit avoir l\'extension .gift');
                }
                return value;
            }
        });

        for (const arg of this.arguments) {
            cmd = cmd.argument(arg.name, arg.description, arg.options || {});
        }

        for (const opt of this.options) {
            cmd = cmd.option(opt.name, opt.description, opt.options || {});
        }

        cmd.action(async ({ args, options, logger }) => {
            const giftIO = new GiftIOService();
            const parser = new GiftParser();

            try {
                const content = giftIO.readGiftFile(args.file);
                parser.parse(content);

                const context = {
                    file: args.file,
                    content: content,
                    parser: parser,
                    questions: parser.parsedQ,
                    categories: parser.categories
                };

                await this.execute({ ...args, context }, options, logger);
            } catch (error) {
                logger.error(`Erreur: ${error.message}`);
                process.exit(1);
            }
        });
    }
}
