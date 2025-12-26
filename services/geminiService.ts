
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTaxGuidance = async (prompt: string, history: {role: string, parts: {text: string}[]}[] = [], profile?: any) => {
  try {
    const profileContext = profile ? `
      USER CONTEXT:
      - Residency: ${profile.residencyStatus}
      - Income Streams: ${profile.incomeTypes.join(', ')}
      - Business Sector: ${profile.businessDetails.type}
      - Language Preference: ${profile.preferredLanguage}
    ` : "";

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are TaxGuide NG Assistant, an expert on the Nigeria Tax Act 2025. 
        ${profileContext}

        Mandatory Guidelines:
        1. PROVIDE REAL-WORLD EXAMPLES: Whenever you explain a concept (like SEP, VAT exemptions, or CGT on crypto), always provide a short "Scenario" or "Example" to illustrate it. 
           - Example: Instead of just saying VAT is 7.5%, explain: "If a digital consultant in Lagos bills a client N100,000 for a VATable service, the total invoice should be N107,500."
        2. KNOWLEDGE BASE:
           - PIT Graduated Rates: 800k (0%), 2.2m (15%), 9m (18%), 13m (21%), 25m (23%), and above 50m (25%).
           - VAT: 7.5% rate. Small companies (<N25m turnover) are exempt from CHARGING VAT but must still register.
           - Fossil Fuel Surcharge: 5% on fuel.
           - Digital Assets: 10% CGT on gains.
        3. TONE: Clear, helpful, and professional. 
        4. DISCLAIMER: Always specify that this is guidance and not a substitute for professional legal advice. 
        5. LANGUAGE: If the user's preferred language is Pidgin, respond in clear Nigerian Pidgin English.`,
        temperature: 0.6,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my tax knowledge base. Please try again in a moment.";
  }
};
