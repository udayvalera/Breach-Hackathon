from pydantic import BaseModel, Field
from typing import Optional
from pydantic_ai.models.groq import GroqModel
from pydantic_ai import Agent
from dotenv import load_dotenv

load_dotenv()

model = GroqModel('gemma2-9b-it')

class CustomerDetail(BaseModel):
    customer_id: str = Field(..., title="Customer ID", description="Unique identifier for the customer")
    experian_score: Optional[int] = Field(None, ge=300, le=850, title="Experian Score", description="Credit score from Experian bureau")
    equifax_score: Optional[int] = Field(None, ge=300, le=850, title="Equifax Score", description="Credit score from Equifax bureau")
    transunion_score: Optional[int] = Field(None, ge=300, le=850, title="TransUnion Score", description="Credit score from TransUnion bureau")

# Example usage
customer = CustomerDetail(
    customer_id="CUST12345",
    experian_score=720,
    equifax_score=710,
    transunion_score=725
)


model = Agent(
    model=model,
    deps_type=CustomerDetail,
    retries=3,
    system_prompt=(
        """You are a Credit Risk Assessment AI that calculates a customer's CIBIL score by aggregating and normalizing credit scores from multiple bureaus.

## TASK:
1. Accept raw credit scores from multiple bureaus (e.g., Experian, Equifax, TransUnion).
2. Normalize the scores to ensure consistency and remove bias. 
3. Calculate the **final CIBIL score** using a linear transformation to normalize it.
4. Generate a **detailed credit report** in JSON format.

## NORMALIZATION METHOD:
- Convert all scores to a **common range (300-850)**.
- If a score is missing, estimate it based on the average of available scores.
- Apply a **weighted average** (default: 40n% Experian, 30% Equifax, 30% TransUnion).
- Round the final score to the nearest integer.

NORMALIZATION METHOD:
	•	Convert all credit scores to a common range (300-850) to ensure consistency.
	•	Normalize Equifax Score (which ranges from 300-900) using min-max scaling:
	•	The formula applied is:
Normalized Equifax = 300 + (((Equifax Score - 300) * (850 - 300))/(900 - 300))
	•	This ensures that an Equifax score of 300 maps to 300, and 900 maps to 850, keeping it aligned with the other bureaus.
	•	If a score is missing, estimate it based on the average of available scores.
	•	Compute the Unified Credit Score by taking the equal-weighted average of all three bureau scores:
Unified Credit Score = (Experian Score + Normalized Equifax Score + TransUnion Score)/3
	•	Round the final score to two decimal places to maintain accuracy.

## JSON OUTPUT FORMAT:
```json
{{
    "customer_id": "<Unique Customer ID>",
    "cibil_score": <Final Normalized CIBIL Score>,
    "bureau_scores": {{
        "Experian": <Experian Score>,
        "Equifax": <Equifax Score>,
        "TransUnion": <TransUnion Score>
    }},
    "credit_risk_level": "<Low/Medium/High>",
    "recommendation": "<Actionable financial advice>"
}}"""
    )
)

response = model.run_sync(user_prompt="Please normalize the credit scores and calculate the final CIBIL score and give me the report and dont show me the steps.",deps=customer)

print(response.data)