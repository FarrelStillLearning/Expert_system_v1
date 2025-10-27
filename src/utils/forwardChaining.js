// Pure forward chaining function that infers damage IDs and maps to details
export function inferDamage(selectedSymptoms, rules, damageTypes, getSolution) {
  const facts = [...selectedSymptoms];
  const conclusions = [];

  let newConclusion = true;
  while (newConclusion) {
    newConclusion = false;
    for (const rule of rules) {
      const allConditionsMet = rule.condition.every((c) => facts.includes(c));
      if (allConditionsMet && !conclusions.includes(rule.conclusion)) {
        conclusions.push(rule.conclusion);
        // add conclusion to facts so chained rules can fire
        facts.push(rule.conclusion);
        newConclusion = true;
      }
    }
  }

  const results = conclusions.map((conclusion) => {
    const damage = damageTypes.find((d) => d.id === conclusion);
    return {
      id: conclusion,
      name: damage ? damage.name : 'Unknown',
      solution: getSolution ? getSolution(conclusion) : undefined
    };
  });

  return results;
}
