import Question from "./Question.js";

class GiftParser {
    constructor() {
        this.parsedQ = [];
        this.categories = [];
    }

    parse(data) {
        this.parsedQ = [];
        this.categories = [];

        let lines = data.split('\n');
        lines = this.removeComments(lines);
        lines = this.extractCategories(lines);

        let questionBlocks = this.joinMultilineQuestions(lines);

        for (let block of questionBlocks) {
            let question = this.parseQuestionBlock(block);
            if (question) {
                this.parsedQ.push(question);
            }
        }
    }

    removeComments(lines) {
        return lines.filter(line => !line.trim().startsWith('//'));
    }

    extractCategories(lines) {
        let filtered = [];
        for (let line of lines) {
            if (line.trim().startsWith('$CATEGORY:')) {
                this.categories.push(line.trim().substring(10).trim());
            } else {
                filtered.push(line);
            }
        }
        return filtered;
    }

    joinMultilineQuestions(lines) {
        let blocks = [];
        let currentBlock = '';
        let inGiftQuestion = false;

        for (let line of lines) {
            let trimmed = line.trim();

            if (trimmed.startsWith('::')) {
                if (currentBlock.trim() !== '') {
                    blocks.push(currentBlock.trim());
                }
                currentBlock = line;
                inGiftQuestion = true;
            } else if (this.isLegacyFormat(trimmed)) {
                if (currentBlock.trim() !== '') {
                    blocks.push(currentBlock.trim());
                }
                blocks.push(trimmed);
                currentBlock = '';
                inGiftQuestion = false;
            } else if (trimmed === '') {
                if (!inGiftQuestion && currentBlock.trim() !== '') {
                    blocks.push(currentBlock.trim());
                    currentBlock = '';
                }
            } else {
                currentBlock += ' ' + line;
            }
        }

        if (currentBlock.trim() !== '') {
            blocks.push(currentBlock.trim());
        }

        return blocks;
    }

    isLegacyFormat(line) {
        return /^Q\d+:/.test(line);
    }

    parseQuestionBlock(block) {
        if (block.startsWith('::')) {
            return this.parseGiftFormat(block);
        }

        if (this.isLegacyFormat(block)) {
            return this.parseLegacyFormat(block);
        }

        return null;
    }

    parseGiftFormat(block) {
        let titleMatch = block.match(/^::([^:]+)::/);
        if (!titleMatch) return null;

        let title = titleMatch[1].trim();
        let rest = block.substring(titleMatch[0].length);

        let format = null;
        if (rest.startsWith('[html]')) {
            format = 'html';
            rest = rest.substring(6);
        } else if (rest.startsWith('[markdown]')) {
            format = 'markdown';
            rest = rest.substring(10);
        }

        let answerBlocks = this.extractAnswerBlocks(rest);

        if (answerBlocks.length === 0) {
            return null;
        }

        let validBlocks = answerBlocks.filter(b => b.content.trim() !== '');
        if (validBlocks.length === 0) {
            return null;
        }

        let mainAnswer = validBlocks[0];
        let enonce = rest.substring(0, mainAnswer.start).trim();
        let answersContent = mainAnswer.content;

        let parsed = this.parseAnswers(answersContent);
        if (!parsed) return null;

        return new Question(
            enonce,
            parsed.type,
            "",
            "",
            parsed.reponses,
            parsed.reponsesCorrectes
        );
    }

