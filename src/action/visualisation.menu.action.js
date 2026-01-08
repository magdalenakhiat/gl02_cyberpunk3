import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as vega from 'vega';
import * as vegalite from 'vega-lite';
import { createCanvas } from 'canvas'; 
import MenuAction from './MenuAction.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class VisualisationMenuAction extends MenuAction {
    static id = 7;
    static label = "Exporter Statistiques (CSV + Histogramme PNG)";

    static async execute(rl, question) {
        const profilesDir = path.resolve(__dirname, '../../data/profils');
        const outputDir = path.resolve(__dirname, '../../data/visualisations');

        try {
            const files = fs.readdirSync(profilesDir).filter(f => f.endsWith('.json'));
            if (files.length === 0) return console.log("Aucun profil trouvé.");

            console.log("\n--- Profils disponibles ---");
            files.forEach((f, i) => console.log(`${i + 1}. ${f}`));
            
            const choix = await question('\nQuel profil exporter ? : ');
            const selectedFile = files[parseInt(choix) - 1];
            if (!selectedFile) return;

            const profilData = JSON.parse(fs.readFileSync(path.join(profilesDir, selectedFile), 'utf8'));
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

            // 1. Génération du CSV
            this.genererCSV(profilData, path.join(outputDir, `${selectedFile.replace('.json', '.csv')}`));

            // 2. Génération de l'Image (Correction Canvas)
            await this.genererImagePNG(profilData, path.join(outputDir, `${selectedFile.replace('.json', '.png')}`));

            console.log(`\nFichiers générés avec succès dans : ${outputDir}`);

        } catch (error) {
            console.error("Erreur :", error.message);
        }
    }

    static genererCSV(data, filePath) {
        let csv = "Type,Nombre\n";
        Object.entries(data.repartitionParType).forEach(([type, count]) => {
            csv += `${type},${count}\n`;
        });
        fs.writeFileSync(filePath, csv);
    }

    static async genererImagePNG(data, filePath) {
        const values = Object.entries(data.repartitionParType).map(([type, count]) => ({
            "type": type, 
            "quantite": count
        }));

        const vlSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "title": "Répartition des types de questions",
            "width": 400,
            "height": 300,
            "data": { "values": values },
            "mark": { "type": "bar", "color": "#00f0ff" },
            "encoding": {
                "x": { "field": "type", "type": "nominal", "title": "Types", "axis": {"labelAngle": 0} },
                "y": { "field": "quantite", "type": "quantitative", "title": "Nombre" }
            }
        };

        // Compilation Vega-Lite vers Vega
        const vegaSpec = vegalite.compile(vlSpec).spec;

        // Création de la vue avec le constructeur de canevas
        const view = new vega.View(vega.parse(vegaSpec), {
            renderer: 'none'
        });

        // Utilisation de createCanvas pour générer le buffer
        const canvas = await view.toCanvas();
        const buffer = canvas.toBuffer('image/png');
        
        fs.writeFileSync(filePath, buffer);
        console.log("- Image PNG générée.");
    }
}