# GL02 Cyberpunk CLI

Outil en ligne de commande pour la gestion d'examens au format GIFT.

## Auteurs

- GRIDEL Alexis
- DOSNE Gabriel
- BRUN Pauline
- MSALLEM Fatma

Projet repris et maintenu par :
- Magdalena Khiat
- Yves Migue
- Doniphan Lacour

## Installation

### Prerequis

- Node.js >= 14.0.0
- npm

### Etapes

```bash
# Cloner le depot
git clone <url-du-depot>
cd gl02_cyberpunk

# Installer les dependances
npm install
```

## Utilisation

### Lancer le menu interactif

```bash
npm start
```

Le menu principal propose 5 options :

```
========================================
        CYBERPUNK CLI - Menu Principal
========================================
1. Creer un examen GIFT
2. Visualiser une question
3. Generer un profil d'examen
4. Generer ma fiche de contact (vCard)
5. Quitter
========================================
```

### Description des fonctionnalites

#### 1. Creer un examen GIFT

Permet de creer un examen en ajoutant des questions interactivement :
- Saisie de l'enonce, du type et des reponses pour chaque question
- Verification de la conformite (15-20 questions, pas de doublons)
- Export au format GIFT

#### 2. Visualiser une question

Charge un fichier GIFT et affiche une question specifique :
- Affiche le nombre total de questions trouvees
- Demande l'ID de la question a visualiser (1-N)
- Affiche le type, l'enonce, les reponses et les reponses correctes

#### 3. Generer un profil d'examen

Analyse un fichier GIFT et genere des statistiques :
- Nombre total de questions
- Repartition par type de question (pourcentages)
- Categories presentes
- Verification de conformite

#### 4. Generer une vCard

Cree une fiche de contact au format vCard 3.0 (RFC 2426) :
- Champs obligatoires : Nom, Prenom, Email
- Champs optionnels : Telephone, Organisation
- Validation des donnees (format email)
- Export au format .vcf

#### 5. Quitter

Ferme l'application.

## Dependances

### Production

| Package | Version | Description |
|---------|---------|-------------|
| @caporal/core | ^2.0.2 | Framework CLI |

### Developpement

| Package | Version | Description |
|---------|---------|-------------|
| jasmine | ^5.13.0 | Framework de tests |
| jasmine-spec-reporter | ^7.0.0 | Reporter pour Jasmine |
| c8 | ^10.1.3 | Couverture de code |

## Tests

### Lancer les tests

```bash
npm test
```

### Lancer les tests avec couverture

```bash
npm run coverage
```

### Structure des tests

```
test/specs/
├── Examen_spec.js           # Tests classe Examen
├── Question_spec.js         # Tests classe Question
├── User_spec.js             # Tests classe User
├── gift_parser.spec.js      # Tests parser GIFT
├── writeGift_spec.js        # Tests export GIFT
├── vcard_menu_action_spec.js # Tests generation vCard
└── services/
    ├── io_service.spec.js      # Tests service IO
    └── gift_io_service.spec.js # Tests service GIFT IO
```

## Jeux de donnees

Le dossier `data/` contient 47 fichiers GIFT de test couvrant differents types de questions :

| Fichier | Description |
|---------|-------------|
| U3-p30-Reading.gift | Questions de comprehension (6 QCM) |
| U1-p7-Adverbs.gift | Questions sur les adverbes |
| U6-p61-GR-Future_forms.gift | Questions sur les temps du futur |
| EM-U42-Ultimate.gift | Examen complet |
| ... | Et 43 autres fichiers |

### Types de questions supportes

- `choix_multiple` : QCM avec une ou plusieurs reponses correctes
- `vrai_faux` : Questions vrai/faux
- `correspondance` : Questions d'appariement (matching)
- `mot_manquant` : Texte a trous (short answer)

### Exemple d'utilisation

```bash
npm start
# Choisir 2 (Visualiser une question)
# Entrer: data/U3-p30-Reading.gift
# Entrer l'ID: 1
```

## Structure du projet

```
gl02_cyberpunk/
├── src/
│   ├── app.js              # Point d'entree CLI Caporal
│   ├── menu.js             # Menu interactif principal
│   ├── Examen.js           # Classe Examen
│   ├── Question.js         # Classe Question
│   ├── User.js             # Classe User
│   ├── gift_parser.js      # Parser format GIFT
│   ├── writeGift.js        # Export format GIFT
│   ├── action/
│   │   ├── Action.js                 # Classe de base CLI
│   │   ├── MenuAction.js             # Classe de base menu
│   │   ├── index.js                  # Auto-decouverte actions
│   │   ├── file.action.js            # Action CLI fichier
│   │   ├── examen.menu.action.js     # Action menu examen
│   │   ├── visualiser.menu.action.js # Action menu visualiser
│   │   ├── profil.menu.action.js     # Action menu profil
│   │   ├── vcard.menu.action.js      # Action menu vCard
│   │   └── quitter.menu.action.js    # Action menu quitter
│   └── service/
│       ├── io_service.js      # Service IO generique
│       └── gift_io_service.js # Service IO GIFT
├── data/                    # Fichiers GIFT de test
├── test/specs/              # Tests unitaires
├── package.json
└── README.md
```

## Format GIFT

Le format GIFT (General Import Format Technology) est un format texte pour les questions de quiz. Exemple :

```
::Titre de la question::Enonce de la question{
    =Bonne reponse
    ~Mauvaise reponse 1
    ~Mauvaise reponse 2
}
```

## Regles de conformite d'un examen

Un examen est considere conforme si :
- Il contient entre 15 et 20 questions
- Il ne contient pas de questions en doublon (meme enonce + meme type)

## Ecarts au cahier des charges

### Fonctionnalites implementees

- [x] Parsing des fichiers GIFT
- [x] Visualisation des questions
- [x] Creation d'examens
- [x] Verification de conformite
- [x] Generation de profil d'examen
- [x] Generation de vCard

### Limitations connues

1. **Export GIFT** : L'export ne fonctionne que pour les examens valides (15-20 questions sans doublons). Les examens non conformes affichent le contenu mais ne sont pas sauvegardes.

2. **Types de questions** : Le parser supporte les types principaux (QCM, vrai/faux, correspondance, mot manquant). Les questions numeriques et ouvertes sont partiellement supportees.

3. **Format Moodle** : Le format Moodle specifique (`{1:MC:...}`) est supporte mais certaines variantes complexes peuvent ne pas etre parsees.

## Licence

ISC
