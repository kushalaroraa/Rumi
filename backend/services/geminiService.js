/**
 * Gemini API integration for compatibility explanation.
 * Set env: GEMINI_API_KEY
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    } catch (err) {
      console.warn('Gemini init error:', err.message);
      return null;
    }
  }
  return genAI;
}

/**
 * Generate a short compatibility explanation for two users.
 * @param {Object} userA - User profile (name, bio, lifestylePreferences, etc.)
 * @param {Object} userB - User profile
 * @param {{ matchScore: number, reasons: string[] }} matchResult - From matchingService
 * @returns {Promise<string|null>} compatibilityExplanation or null if API fails
 */
export async function getCompatibilityExplanation(userA, userB, matchResult) {
  const client = getClient();
  if (!client) return null;

  const prompt = `You are a flatmate compatibility expert. Explain in 2-3 short sentences why these two people could be good flatmates based on their lifestyle preferences. Be friendly and specific. Do not make up details not given.

User A: ${userA.name || 'Unknown'}, ${userA.bio || 'No bio'}. Preferences: ${JSON.stringify(userA.lifestylePreferences || {})}. Budget: ₹${userA.budgetRange?.min ?? 0}-${userA.budgetRange?.max ?? 0}k.

User B: ${userB.name || 'Unknown'}, ${userB.bio || 'No bio'}. Preferences: ${JSON.stringify(userB.lifestylePreferences || {})}. Budget: ₹${userB.budgetRange?.min ?? 0}-${userB.budgetRange?.max ?? 0}k.

Match score: ${matchResult.matchScore}%. Matching reasons: ${(matchResult.reasons || []).join(', ') || 'None'}.

Return only the explanation text, no labels or quotes.`;

  try {
    const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response?.text?.()?.trim();
    return text || null;
  } catch (err) {
    console.error('Gemini API error:', err.message);
    return null;
  }
}
