import fs from 'fs';
import { execSync } from 'child_process';

// Read the profile data
const profileData = JSON.parse(fs.readFileSync('profile_output.json', 'utf8'));

// Function to run each calculator script and capture the output
function runCreditCalculators() {
  try {
    console.log("Running CIBIL calculator...");
    const cibilOutput = execSync('node cibil-score-calculator.js').toString();
    
    console.log("Running Experian calculator...");
    const experianOutput = execSync('node experian-score-calculator.js').toString();
    
    console.log("Running Equifax calculator...");
    const equifaxOutput = execSync('node equifax-score-calculator.js').toString();
    
    // Extract scores using regex
    const cibilScore = parseInt(cibilOutput.match(/Total CIBIL Score: (\d+)/)[1]);
    const experianScore = parseInt(experianOutput.match(/Total Experian Score: (\d+)/)[1]);
    const equifaxScore = parseInt(equifaxOutput.match(/Total Equifax Score: (\d+)/)[1]);
    
    return {
      cibil: cibilScore,
      experian: experianScore,
      equifax: equifaxScore
    };
  } catch (error) {
    console.error("Error running calculators:", error);
    return calculateAllScores();
  }
}

// Direct calculation function if exec doesn't work
function calculateAllScores() {
  function calculateCibilScore() {
    const creditHistory = profileData.credit_score;
    const totalPayments = creditHistory.payment_history.timely_payments + creditHistory.payment_history.late_payments;
    const paymentHistoryScore = (creditHistory.payment_history.timely_payments / totalPayments) * 100;
    const utilizationScore = 100 - (creditHistory.credit_utilization_ratio * 100);
    return Math.round(500 + (paymentHistoryScore * 2) + utilizationScore);
  }
  
  function calculateExperianScore() {
    const creditHistory = profileData.credit_score;
    const totalPayments = creditHistory.payment_history.timely_payments + creditHistory.payment_history.late_payments;
    const paymentHistoryScore = (creditHistory.payment_history.timely_payments / totalPayments) * 100;
    const utilizationScore = 100 - (creditHistory.credit_utilization_ratio * 100);
    return Math.round(500 + (paymentHistoryScore * 1.8) + utilizationScore);
  }
  
  function calculateEquifaxScore() {
    const creditHistory = profileData.credit_score;
    const totalPayments = creditHistory.payment_history.timely_payments + creditHistory.payment_history.late_payments;
    const paymentHistoryScore = (creditHistory.payment_history.timely_payments / totalPayments) * 100;
    const utilizationScore = 100 - (creditHistory.credit_utilization_ratio * 100);
    return Math.round(480 + (paymentHistoryScore * 1.9) + utilizationScore);
  }
  
  return {
    cibil: calculateCibilScore(),
    experian: calculateExperianScore(),
    equifax: calculateEquifaxScore()
  };
}

// Function to normalize scores to 0-1000 scale
function normalizeScore(score, min, max) {
  return Math.round(((score - min) / (max - min)) * 1000);
}

// Function to calculate unified score
function calculateUnifiedScore(scores) {
  const normalizedCibil = normalizeScore(scores.cibil, 300, 900);
  const normalizedExperian = normalizeScore(scores.experian, 300, 850);
  const normalizedEquifax = normalizeScore(scores.equifax, 280, 850);
  
  const weights = {
    cibil: 0.4,
    experian: 0.35,
    equifax: 0.25
  };
  
  const unifiedScore = Math.round(
    (normalizedCibil * weights.cibil + 
     normalizedExperian * weights.experian + 
     normalizedEquifax * weights.equifax) / 
    (weights.cibil + weights.experian + weights.equifax)
  );
  
  return {
    raw: {
      cibil: scores.cibil,
      experian: scores.experian,
      equifax: scores.equifax
    },
    normalized: {
      cibil: normalizedCibil,
      experian: normalizedExperian,
      equifax: normalizedEquifax
    },
    unified: unifiedScore
  };
}

