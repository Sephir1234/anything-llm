import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("=== Démarrage du script ===");

// Fonction pour normaliser le chemin
function normalizePath(inputPath) {
  if (process.platform === 'win32') {
    return path.win32.normalize(inputPath);
  }
  return path.posix.normalize(inputPath);
}

function analyzeJobDescription(jobDescriptionFilePath) {
  const normalizedPath = normalizePath(jobDescriptionFilePath);
  console.log("Chemin du fichier normalisé : ", normalizedPath);
  console.log("Répertoire courant : ", process.cwd());

  const jobDetails = parseJobDescription(normalizedPath);

  if (jobDetails) {
    console.log("Contenu du fichier lu : ", jobDetails);
  } else {
    console.error("Erreur : Le fichier est vide ou non trouvé.");
  }

  const categories = {
    technicalSkills: extractTechnicalSkills(jobDetails),
    softSkills: extractSoftSkills(jobDetails),
    experience: extractExperienceRequirements(jobDetails),
    education: extractEducationRequirements(jobDetails)
  };

  console.log("Catégories extraites : ", categories);

  return categories;
}

function parseJobDescription(filePath) {
  try {
    console.log("Tentative de lecture du fichier : ", filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    console.log("Fichier lu avec succès. Contenu : ", content);
    return content;
  } catch (err) {
    console.error("Erreur lors de la lecture du fichier : ", err);
    return null;
  }
}

// Récupérer l'argument passé depuis la ligne de commande (le chemin du fichier)
const filePath = process.argv[2];

// Appeler analyzeJobDescription avec le chemin du fichier récupéré
if (filePath) {
  console.log("Chemin du fichier reçu:", filePath);
  analyzeJobDescription(filePath);
} else {
  console.error("Aucun fichier de description d'emploi n'a été fourni.");
}

function extractTechnicalSkills(details) {
  const techSkillsMatch = details.match(/Compétences techniques : (.+)/);
  if (techSkillsMatch) {
    return techSkillsMatch[1].split(',').map(skill => skill.trim());
  }
  return [];
}

function extractSoftSkills(details) {
  const softSkillsMatch = details.match(/Soft Skills : (.+)/);
  if (softSkillsMatch) {
    return softSkillsMatch[1].split(',').map(skill => skill.trim());
  }
  return [];
}

function extractExperienceRequirements(details) {
  const experienceMatch = details.match(/Expérience : (.+)/);
  if (experienceMatch) {
    return experienceMatch[1].trim();
  }
  return "";
}

function extractEducationRequirements(details) {
  const educationMatch = details.match(/Éducation : (.+)/);
  if (educationMatch) {
    return educationMatch[1].trim();
  }
  return "";
}

export { analyzeJobDescription };