    extractAnswerBlocks(text) {
        let blocks = [];
        let depth = 0;
        let start = -1;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '{') {
                if (depth === 0) {
                    start = i;
                }
                depth++;
            } else if (text[i] === '}') {
                depth--;
                if (depth === 0 && start !== -1) {
                    blocks.push({
                        start: start,
                        end: i,
                        content: text.substring(start + 1, i)
                    });
                    start = -1;
                }
            }
        }

        return blocks;
    }

    parseAnswers(content) {
        content = content.trim();

        if (/^(TRUE|FALSE|T|F)$/i.test(content)) {
            let isTrue = /^(TRUE|T)$/i.test(content);
            return {
                type: 'vrai_faux',
                reponses: ['Vrai', 'Faux'],
                reponsesCorrectes: isTrue ? ['Vrai'] : ['Faux']
            };
        }

        if (content.includes('->')) {
            return this.parseMatching(content);
        }

        if (/^\d+:(SA|MC|MW):/.test(content)) {
            return this.parseMoodleFormat(content);
        }

        if (content.includes('~')) {
            return this.parseMultipleChoice(content);
        }

        if (content.startsWith('=')) {
            return this.parseShortAnswer(content);
        }

        return null;
    }

    parseMultipleChoice(content) {
        content = content.replace(/\s+/g, ' ').trim();

        let parts = content.split(/(?=[~=])/);
        parts = parts.filter(p => p.trim() !== '');

        let reponses = [];
        let reponsesCorrectes = [];

        for (let part of parts) {
            part = part.trim();
            if (part.startsWith('~=') || part.startsWith('=')) {
                let answer = part.replace(/^~?=/, '').trim();
                if (answer) {
                    reponses.push(answer);
                    reponsesCorrectes.push(answer);
                }
            } else if (part.startsWith('~')) {
                let answer = part.substring(1).trim();
                if (answer) {
                    reponses.push(answer);
                }
            }
        }

        if (reponses.length === 0 || reponsesCorrectes.length === 0) {
            return null;
        }

        let type = reponses.length === 2 ? 'vrai_faux' : 'choix_multiple';

        return {
            type: type,
            reponses: reponses,
            reponsesCorrectes: reponsesCorrectes
        };
    }

    parseShortAnswer(content) {
        content = content.trim();

        let answers = [];

        let parts = content.split(/[=|]/).filter(p => p.trim() !== '');

        for (let part of parts) {
            answers.push(part.trim());
        }

        if (answers.length === 0) {
            return null;
        }

        return {
            type: 'mot_manquant',
            reponses: answers,
            reponsesCorrectes: answers
        };
    }

    parseMoodleFormat(content) {
        let match = content.match(/^\d+:(SA|MC|MW):(.+)$/);
        if (!match) return null;

        let type = match[1];
        let answersContent = match[2];

        if (type === 'SA' || type === 'MW') {
            return this.parseShortAnswer(answersContent);
        } else if (type === 'MC') {
            return this.parseMultipleChoice(answersContent);
        }

        return null;
    }

    parseMatching(content) {
        let pairs = content.split(/(?==)/);
        pairs = pairs.filter(p => p.trim() !== '');

        let reponses = [];
        let reponsesCorrectes = [];

        for (let pair of pairs) {
            let match = pair.match(/^=?\s*(.+?)\s*->\s*(.+)$/);
            if (match) {
                reponses.push(match[1].trim());
                reponsesCorrectes.push(match[2].trim());
            }
        }

        if (reponses.length === 0) {
            return null;
        }

        return {
            type: 'correspondance',
            reponses: reponses,
            reponsesCorrectes: reponsesCorrectes
        };
    }

    parseLegacyFormat(line) {
        let match = /^Q\d+:([^{]+)\{([^}]+)\}/.exec(line);
        if (!match) return null;

        let enonce = match[1].trim();
        let answersRaw = match[2];

        let parts = answersRaw.split(';').filter(p => p.trim() !== '');

        let reponses = [];
        let reponsesCorrectes = [];
        let valid = true;

        for (let part of parts) {
            part = part.trim();
            if (part.startsWith('=')) {
                let answer = part.substring(1);
                reponses.push(answer);
                reponsesCorrectes.push(answer);
            } else if (part.startsWith('~')) {
                reponses.push(part.substring(1));
            } else {
                valid = false;
                break;
            }
        }

        if (!valid || reponses.length === 0 || reponsesCorrectes.length === 0) {
            return null;
        }

        let type = reponses.length > 2 ? 'choix_multiple' : 'vrai_faux';

        return new Question(enonce, type, "", "", reponses, reponsesCorrectes);
    }
}

export default GiftParser;
