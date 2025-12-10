import { GoogleGenAI } from "@google/genai";
import { CalculationResult, UserInputs } from "../types";

// Helper function to safely get the API key
const getApiKey = () => {
  // In a real generic app, we shouldn't rely on process.env.API_KEY if this is client-side only 
  // without a build step injecting it. However, per instructions, we assume process.env.API_KEY is available.
  return process.env.API_KEY || '';
};

export const generateAIAnalysis = async (
  result: CalculationResult, 
  inputs: UserInputs
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      return "Unable to generate analysis: API Key is missing.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Act as a highly experienced Social Security and Financial Planner.
      Analyze the following Social Security calculation results for a user:

      User Profile:
      - Birth Date: ${inputs.birthMonth}/${inputs.birthYear}
      - Planned Start Date: ${inputs.benefitStartMonth}/${inputs.benefitStartYear} (Age: ${result.startAge.toFixed(1)})
      - Full Retirement Age (FRA): ${result.fra}
      
      Financials:
      - Projected Annual Future Earnings: $${inputs.projectedSalary}
      - Calculated AIME (Monthly): $${result.aime}
      - Primary Insurance Amount (PIA @ FRA): $${result.pia}
      - Estimated Monthly Benefit @ Start Date: $${result.benefit}
      
      Top 35 Years of Earnings (Indexed Sum): $${(result.aime * 420).toLocaleString()}
      
      Please provide a concise, strategic analysis covering:
      1. **Benefit Analysis**: Is the user taking benefits early or delaying? What is the % impact relative to their PIA?
      2. **Strategy**: Should they consider waiting longer? (e.g., waiting until 70 boosts benefits by ~8% per year past FRA).
      3. **Earnings Check**: Briefly mention if their projected salary significantly impacts their high-35 average.
      
      Format the response in clean Markdown with headers. Keep it under 250 words. Friendly but professional tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Analysis complete, but no text returned.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "An error occurred while communicating with the AI Advisor. Please try again later.";
  }
};
