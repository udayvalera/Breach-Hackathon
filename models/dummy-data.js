// Document Processor - Single JS Program
// This script takes Aadhaar and PAN numbers and uses Groq API to generate realistic dummy profile data

// Import required libraries
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Sample Aadhaar and PAN numbers for testing
// In a real application, these would come from user input
const aadhaar = "123456789012";
const pan = "ABCDE1234F";

// Function to process documents and generate profile
async function processDocuments(aadhaar, pan) {
  try {
    // Validate inputs
    if (!aadhaar || !pan) {
      throw new Error('Both Aadhaar and PAN numbers are required');
    }
    
    if (!/^\d{12}$/.test(aadhaar)) {
      throw new Error('Aadhaar number must be exactly 12 digits');
    }
    
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      throw new Error('PAN must be in the format: ABCDE1234F');
    }

    // Mask sensitive information for the prompt
    const maskedAadhaar = 'XXXX-XXXX-' + aadhaar.slice(-4);
    const maskedPan = pan.slice(0, 2) + 'XXX' + pan.slice(5);

    console.log('Processing documents for:');
    console.log('Masked Aadhaar:', maskedAadhaar);
    console.log('Masked PAN:', maskedPan);

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `You are a data generator for testing purposes. Generate realistic but entirely fictional Indian personal data in JSON format based on these guidelines:
          
          1. The data should be for a fictional person with Indian characteristics.
          2. Include name (Indian name), date of birth (YYYY-MM-DD format), Indian address with pincode, Indian phone number (+91 format), email, and annual income in INR.
          3. Include credit score factors with realistic values:
             - Payment history records (timely/late payments)
             - Credit utilization ratio
             - Credit mix details (types of loans)
             - Length of credit history
             - Hard inquiries count
             - Outstanding debt details
             - Recent credit behavior
             - Any negative remarks
          
          Return ONLY valid JSON with no additional text or explanations.`
        },
        {
          role: "user",
          content: `Generate realistic fictional Indian personal data and credit score information for a person with masked Aadhaar number ${maskedAadhaar} and masked PAN ${maskedPan}. The person should be between 25-60 years old with a medium to high income profile.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Log the raw response
    console.log('\n--- Raw Response ---');
    console.log(completion.choices[0].message.content);
    
    // Extract and parse the JSON response
    const jsonResponse = JSON.parse(completion.choices[0].message.content);
    
    // Log the parsed JSON
    console.log('\n--- Parsed JSON ---');
    console.log(JSON.stringify(jsonResponse, null, 2));
    
    // Optionally save the output to a file
    fs.writeFileSync('profile_output.json', JSON.stringify(jsonResponse, null, 2));
    console.log('\nOutput saved to profile_output.json');
    
    return jsonResponse;
  } catch (error) {
    console.error('Error processing information:', error);
    throw error;
  }
}

// Execute the function
processDocuments(aadhaar, pan)
  .then(() => console.log('Process completed successfully'))
  .catch(err => console.error('Process failed:', err));