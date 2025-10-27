const fs = require('fs');
const path = require('path');
const { inferDamage } = require('./forwardChaining');

function printUsage() {
  console.log('Usage: node src/engine.js <SYMPTOM_ID> [<SYMPTOM_ID> ...]');
  console.log('Example: node src/engine.js GG01 GG02 GG03');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const repoRoot = path.resolve(__dirname, '..', '..');
  const rulesPath = path.join(repoRoot, 'rules.json');

  if (!fs.existsSync(rulesPath)) {
    console.error('rules.json not found at', rulesPath);
    process.exit(2);
  }

  let raw = fs.readFileSync(rulesPath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse rules.json:', err.message);
    process.exit(3);
  }

  const symptoms = args;
  const results = inferDamage(symptoms, data);

  console.log(JSON.stringify({ queriedSymptoms: symptoms, results }, null, 2));
}

main();
