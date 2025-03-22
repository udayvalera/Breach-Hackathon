import { faker } from '@faker-js/faker';

// Step 1: Generate Fake Data from Aadhar & PAN
function generateFakeData(aadhar, pan) {
    return {
        name: faker.person.fullName(),
        dob: faker.date.birthdate().toISOString().split('T')[0],
        aadhar: aadhar,
        pan: pan,
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        income: faker.number.int({ min: 300000, max: 2000000 }),
    };
}

// Step 2: Simulate Scores from Different Bureaus
function getCibilScores() {
    return {
        Experian: faker.number.int({ min: 300, max: 900 }),
        Equifax: faker.number.int({ min: 300, max: 900 }),
        TransUnion: faker.number.int({ min: 300, max: 900 }),
        CRIF: faker.number.int({ min: 300, max: 900 })
    };
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
function generateReport(aadhar, pan) {
    const userData = generateFakeData(aadhar, pan);
    const scores = getCibilScores();
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
}

// Example Usage
const report = generateReport("123456789012", "ABCDE1234F");
console.log(JSON.stringify(report, null, 2));
