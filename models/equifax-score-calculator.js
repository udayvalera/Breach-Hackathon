// equifax-score-calculator.js

import fs from 'fs';

// Read the profile data
const profileData = JSON.parse(fs.readFileSync('profile_output.json', 'utf8'));

// Equifax score calculation function
function calculateEquifaxScore(profile) {
  // Extract relevant data
  const creditHistory = profile.credit_score;
  
  // Payment History (35%)
  const totalPayments = creditHistory.payment_history.timely_payments + creditHistory.payment_history.late_payments;
  const paymentHistoryScore = (creditHistory.payment_history.timely_payments / totalPayments) * 100;
  // Equifax penalizes late payments more heavily
  const adjustedPaymentHistoryScore = paymentHistoryScore - (creditHistory.payment_history.late_payments * 5);
  const paymentHistoryWeight = 0.35;
  
  // Credit Utilization (30%)
  const utilizationRatio = creditHistory.credit_utilization_ratio;
  // Equifax has slightly different utilization scoring brackets
  let utilizationScore;
  if (utilizationRatio <= 0.1) {
    utilizationScore = 100;
  } else if (utilizationRatio <= 0.25) {
    utilizationScore = 90;
  } else if (utilizationRatio <= 0.4) {
    utilizationScore = 75;
  } else if (utilizationRatio <= 0.6) {
    utilizationScore = 55;
  } else {
    utilizationScore = 35;
  }
  const utilizationWeight = 0.30;
  
  // Credit Mix (10%)
  // Equifax considers both diversity and balanced distribution
  const creditMixCount = Object.keys(creditHistory.credit_mix).length;
  const creditMixTotal = Object.values(creditHistory.credit_mix).reduce((sum, val) => sum + val, 0);
  
  // Calculate variation between loan types (lower is better - more balanced)
  let variation = 0;
  if (creditMixCount > 1) {
    const avgLoan = creditMixTotal / creditMixCount;
    variation = Object.values(creditHistory.credit_mix).reduce((sum, val) => {
      return sum + Math.abs(val - avgLoan) / avgLoan;
    }, 0) / creditMixCount;
  }
  
  // Score based on count and variation
  let creditMixScore = Math.min(100, creditMixCount * 33);
  // Penalize for highly unbalanced distribution
  if (variation > 1) {
    creditMixScore -= Math.min(30, variation * 10);
  }
  
  const creditMixWeight = 0.10;
  
  // Length of Credit History (15%)
  const historyLength = creditHistory.length_of_credit_history;
  // Equifax values credit history length similarly to others
  const historyScore = Math.min(100, (historyLength / 7) * 100);
  const historyWeight = 0.15;
  
  // Hard Inquiries (10%)
  const inquiriesCount = creditHistory.hard_inquiries_count;
  // Equifax scoring for inquiries
  const inquiriesScore = Math.max(0, 100 - (inquiriesCount * 17)); // Each inquiry reduces score by 17 points
  const inquiriesWeight = 0.05;
  
  // Other Factors (5-10%)
  // Equifax considers debt to income ratio, recent behavior, and negative remarks
  const outstandingDebtRatio = creditHistory.outstanding_debt / profile.personal_data.annual_income;
  let otherFactorsScore = 70; // Base score
  
  // Adjust for debt to income ratio
  if (outstandingDebtRatio <= 0.2) {
    otherFactorsScore += 20;
  } else if (outstandingDebtRatio <= 0.36) {
    otherFactorsScore += 15;
  } else if (outstandingDebtRatio <= 0.43) {
    otherFactorsScore += 5;
  } else {
    otherFactorsScore -= 10;
  }
  
  // Adjust for recent behavior and remarks
  if (creditHistory.recent_credit_behavior === "Good") {
    otherFactorsScore += 10;
  }
  if (creditHistory.negative_remarks === "None") {
    otherFactorsScore += 10;
  }
  
  // Cap at 100
  otherFactorsScore = Math.min(100, otherFactorsScore);
  const otherFactorsWeight = 0.05;
  
  // Calculate weighted score components
  const weightedPaymentHistory = adjustedPaymentHistoryScore * paymentHistoryWeight;
  const weightedUtilization = utilizationScore * utilizationWeight;
  const weightedCreditMix = creditMixScore * creditMixWeight;
  const weightedHistoryLength = historyScore * historyWeight;
  const weightedInquiries = inquiriesScore * inquiriesWeight;
  const weightedOtherFactors = otherFactorsScore * otherFactorsWeight;
  
  // Calculate total Equifax score (scaled to 280-850 range)
  const totalWeightedScore = weightedPaymentHistory + weightedUtilization + 
                            weightedCreditMix + weightedHistoryLength + 
                            weightedInquiries + weightedOtherFactors;
  
  // Equifax scores range from 280 to 850
  const equifaxScore = Math.round(280 + (totalWeightedScore * 5.7));
  
  return {
    score: equifaxScore,
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

// Calculate and display the Equifax score
const equifaxResult = calculateEquifaxScore(profileData);
console.log("Equifax Score Calculation:");
console.log("Total Equifax Score:", equifaxResult.score);
console.log("Score Components:", equifaxResult.components);