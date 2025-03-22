import fs from 'fs/promises';

async function getRandomData() {
    try {
        const data = await fs.readFile('credit_scores.json', 'utf8');
        const jsonData = JSON.parse(data);
        
        const randomIndex = Math.floor(Math.random() * jsonData.length);
        console.log("Random Index:", randomIndex);
        
        return jsonData[randomIndex];
    } catch (error) {
        console.error("Error:", error);
        return null; // Return null if an error occurs
    }
}

// Call the function and handle the result
(async () => {
    const data = await getRandomData();
    console.log("Random Data:", data);
})();