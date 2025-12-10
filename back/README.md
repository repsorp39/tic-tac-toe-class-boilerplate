# 🎮 Tic Tac Toe — Backend

Backend minimaliste pour un jeu **Tic Tac Toe**, construit avec **Node.js/Express.js**, et une base de données **PostgreSQL** et l'ORM **Sequelize**.  
Ce projet inclut la configuration ORM, la génération automatique des tables et un système de seeds pour initialiser les données.

---

## 🚀 Prérequis

- **Node.js** (version 20+ recommandée)
- **npm**
- **PostgreSQL** installé en local  
  👉 _Si vous n’avez pas PostgreSQL en local, vous pouvez créer une base gratuitement sur_ **[Neon](https://neon.tech/)**.

---

## 📦 Installation

1. **Cloner le projet**

```bash
git clone https://github.com/repsorp39/tic-tac-toe-class-boilerplate tic-tac-toe
cd ./tic-tac-toe/back
```

2. **Créer le fichier .env**

```bash
cp .env.example .env
```

Puis remplissez vos informations PostgreSQL dans le fichier

Exemple:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tictactoe
DB_USER=postgres
DB_PASS=password
```

3. **Installer les dépendances**

```bash
npm install
```

## 🗄️ Génération des tables

Le serveur utilise Sequelize pour synchroniser automatiquement les modèles.

Lancez l’application

```bash
npm run dev
```

Ce script démarre l’API (port 3500 par défaut) et crée automatiquement les tables à partir des modèles Sequelize.
Si vous avez des erreurs vérifier que la base de donnée existe bien et que les credentials de connexions sont correctes

## 🗄️ Génération des seeds

```bash
npm run seed
```

---

Your API is alive 🎉
