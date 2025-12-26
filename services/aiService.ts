
import { GoogleGenAI } from "@google/genai";
import { ChatMessage, UserProfile } from "../types";

// Always initialize with the provided API key from process.env.API_KEY
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTaxGuidance = async (prompt: string, history: ChatMessage[] = [], profile?: UserProfile | null) => {
  if (!process.env.API_KEY) {
    return "Skujy's connection key is missing. Please ensure the system environment is correctly configured.";
  }

  try {
    const lang = profile?.preferredLanguage || 'english';
    
    const profileContext = profile ? `
      USER CONTEXT:
      - Residency: ${profile.residencyStatus}
      - Income Streams: ${profile.incomeTypes.join(', ')}
      - Business Sector: ${profile.businessDetails.type}
      - Deductions: Pension (${profile.deductions.pensionEnabled}), NHF (${profile.deductions.nhfEnabled}), Life Insurance (N${profile.deductions.lifeInsurance})
    ` : "No profile context provided yet.";

    const languageInstruction = lang === 'pidgin' 
      ? "Respond primarily in Nigerian Pidgin English. Be friendly, relateable, and clear. Use tax terms correctly but explain them simply."
      : "Respond in clear, professional English suitable for Nigerian tax guidance.";

    // Format history for Gemini SDK
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    // Add current prompt
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-preview", // Best for complex tax reasoning
      contents,
      config: {
        systemInstruction: `You are Skujy, a world-class AI Tax Assistant for TaxGuide NG. You are an expert on the Nigeria Tax Act 2025. 
        ${languageInstruction}
        ${profileContext}

        Mandatory Guidelines:
        1. IDENTITY: Your name is Skujy. Always be helpful and mention your intelligence when asked.
        2. EXAMPLES: Always provide real-world scenarios for complex tax concepts.
        3. KNOWLEDGE BASE:
           - PIT Rates: 800k (0%), 2.2m (15%), 9m (18%), 13m (21%), 25m (23%), and above 50m (25%).
           - VAT: 7.5% rate. Small companies (<N50m turnover) are exempt from CIT.
           - Fossil Fuel Surcharge: 5%.
           - Digital Assets: 10% CGT.
        
        Provide accurate advice but always state that this is guidance and not professional legal advice.`,
        temperature: 0.7,
      },
    });

    return response.text || "Skujy couldn't generate a response right now.";
  } catch (error: any) {
    console.error("AI Service Error:", error);
    // Provide a user-friendly error message based on common failure modes
    if (error.message?.includes("401") || error.message?.includes("API_KEY")) {
      return "Skujy is having trouble with authentication. Please check if the API key is correctly set.";
    }
    return `Skujy Error: ${error.message || "I'm having trouble connecting to my tax knowledge base. Please try again."}`;
  }
};
