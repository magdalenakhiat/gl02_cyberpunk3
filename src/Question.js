export default function Question(enonce, type, matiere, auteur, reponses, reponsesCorrectes) {
  this.enonce = enonce;
  this.type = type;
  this.matiere = matiere;
  this.auteur = auteur;
  this.reponses = reponses;
  this.reponsesCorrectes = reponsesCorrectes;
}

Question.prototype.estEgale = function (question) {
  return (this.enonce === question.enonce && this.type === question.type);
};
