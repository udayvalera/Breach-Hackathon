import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Step 1: Fetch Fake Financial Data
async function getUserData(aadhar, pan) {
    const prompt = `Generate a fake financial data used in CIBIL scoring for ${aadhar} and ${pan} in JSON format only. Do not include any additional text.`;
    
    const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250
    });

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch (error) {
        console.error("Error parsing user data JSON:", error);
        return null;
    }
}

// Step 2: Fetch CIBIL Scores
async function getCibilScores() {
    const prompt = `Generate realistic CIBIL scores between 300 and 900. Output only JSON like this and no backticks:
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

    try {
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch (error) {
        console.error("Error parsing CIBIL scores JSON:", error);
        return null;
    }
}

// Step 3: Normalize Scores (Convert to 0-100 Scale)
function normalizeScores(scores) {
    const minCibil = 300, maxCibil = 900;
    let normalized = {};

    Object.keys(scores).forEach(bureau => {
        normalized[bureau] = ((scores[bureau] - minCibil) / (maxCibil - minCibil)) * 100;
    });

    return normalized;
}

// Step 4: Aggregate Score (Mean of Normalized Scores)
function aggregateScore(normalizedScores) {
    const values = Object.values(normalizedScores);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

// Step 5: Generate Report
async function generateReport(aadhar, pan) {
    try {
        // Fetch user data
        const userData = await getUserData(aadhar, pan);
        if (!userData) throw new Error("Invalid user data response");

        // Fetch CIBIL scores
        const scores = await getCibilScores();
        if (!scores || Object.keys(scores).length === 0) throw new Error("Invalid CIBIL scores response");

        // Normalize scores
        const normalizedScores = normalizeScores(scores);
        const finalScore = aggregateScore(normalizedScores);

        // Create report
        const report = {
            userData,
            rawCIBILScores: scores,
            normalizedScores,
            finalAggregatedScore: finalScore
        };

        console.log("Generated Credit Report:", report);

        // Step 6: Determine Creditworthiness
        const creditPrompt = `Based on the following details, analyze the user's creditworthiness and decide whether a loan should be approved:
        User Data: ${JSON.stringify(userData)}
        Raw CIBIL Scores: ${JSON.stringify(scores)}
        Normalized Scores: ${JSON.stringify(normalizedScores)}
        Final Aggregated Credit Score: ${finalScore}
        
        Output only JSON in this format:
        {
          "creditWorthiness": "Approved" or "Rejected",
          "reason": "Brief reason why loan is approved or rejected"
        }`;

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: "system", content: "You are a credit analyst at a financial institution." },
                       { role: "user", content: creditPrompt }],
            max_tokens: 200
        });

        const creditDecision = JSON.parse(response.choices[0]?.message?.content || "{}");

        return { report, creditDecision };

    } catch (error) {
        console.error("Error generating report:", error.message);
        throw new Error("Failed to generate credit report");
    }
}

// Example Usage
(async () => {
    const result = await generateReport("123456789012", "ABCDE1234F");
    console.log(result);
})();