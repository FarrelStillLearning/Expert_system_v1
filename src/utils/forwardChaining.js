import { symptoms, rules, damageTypes, getSolution } from '../data/knowledgeBase';

// Fungsi untuk menghitung CF berdasarkan gejala yang dipilih
function calculateRuleCF(rule, selectedSymptomsWithCF) {
  // Ambil gejala yang relevan dengan aturan ini
  const relevantSymptoms = rule.conditions.filter(symptomId => 
    selectedSymptomsWithCF.some(s => s.id === symptomId)
  );

  if (relevantSymptoms.length === 0) return 0;

  // Ambil CF dari gejala yang dipilih
  const symptomCFs = relevantSymptoms.map(symptomId => {
    const selectedSymptom = selectedSymptomsWithCF.find(s => s.id === symptomId);
    const allSymptom = symptoms.find(s => s.id === symptomId);
    // Gunakan CF dari gejala yang dipilih, atau default dari data
    return selectedSymptom?.cf || allSymptom?.cf || 0.8;
  });

  // Gunakan rumus kombinasi CF: CF = CF1 + CF2 * (1 - CF1) untuk semua gejala
  let combinedCF = 0;
  for (let cf of symptomCFs) {
    combinedCF = combinedCF + cf * (1 - combinedCF);
  }

  // Gabungkan dengan CF aturan
  return combinedCF * rule.cf;
}

// Modifikasi fungsi inferDamage
export function inferDamage(selectedSymptomIds) {
  // Ambil gejala lengkap dengan CF
  const selectedSymptomsWithCF = selectedSymptomIds.map(id => {
    const symptom = symptoms.find(s => s.id === id);
    return { id: symptom.id, cf: symptom.cf || 0.8 };
  });

  // Hitung CF untuk setiap aturan
  const results = [];
  for (let rule of rules) {
    const ruleCF = calculateRuleCF(rule, selectedSymptomsWithCF);
    if (ruleCF > 0.5) { // Ambang batas kepercayaan
      const damage = damageTypes.find(d => d.id === rule.conclusion);
      if (damage) {
        results.push({
          ...damage,
          solution: getSolution(rule.conclusion),
          cf: ruleCF // Tambahkan CF ke hasil
        });
      }
    }
  }

  // Urutkan berdasarkan CF tertinggi
  return results.sort((a, b) => b.cf - a.cf);
}