// Function to generate a credit summary report
function generateCreditSummary(scoreData, profile) {
  const creditHistory = profile.credit_score;
  
  const totalCredit = Object.values(creditHistory.credit_mix).reduce((sum, val) => sum + val, 0);
  const utilizationRatio = creditHistory.credit_utilization_ratio;
  const utilizationPercentage = Math.round(utilizationRatio * 100);
  
  const totalPayments = creditHistory.payment_history.timely_payments + creditHistory.payment_history.late_payments;
  const latePaymentsCount = creditHistory.payment_history.late_payments;
  const latePaymentImpact = latePaymentsCount === 0 ? "No Impact" : 
                            latePaymentsCount <= 1 ? "Minor Impact" : 
                            latePaymentsCount <= 3 ? "Moderate Impact" : "Severe Impact";
  
  const creditMixCount = Object.keys(creditHistory.credit_mix).length;
  const creditMixImpact = creditMixCount >= 3 ? "Positive" : 
                         creditMixCount === 2 ? "Neutral" : "Negative";
  
  const hardInquiriesCount = creditHistory.hard_inquiries_count;
  const inquiriesImpact = hardInquiriesCount <= 1 ? "No Impact" : 
                         hardInquiriesCount <= 3 ? "Minor Impact" : 
                         hardInquiriesCount <= 5 ? "Moderate Impact" : "Severe Impact";
  
  const negativeRemarks = creditHistory.negative_remarks;
  const negativeRemarksImpact = negativeRemarks === "None" ? "No Impact" : "Severe Impact";
  
  let riskProfile;
  if (scoreData.unified >= 800) {
    riskProfile = "Very Low Risk - Excellent for Premium Credit Products";
  } else if (scoreData.unified >= 750) {
    riskProfile = "Low Risk - Eligible for Most Loans & Credit Cards";
  } else if (scoreData.unified >= 650) {
    riskProfile = "Low to Medium Risk - Good Chances for Loan Approval";
  } else if (scoreData.unified >= 550) {
    riskProfile = "Medium Risk - May Qualify for Standard Loans";
  } else if (scoreData.unified >= 450) {
    riskProfile = "Medium to High Risk - Limited Credit Options";
  } else {
    riskProfile = "High Risk - Significant Improvement Needed";
  }
  
  return {
    personalInfo: {
      name: profile.personal_data.name,
      dob: profile.personal_data.date_of_birth,
      address: profile.personal_data.address,
      phone: profile.personal_data.phone_number,
      email: profile.personal_data.email,
      panNumber: creditHistory.pan_number,
      aadhaarNumber: creditHistory.aadhaar_number
    },
    scores: scoreData,
    creditUtilization: {
      ratio: utilizationRatio,
      percentage: utilizationPercentage,
      impact: utilizationPercentage <= 30 ? "Good" : 
              utilizationPercentage <= 50 ? "Moderate" : "Poor"
    },
    repaymentHistory: {
      totalPayments: totalPayments,
      timelyPayments: creditHistory.payment_history.timely_payments,
      latePayments: latePaymentsCount,
      impact: latePaymentImpact
    },
    creditMix: {
      loans: creditHistory.credit_mix,
      count: creditMixCount,
      impact: creditMixImpact
    },
    hardInquiries: {
      count: hardInquiriesCount,
      impact: inquiriesImpact
    },
    negativeRemarks: {
      remarks: negativeRemarks,
      impact: negativeRemarksImpact
    },
    riskProfile: riskProfile
  };
}

// Function to save the report as JSON
function saveReportAsJson(summary) {
  const report = {
    title: "Unified Credit Score Report",
    generatedDate: new Date().toISOString(),
    data: summary
  };
  
  fs.writeFileSync('report.json', JSON.stringify(report, null, 2));
  console.log("Credit report JSON generated successfully: report.json");
}

// Helper function to get emoji rating
function getRatingEmoji(value, maxValue, isLowerBetter = false) {
  let percentage;
  if (isLowerBetter) {
    percentage = 100 - ((value / maxValue) * 100);
  } else {
    percentage = (value / maxValue) * 100;
  }
  
  if (percentage >= 80) return "✅ Good";
  if (percentage >= 60) return "🔶 Minor Risk";
  if (percentage >= 40) return "🔶 Moderate Risk";
  return "❌ High Risk";
}

// Main execution
(async function main() {
  try {
    console.log("Starting credit score calculation and report generation...");
    
    const rawScores = runCreditCalculators();
    console.log("Raw scores calculated:", rawScores);
    
    const scoreData = calculateUnifiedScore(rawScores);
    console.log("Unified score calculated:", scoreData.unified);
    
    const creditSummary = generateCreditSummary(scoreData, profileData);
    console.log("Credit summary generated");
    
    saveReportAsJson(creditSummary);
    
    fs.writeFileSync('credit_summary.json', JSON.stringify(creditSummary, null, 2));
    console.log("Credit summary JSON saved: credit_summary.json");
    
    console.log("Process completed successfully!");
  } catch (error) {
    console.error("Error in main process:", error);
  }
})();