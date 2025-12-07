import Action from './Action.js';

export default class FileAction extends Action {
    static command = 'file';
    static description = 'Affiche les infos du fichier GIFT';

    static execute(args, options, logger) {
        const { context } = args;

        logger.info(`Fichier: ${context.file}`);
        logger.info(`Questions trouvées: ${context.questions.length}`);

        if (context.categories.length > 0) {
            logger.info(`Catégories: ${context.categories.join(', ')}`);
        }
    }
}
