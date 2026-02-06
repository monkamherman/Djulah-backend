#!/usr/bin/env node
// scripts/migrate-simple.js - Migration simple des modèles User, HostUser et ClientUser
import mongoose from "mongoose";
import config from "../config/index.js";
import ClientUser from "../models/ClientUser.js";
import HostUser from "../models/HostUser.js";
import User from "../models/User.js";

// Fonction principale de migration
async function runMigrations() {
  try {
    console.log("🚀 Début de la migration des modèles Djulah...");

    // Connexion à la base de données
    await mongoose.connect(config.db.mongoUri);
    console.log("✅ Connecté à MongoDB");

    // Création des collections et indexes pour les modèles existants
    console.log("📊 Création des collections et indexes...");

    // Migration du modèle User
    console.log("👤 Migration du modèle User...");
    await User.createIndexes();
    console.log("✅ Indexes User créés");

    // Migration du modèle HostUser
    console.log("🏪 Migration du modèle HostUser...");
    await HostUser.createIndexes();
    console.log("✅ Indexes HostUser créés");

    // Migration du modèle ClientUser
    console.log("👥 Migration du modèle ClientUser...");
    await ClientUser.createIndexes();
    console.log("✅ Indexes ClientUser créés");

    // Création d'un super admin par défaut si aucun n'existe
    const existingSuperAdmin = await HostUser.findOne({ role: "super_admin" });
    if (!existingSuperAdmin) {
      console.log("👤 Création du super admin par défaut...");
      const superAdmin = new HostUser({
        firstName: "Super",
        lastName: "Admin",
        email: "admin@djulah.com",
        password: "Admin123!", // À changer immédiatement
        phoneNumber: "+237000000000",
        role: "super_admin",
        permissions: [
          "manage_ingredients",
          "manage_suppliers",
          "manage_stock",
          "view_reports",
          "manage_users",
        ],
        isVerified: true,
        accountStatus: "active",
      });

      await superAdmin.save();
      console.log("✅ Super admin créé: admin@djulah.com / Admin123!");
    } else {
      console.log("✅ Super admin existe déjà");
    }

    console.log("🎉 Migration terminée avec succès!");
    console.log("\n📋 Modèles migrés:");
    console.log("- User (modèle de base)");
    console.log("- HostUser (hérite de User)");
    console.log("- ClientUser (hérite de User)");
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
  }
}

// Fonction pour vérifier l'état des modèles
async function checkModels() {
  try {
    console.log("🔍 Vérification des modèles...");

    await mongoose.connect(config.db.mongoUri);

    // Vérification des collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const userCollections = collections.filter(
      (c) => c.name === "users" || c.name.includes("user"),
    );

    console.log("\n📁 Collections utilisateurs trouvées:");
    userCollections.forEach((collection) => {
      console.log(`- ${collection.name}`);
    });

    // Compter les documents
    if (userCollections.length > 0) {
      for (const collection of userCollections) {
        const count = await mongoose.connection.db
          .collection(collection.name)
          .countDocuments();
        console.log(`  └─ ${count} documents`);
      }
    }

    // Vérification des types d'utilisateurs
    const userCount = await User.countDocuments();
    const hostUserCount = await HostUser.countDocuments();
    const clientUserCount = await ClientUser.countDocuments();

    console.log("\n👥 Comptes par type:");
    console.log(`- Users (base): ${userCount}`);
    console.log(`- HostUsers: ${hostUserCount}`);
    console.log(`- ClientUsers: ${clientUserCount}`);
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Gestion des arguments en ligne de commande
const command = process.argv[2];

switch (command) {
  case "migrate":
    runMigrations();
    break;
  case "check":
    checkModels();
    break;
  default:
    console.log("Usage:");
    console.log(
      "  node scripts/migrate-simple.js migrate  - Exécuter la migration",
    );
    console.log(
      "  node scripts/migrate-simple.js check    - Vérifier les modèles",
    );
    process.exit(1);
}
