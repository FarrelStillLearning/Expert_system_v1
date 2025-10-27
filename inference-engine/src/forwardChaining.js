const fs = require('fs');
const path = require('path');

function calculateRuleCF(rule, selectedSymptomsWithCF, allSymptoms) {
  const relevantSymptoms = rule.conditions.filter(symptomId =>
    selectedSymptomsWithCF.some(s => s.id === symptomId)
  );

  if (relevantSymptoms.length === 0) return 0;

  const symptomCFs = relevantSymptoms.map(symptomId => {
    const selectedSymptom = selectedSymptomsWithCF.find(s => s.id === symptomId);
    const allSymptom = allSymptoms.find(s => s.id === symptomId);
    return (selectedSymptom && selectedSymptom.cf) || (allSymptom && allSymptom.cf) || 0.8;
  });

  let combinedCF = 0;
  for (let cf of symptomCFs) {
    combinedCF = combinedCF + cf * (1 - combinedCF);
  }

  return combinedCF * rule.cf;
}

function inferDamage(selectedSymptomIds, data) {
  const { symptoms = [], rules = [], damages = [] } = data;

  const selectedSymptomsWithCF = selectedSymptomIds.map(id => {
    const s = symptoms.find(x => x.id === id);
    return { id: id, cf: s ? s.cf || 0.8 : 0.8 };
  });

  const results = [];
  for (let rule of rules) {
    const ruleCF = calculateRuleCF(rule, selectedSymptomsWithCF, symptoms);
    if (ruleCF > 0.5) {
      const dmg = damages.find(d => d.id === rule.conclusion);
      results.push({ id: dmg ? dmg.id : rule.conclusion, name: dmg ? dmg.name : rule.conclusion, cf: Number(ruleCF.toFixed(3)) });
    }
  }

  return results.sort((a, b) => b.cf - a.cf);
}

module.exports = { inferDamage };
