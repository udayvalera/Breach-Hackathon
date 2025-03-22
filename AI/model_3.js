import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Step 1: Generate User Data
async function getUserData(aadhar, pan) {
    const prompt = `Generate fake financial data used in CIBIL scoring for ${aadhar} and ${pan} in JSON format only. Don't specify 'json' explicitly and avoid backticks.`;
    
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250
    });

    const data = response.choices[0]?.message?.content;
    if (!data) throw new Error("Invalid response from AI");

    return JSON.parse(data);
}

// Step 2: Generate CIBIL Scores
async function getCibilScores() {
    const prompt = `Generate three realistic CIBIL scores between 300 and 900. Output only JSON in this format:
{
  "Experian": 750,
  "Equifax": 730,
  "TransUnion": 710
}`;
    
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100
    });

    const data = response.choices[0]?.message?.content;
    if (!data) throw new Error("Invalid response from AI");

    return JSON.parse(data);
}

// Step 3: Normalize Scores (Convert to 300-850 Scale)
function normalizeScores(scores) {
    let normalized = {};
    
    Object.keys(scores).forEach(bureau => {
        if (bureau === "Equifax") {
            // Convert Equifax from 300-900 to 300-850
            normalized[bureau] = 300 + (((scores[bureau] - 300) * (850 - 300)) / (900 - 300));
        } else {
            // Keep Experian & TransUnion in 300-850 range
            normalized[bureau] = scores[bureau];
        }
    });

    return normalized;
}

// Step 4: Aggregate Score (Mean of Normalized Scores)
function aggregateScore(normalizedScores) {
    const values = Object.values(normalizedScores);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

// Step 5: Generate Credit Report
async function generateReport(aadhar, pan) {
    try {
        // Fetch user data
        const userData = await getUserData(aadhar, pan);
        if (!userData) throw new Error("Invalid user data response");

        // Fetch CIBIL scores
        const scores = await getCibilScores();
        if (!scores || Object.keys(scores).length === 0) throw new Error("Invalid CIBIL scores response");

        console.log("Raw Scores:", scores);

        // Normalize scores
        const normalizedScores = normalizeScores(scores);
        const finalScore = aggregateScore(normalizedScores);

        console.log("Normalized Scores:", normalizedScores);
        console.log("Final Credit Score:", finalScore);

        // Construct prompt
        const prompt = `User's raw CIBIL scores: ${JSON.stringify(scores)}.\n` +
                       `Normalized scores: ${JSON.stringify(normalizedScores)}.\n` +
                       `Final aggregated credit score: ${finalScore}.\n\n` +
                       `Based on the final score, analyze the user's creditworthiness and recommend whether their loan should be approved or not.`;

        // Call Groq API for analysis
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: "system", content: "You are an analyst at a financial institute." },
                { role: "user", content: prompt }
            ],
            max_tokens: 200
        });

        // Parse AI response
        const report = response.choices[0]?.message?.content;
        if (!report) throw new Error("Invalid AI response");

        return report;
    } catch (error) {
        console.error('Error generating report:', error.message);
        throw new Error('Failed to generate credit report');
    }
}

// Example Usage
(async () => {
    try {
        const report = await generateReport("123456789012", "ABCDE1234F");
        console.log("Credit Report:", report);
    } catch (error) {
        console.error(error.message);
    }
})();