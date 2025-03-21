// cibil-score-calculator.js

import fs from 'fs';

// Read the profile data
const profileData = JSON.parse(fs.readFileSync('profile_output.json', 'utf8'));

// CIBIL score calculation function
function calculateCibilScore(profile) {
  // Extract relevant data
  const creditHistory = profile.credit_score;
  
  // Payment History (35-40%)
  // Perfect payment history would be 100, each late payment reduces it
  const totalPayments = creditHistory.payment_history.timely_payments + creditHistory.payment_history.late_payments;
  const paymentHistoryScore = (creditHistory.payment_history.timely_payments / totalPayments) * 100;
  const paymentHistoryWeight = 0.35; // Using lower bound of 35%
  
  // Credit Utilization (25-30%)
  // Lower is better, under 30% is ideal
  const utilizationRatio = creditHistory.credit_utilization_ratio;
  const utilizationScore = Math.max(0, 100 - (utilizationRatio * 100));
  const utilizationWeight = 0.30; // Using upper bound of 30%
  
  // Credit Mix (10-15%)
  // More diverse credit types are better
  const creditMixCount = Object.keys(creditHistory.credit_mix).length;
  const creditMixScore = Math.min(100, creditMixCount * 33.33); // 3 types would be perfect
  const creditMixWeight = 0.15; // Using upper bound of 15%
  
  // Length of Credit History (15-20%)
  // Longer history is better, max benefit at around 7-10 years
  const historyLength = creditHistory.length_of_credit_history;
  const historyScore = Math.min(100, (historyLength / 7) * 100);
  const historyWeight = 0.15; // Using lower bound of 15%
  
  // Hard Inquiries (10%)
  // Fewer is better, 0-1 is ideal
  const inquiriesCount = creditHistory.hard_inquiries_count;
  const inquiriesScore = Math.max(0, 100 - (inquiriesCount * 20)); // Each inquiry reduces score by 20 points
  const inquiriesWeight = 0.05; // 5% for hard inquiries
  
  // Other Factors (5-10%)
  // Recent behavior, negative remarks, etc.
  const otherFactorsScore = creditHistory.recent_credit_behavior === "Good" && 
                           creditHistory.negative_remarks === "None" ? 100 : 70;
  const otherFactorsWeight = 0.05; // Using the lower bound of 5%
  
  // Calculate weighted score components
  const weightedPaymentHistory = paymentHistoryScore * paymentHistoryWeight;
  const weightedUtilization = utilizationScore * utilizationWeight;
  const weightedCreditMix = creditMixScore * creditMixWeight;
  const weightedHistoryLength = historyScore * historyWeight;
  const weightedInquiries = inquiriesScore * inquiriesWeight;
  const weightedOtherFactors = otherFactorsScore * otherFactorsWeight;
  
  // Calculate total CIBIL score (scaled to 300-900 range)
  const totalWeightedScore = weightedPaymentHistory + weightedUtilization + 
                            weightedCreditMix + weightedHistoryLength + 
                            weightedInquiries + weightedOtherFactors;
  
  // CIBIL scores range from 300 to 900
  const cibilScore = Math.round(300 + (totalWeightedScore * 6));
  
  return {
    score: cibilScore,
    components: {
      paymentHistory: Math.round(weightedPaymentHistory),
      utilization: Math.round(weightedUtilization),
      creditMix: Math.round(weightedCreditMix),
      historyLength: Math.round(weightedHistoryLength),
      inquiries: Math.round(weightedInquiries),
      otherFactors: Math.round(weightedOtherFactors)
    }
  };
}

// Calculate and display the CIBIL score
const cibilResult = calculateCibilScore(profileData);
console.log("CIBIL Score Calculation:");
console.log("Total CIBIL Score:", cibilResult.score);
console.log("Score Components:", cibilResult.components);