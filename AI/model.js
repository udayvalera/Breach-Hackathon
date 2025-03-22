import fs from 'fs';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

fs.readFile('credit_scores.json', 'utf8', async (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        console.log("First Entry:", jsonData[0]);

        // Fetch the unified credit score for the first entry
        const report = await getUnifiedCreditScore(jsonData[0]);
        console.log("Unified Credit Score:", report);
    } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
    }
});

export async function getUnifiedCreditScore(data) {
    const prompt = `Based on the provided data ${JSON.stringify(data)}, give me a unified credit score between 300 and 850.`;
    
    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: "system", content: "You are an analyst at a financial institute." },
                { role: "user", content: prompt }
            ],
            max_tokens: 100
        });

        return response.choices?.[0]?.message?.content || "No response received.";
    } catch (error) {
        console.error("Error fetching credit score:", error.message);
        return "Error fetching credit score.";
    }
}