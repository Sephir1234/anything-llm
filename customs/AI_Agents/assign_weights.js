function assignWeights(categories) {
  let weights = {};

  weights.technicalSkills = calculateWeight(categories.technicalSkills, "high");
  weights.softSkills = calculateWeight(categories.softSkills, "medium");
  weights.experience = calculateWeight(categories.experience, "high");
  weights.education = calculateWeight(categories.education, "low");

  return weights;
}

function calculateWeight(criteria, priority) {
  let weight = 0;
  if (priority === "high") {
    weight = 0.4;
  } else if (priority === "medium") {
    weight = 0.3;
  } else if (priority === "low") {
    weight = 0.2;
  }

  // Ajustement basé sur la longueur des critères
  return weight * criteria.length;
}
