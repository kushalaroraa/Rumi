/**
 * Compatibility matching algorithm for Rumi flatmate matching.
 * Calculates match percentage and reasons based on lifestyle preferences.
 */

const WEIGHTS = {
  budget: 25,
  foodPreference: 15,
  sleepSchedule: 15,
  smoking: 15,
  cleanlinessLevel: 12,
  guestPolicy: 10,
  drinking: 5,
  pets: 3,
};

/**
 * Normalize budget overlap: score 0–100 based on how much ranges overlap.
 */
function budgetScore(a, b) {
  const aMin = a?.min ?? 0;
  const aMax = a?.max ?? 0;
  const bMin = b?.min ?? 0;
  const bMax = b?.max ?? 0;
  if (aMax < bMin || bMax < aMin) return { score: 0, reason: null };
  const overlapMin = Math.max(aMin, bMin);
  const overlapMax = Math.min(aMax, bMax);
  const overlap = Math.max(0, overlapMax - overlapMin);
  const totalSpan = Math.max(aMax - aMin, bMax - bMin, 1);
  const score = Math.round((overlap / totalSpan) * 100);
  return { score, reason: score >= 50 ? 'same or similar budget range' : null };
}

/**
 * Exact match for categorical fields.
 */
function categoricalScore(a, b, reasonSame) {
  const va = (a || '').toString().toLowerCase();
  const vb = (b || '').toString().toLowerCase();
  if (!va || !vb) return { score: 50, reason: null };
  const match = va === vb;
  return {
    score: match ? 100 : 0,
    reason: match ? reasonSame : null,
  };
}

/**
 * Calculate overall match score and list of reasons between two users.
 * @param {Object} userA - User document (with lifestylePreferences, budgetRange)
 * @param {Object} userB - User document
 * @returns {{ matchScore: number, reasons: string[] }}
 */
export function calculateMatch(userA, userB) {
  const reasons = [];
  let totalWeight = 0;
  let weightedSum = 0;

  const prefsA = userA.lifestylePreferences || {};
  const prefsB = userB.lifestylePreferences || {};
  const budgetA = userA.budgetRange || {};
  const budgetB = userB.budgetRange || {};

  // Budget
  const b = budgetScore(budgetA, budgetB);
  weightedSum += (b.score / 100) * WEIGHTS.budget;
  totalWeight += WEIGHTS.budget;
  if (b.reason) reasons.push(b.reason);

  // Food preference
  const food = categoricalScore(prefsA.foodPreference, prefsB.foodPreference, 'same food preference');
  weightedSum += (food.score / 100) * WEIGHTS.foodPreference;
  totalWeight += WEIGHTS.foodPreference;
  if (food.reason) reasons.push(food.reason);

  // Sleep schedule
  const sleep = categoricalScore(prefsA.sleepSchedule, prefsB.sleepSchedule, 'similar sleep schedule');
  weightedSum += (sleep.score / 100) * WEIGHTS.sleepSchedule;
  totalWeight += WEIGHTS.sleepSchedule;
  if (sleep.reason) reasons.push(sleep.reason);

  // Smoking
  const smoking = categoricalScore(prefsA.smoking, prefsB.smoking, 'both non-smokers');
  weightedSum += (smoking.score / 100) * WEIGHTS.smoking;
  totalWeight += WEIGHTS.smoking;
  if (smoking.reason) reasons.push(smoking.reason);

  // Cleanliness
  const clean = categoricalScore(prefsA.cleanlinessLevel, prefsB.cleanlinessLevel, 'similar cleanliness level');
  weightedSum += (clean.score / 100) * WEIGHTS.cleanlinessLevel;
  totalWeight += WEIGHTS.cleanlinessLevel;
  if (clean.reason) reasons.push(clean.reason);

  // Guest policy
  const guest = categoricalScore(prefsA.guestPolicy, prefsB.guestPolicy, 'compatible guest policy');
  weightedSum += (guest.score / 100) * WEIGHTS.guestPolicy;
  totalWeight += WEIGHTS.guestPolicy;
  if (guest.reason) reasons.push(guest.reason);

  // Drinking
  const drink = categoricalScore(prefsA.drinking, prefsB.drinking, 'compatible drinking preference');
  weightedSum += (drink.score / 100) * WEIGHTS.drinking;
  totalWeight += WEIGHTS.drinking;
  if (drink.reason) reasons.push(drink.reason);

  // Pets
  const pets = categoricalScore(prefsA.pets, prefsB.pets, 'compatible pet preference');
  weightedSum += (pets.score / 100) * WEIGHTS.pets;
  totalWeight += WEIGHTS.pets;
  if (pets.reason) reasons.push(pets.reason);

  const matchScore = totalWeight > 0 ? Math.round((weightedSum / totalWeight)) : 0;
  return {
    matchScore: Math.min(100, matchScore),
    reasons,
  };
}
