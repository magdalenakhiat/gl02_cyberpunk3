import * as fs from 'node:fs';

export default function writeGIFT(examen, filePath) {
    if (!examen.estValide()) { // Si l'examen n'est pas valide, on renvoie -1
    return ["", -1];
    }
    
    let nbQ = examen.nbQuestions();
    
    let fileContent = `// Examen n°${examen.id}\n\n`;
    
    for (let i=0;i<nbQ;i++) {
        let question = examen.questions[i];
        let reponses = question.reponses;
        let reponsesCorrectes = question.reponsesCorrectes;
        let reponsesString = "";
        for (let j=0;j<reponses.length;j++) {
            if (reponsesCorrectes.includes(reponses[j])) {
                reponsesString += `=${reponses[j]};`;
            } else {
                reponsesString += `~${reponses[j]};`;
            }
        }
        
        fileContent += `Q${i+1}:${question.enonce}{${reponsesString}}\n`;
    }
    
    if (filePath != "") {
        if (!filePath.endsWith(".gift")) filePath += ".gift";
        try {
          fs.writeFileSync(filePath, fileContent);
          // file written successfully
          return [fileContent, filePath];
        } catch (err) {
          console.error(err);
          return [fileContent, -1];
        }
    }
    return [fileContent, -1];
    
}
