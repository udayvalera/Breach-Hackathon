import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getUserData(aadhar,pan) {
    const prompt = `Generate an fake financial data used in CBIL scoring for ${aadhar} and ${pan} in JSON format only.don't specify json and avoid backticks in the beginning and at the end `
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250
    })
    return JSON.parse(response.choices[0]?.message?.content || "")
}

async function getCibilScores() {
    const prompt = `Generate three realistic CIBIL scores between 300 and 900. Output only JSON in this format and avoid backticks in the beginning and at the end:
{
  "Experian": 750,
  "Equifax": 730,
  "TransUnion": 710,
  "CRIF": 690
}`;
    
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100
    });

    return JSON.parse(response.choices[0]?.message?.content || "")
}

// Step 3: Normalize Scores (Convert to 0-100 Scale)
function normalizeScores(scores) {
    const minNormalized = 300, maxNormalized = 900;
    let normalized = {};

    Object.keys(scores).forEach(bureau => {
        normalized[bureau] = minNormalized + ((scores[bureau] / 100) * (maxNormalized - minNormalized));
    });

    return normalized;
}
// Step 4: Standardize (Z-Score Normalization)
// function standardizeScores(normalizedScores) {
//     const values = Object.values(normalizedScores);
//     const mean = values.reduce((a, b) => a + b, 0) / values.length;
//     const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
//     let standardized = {};
//     Object.keys(normalizedScores).forEach(bureau => {
//         standardized[bureau] = (normalizedScores[bureau] - mean) / stdDev;
//     });
//     return standardized;
// }

// Step 5: Aggregate (Mean of Standardized Scores)
function aggregateScore(Normalized) {
    const values = Object.values(Normalized);
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100);
}

// Step 6: Generate Report
async function generateReport(aadhar, pan) {
    try {
        // Fetch user data
        const userData = await getUserData(aadhar, pan);
        if (!userData) throw new Error("Invalid user data response");

        // Fetch CIBIL scores
        const scores = await getCibilScores();
        if (!scores || Object.keys(scores).length === 0) throw new Error("Invalid CIBIL scores response");

        console.log(scores)

        // Normalize scores
        const normalizedScores = normalizeScores(scores);
        const finalScore = aggregateScore(normalizedScores);

        console.log(finalScore)

        // Construct prompt
        const prompt = `User's raw CIBIL scores: ${JSON.stringify(scores)}.\n` +
                       `Normalized scores: ${JSON.stringify(normalizedScores)}.\n` +
                       `Final aggregated credit score: ${finalScore}.\n\n` +
                       `Based on the final score, analyze the user's creditworthiness and recommend whether their loan should be approved or not.`;

        // Call Groq API (Ensure correct async handling)
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: "system", content: "You are an analyst at a financial institute." },
                       { role: "user", content: prompt }],
            max_tokens: 200 // Increased token limit for better responses
        });

        // Parse response
        const report = response.choices[0]?.message?.content;
        if (!report) throw new Error("Invalid AI response");

        return JSON.parse(report);
    } catch (error) {
        console.error('Error generating report:', error.message);
        throw new Error('Failed to generate credit report');
    }
}
// Example Usage
(async () => {
    // const report = await getUserData("123456789012", "ABCDE1234F");
    // console.log(report);
    // const scores = await getCibilScores();
    // console.log(scores)
    // const Normalized = normalizeScores(scores);
    // console.log(Normalized)
    const report = await generateReport("123456789012", "ABCDE1234F");
    console.log(report)
})();