// experian-score-calculator.js


import fs from 'fs';

// Read the profile data
const profileData = JSON.parse(fs.readFileSync('profile_output.json', 'utf8'));

// Experian score calculation function
function calculateExperianScore(profile) {
  // Extract relevant data
  const creditHistory = profile.credit_score;
  
  // Payment History (35%)
  const totalPayments = creditHistory.payment_history.timely_payments + creditHistory.payment_history.late_payments;
  const paymentHistoryScore = (creditHistory.payment_history.timely_payments / totalPayments) * 100;
  const paymentHistoryWeight = 0.35;
  
  // Credit Utilization (30%)
  const utilizationRatio = creditHistory.credit_utilization_ratio;
  // Experian considers utilization below 10% as excellent, 10-30% as good
  let utilizationScore;
  if (utilizationRatio <= 0.1) {
    utilizationScore = 100;
  } else if (utilizationRatio <= 0.3) {
    utilizationScore = 90;
  } else if (utilizationRatio <= 0.5) {
    utilizationScore = 70;
  } else if (utilizationRatio <= 0.7) {
    utilizationScore = 50;
  } else {
    utilizationScore = 30;
  }
  const utilizationWeight = 0.30;
  
  // Credit Mix (10%)
  const totalDebt = Object.values(creditHistory.credit_mix).reduce((sum, current) => sum + current, 0);
  const creditMixCount = Object.keys(creditHistory.credit_mix).length;
  // Balance between different types of credit
  const creditMixScore = Math.min(100, creditMixCount * 33.33);
  const creditMixWeight = 0.10;
  
  // Length of Credit History (15%)
  const historyLength = creditHistory.length_of_credit_history;
  // Experian values longer credit histories
  const historyScore = Math.min(100, (historyLength / 8) * 100); // 8+ years is ideal
  const historyWeight = 0.15;
  
  // Hard Inquiries (10%)
  const inquiriesCount = creditHistory.hard_inquiries_count;
  // Experian is slightly more forgiving on inquiries
  const inquiriesScore = Math.max(0, 100 - (inquiriesCount * 15)); // Each inquiry reduces score by 15 points
  const inquiriesWeight = 0.05;
  
  // Other Factors (5-10%)
  // Experian considers current debt load and income ratio
  const debtToIncomeRatio = creditHistory.outstanding_debt / profile.personal_data.annual_income;
  let otherFactorsScore;
  if (debtToIncomeRatio <= 0.2) {
    otherFactorsScore = 100; // Excellent
  } else if (debtToIncomeRatio <= 0.36) {
    otherFactorsScore = 90; // Good
  } else if (debtToIncomeRatio <= 0.42) {
    otherFactorsScore = 75; // Fair
  } else if (debtToIncomeRatio <= 0.5) {
    otherFactorsScore = 60; // Poor
  } else {
    otherFactorsScore = 40; // Very poor
  }
  
  // Add points for good recent behavior and no negative remarks
  if (creditHistory.recent_credit_behavior === "Good") {
    otherFactorsScore = Math.min(100, otherFactorsScore + 10);
  }
  if (creditHistory.negative_remarks === "None") {
    otherFactorsScore = Math.min(100, otherFactorsScore + 10);
  }
  
  const otherFactorsWeight = 0.05;
  
  // Calculate weighted score components
  const weightedPaymentHistory = paymentHistoryScore * paymentHistoryWeight;
  const weightedUtilization = utilizationScore * utilizationWeight;
  const weightedCreditMix = creditMixScore * creditMixWeight;
  const weightedHistoryLength = historyScore * historyWeight;
  const weightedInquiries = inquiriesScore * inquiriesWeight;
  const weightedOtherFactors = otherFactorsScore * otherFactorsWeight;
  
  // Calculate total Experian score (scaled to 300-850 range)
  const totalWeightedScore = weightedPaymentHistory + weightedUtilization + 
                            weightedCreditMix + weightedHistoryLength + 
                            weightedInquiries + weightedOtherFactors;
  
  // Experian scores range from 300 to 850
  const experianScore = Math.round(300 + (totalWeightedScore * 5.5));
  
  return {
    score: experianScore,
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

// Calculate and display the Experian score
const experianResult = calculateExperianScore(profileData);
console.log("Experian Score Calculation:");
console.log("Total Experian Score:", experianResult.score);
console.log("Score Components:", experianResult.components);