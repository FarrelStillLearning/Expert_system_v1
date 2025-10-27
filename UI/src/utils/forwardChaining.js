import { symptoms as defaultSymptoms, rules as defaultRules, damageTypes as defaultDamageTypes, getSolution as defaultGetSolution } from '../data/knowledgeBase';

// Fungsi untuk menghitung CF berdasarkan gejala yang dipilih
function calculateRuleCF(rule, selectedSymptomsWithCF, allSymptoms) {
  // Ambil gejala yang relevan dengan aturan ini
  const conditionList = rule.conditions || rule.condition || [];
  const relevantSymptoms = conditionList.filter(symptomId =>
    selectedSymptomsWithCF.some(s => s.id === symptomId)
  );

  if (relevantSymptoms.length === 0) return 0;

  // Ambil CF dari gejala yang dipilih
  const symptomCFs = relevantSymptoms.map(symptomId => {
    const selectedSymptom = selectedSymptomsWithCF.find(s => s.id === symptomId);
    const allSymptom = (allSymptoms || defaultSymptoms).find(s => s.id === symptomId);
    // Gunakan CF dari gejala yang dipilih, atau default dari data
    return selectedSymptom?.cf || allSymptom?.cf || 0.8;
  });

  // Gunakan rumus kombinasi CF: CF = CF1 + CF2 * (1 - CF1) untuk semua gejala
  let combinedCF = 0;
  for (let cf of symptomCFs) {
    combinedCF = combinedCF + cf * (1 - combinedCF);
  }

  // Gabungkan dengan CF aturan (default 1 jika tidak ada)
  const ruleCF = typeof rule.cf === 'number' ? rule.cf : 1;
  return combinedCF * ruleCF;
}

// Modifikasi fungsi inferDamage
export function inferDamage(selectedSymptomIds, rules = null, damages = null, getSolution = null) {
  // allow dependency injection for tests; fall back to defaults
  const symptoms = defaultSymptoms;
  const rulesToUse = rules || defaultRules;
  const damageTypes = damages || defaultDamageTypes;
  const getSolutionFn = getSolution || defaultGetSolution;

  // Ambil gejala lengkap dengan CF (tangani ID yang tidak ditemukan)
  const selectedSymptomsWithCF = selectedSymptomIds.map(id => {
    const symptom = symptoms.find(s => s.id === id);
    if (!symptom) return { id, cf: 0.8 };
    return { id: symptom.id, cf: symptom.cf || 0.8 };
  });

  // Hitung CF untuk setiap aturan
  const results = [];
  for (let rule of rulesToUse) {
    const ruleCF = calculateRuleCF(rule, selectedSymptomsWithCF, symptoms);
    if (ruleCF > 0.5) { // Ambang batas kepercayaan
      const damage = damageTypes.find(d => d.id === rule.conclusion);
      if (damage) {
        results.push({
          ...damage,
          solution: getSolutionFn(rule.conclusion),
          cf: ruleCF // Tambahkan CF ke hasil
        });
      }
    }
  }

  // Urutkan berdasarkan CF tertinggi
  return results.sort((a, b) => b.cf - a.cf);
}