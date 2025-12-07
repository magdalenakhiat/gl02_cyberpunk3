import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerActions(program) {
    const files = fs.readdirSync(__dirname)
        .filter(f => f.endsWith('.action.js'));

    for (const file of files) {
        const module = await import(`./${file}`);
        const ActionClass = module.default;
        ActionClass.register(program);
    }
}
