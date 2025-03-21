import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Function to extract valid JSON from the LLM response
function extractJSON(text) {
    try {
        // Find the first and last curly brackets
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");

        // Parse the JSON
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
}

// Step 1: Generate Fake Data from Aadhar & PAN using LLM
async function generateFakeData(aadhar, pan) {
    const prompt = `Generate realistic but fake financial data for a user with Aadhar: ${aadhar} and PAN: ${pan}. Respond with JSON **only** and nothing else:
\`\`\`json
{
  "name": "John Doe",
  "dob": "1990-01-01",
  "address": "123 Main Street, City, Country",
  "phone": "+91XXXXXXXXXX",
  "email": "john.doe@example.com",
  "income": 75000
}
\`\`\`
`;
    
const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 250
});

const content = response.choices[0]?.message?.content || "";
const jsonData = extractJSON(content);

if (!jsonData) {
    throw new Error(`Invalid JSON received from LLM: ${content}`);
}

return jsonData;
}

// Step 2: Get CIBIL Scores from LLM
async function getCibilScores() {
    const prompt = `Generate four realistic CIBIL scores between 300 and 900. Output only JSON in this format:
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

    return extractJSON(response.choices[0].message.content);
}

// Step 3: Normalize Scores (Convert to 0-1 Scale)
function normalizeScores(scores) {
    const minScore = 300, maxScore = 900;
    let normalized = {};
    Object.keys(scores).forEach(bureau => {
        normalized[bureau] = (scores[bureau] - minScore) / (maxScore - minScore);
    });
    return normalized;
}

// Step 4: Standardize (Z-Score Normalization)
function standardizeScores(normalizedScores) {
    const values = Object.values(normalizedScores);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
    
    let standardized = {};
    Object.keys(normalizedScores).forEach(bureau => {
        standardized[bureau] = (normalizedScores[bureau] - mean) / stdDev;
    });
    return standardized;
}

// Step 5: Aggregate (Mean of Standardized Scores)
function aggregateScore(standardizedScores) {
    const values = Object.values(standardizedScores);
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) + 700;
}

// Step 6: Generate Report
async function generateReport(aadhar, pan) {
    try {
        const userData = await generateFakeData(aadhar, pan);
        if (!userData) throw new Error("Invalid user data response");

        const scores = await getCibilScores();
        if (!scores) throw new Error("Invalid CIBIL scores response");

        const normalizedScores = normalizeScores(scores);
        const standardizedScores = standardizeScores(normalizedScores);
        const finalScore = aggregateScore(standardizedScores);

        return {
            userData,
            bureauScores: scores,
            normalizedScores,
            standardizedScores,
            finalCIBIL: finalScore
        };
    } catch (error) {
        console.error('Error generating report:', error);
        throw new Error('Failed to generate credit report');
    }
}

// Example Usage
(async () => {
    const report = await generateReport("123456789012", "ABCDE1234F");
    console.log(JSON.stringify(report, null, 2));
})();