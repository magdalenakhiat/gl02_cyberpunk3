import Action from './Action.js';

export default class FileAction extends Action {
    static command = 'file';
    static description = 'Affiche les infos du fichier GIFT';

    static options = [
        {
            name: '-f, --format',
            description: 'Affichage formaté des questions'
        },
        {
            name: '-i, --id <id>',
            description: 'Affiche une question par son ID (1-based)'
        }
    ];

    static execute(args, options, logger) {
        const { context } = args;
        const questions = context.questions;

        if (options.id) {
            const id = parseInt(options.id, 10);

            if (isNaN(id) || id < 1 || id > questions.length) {
                throw new Error(`ID invalide: ${options.id}. Doit être entre 1 et ${questions.length}`);
            }

            const question = questions[id - 1];
            this.displayQuestion(question, id, options.format, logger);
            return;
        }

        logger.info(`Fichier: ${context.file}`);
        logger.info(`Questions trouvées: ${questions.length}`);

        if (context.categories.length > 0) {
            logger.info(`Catégories: ${context.categories.join(', ')}`);
        }

        if (options.format && questions.length > 0) {
            logger.info('');
            questions.forEach((q, i) => this.displayQuestion(q, i + 1, true, logger));
        }
    }

    static displayQuestion(question, id, format, logger) {
        if (format) {
            logger.info(`---Question ${id} ---`);
            logger.info(`Type: ${question.type}`);
            logger.info(`Énoncé : ${question.enonce}`);
            logger.info(`Réponses: ${question.reponses.join(', ')}`);
            logger.info(`Correcte(s): ${question.reponsesCorrectes.join(', ')}`);
            logger.info('');
        } else {
            logger.info(`[${id}] ${question.enonce}`);
        }
    }
}
