import json
import random
from datetime import datetime, timedelta

# Function to generate random dates within a given range
def random_date(start_date, end_date):
    delta = end_date - start_date
    return (start_date + timedelta(days=random.randint(0, delta.days))).strftime("%d-%m-%Y")

# Function to generate a single credit report entry
def generate_credit_report():
    base_score = random.randint(650, 850)  # Base score for all bureaus
    
    return {
        "transunion_cibil": {
            "credit_score": {
                "score": base_score,
                "range": "300-900",
                "rating": "Excellent" if base_score >= 800 else "Good" if base_score >= 700 else "Fair",
                "report_date": "18-03-2025"
            },
            "accounts": [
                {
                    "type": "Credit Card",
                    "institution": random.choice(["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI", "Kotak Mahindra"]),
                    "status": "Active",
                    "balance": random.randint(10000, 90000),
                    "limit": 200000,
                    "payment_history": "All payments on time"
                },
                {
                    "type": "Home Loan",
                    "institution": random.choice(["SBI", "HDFC Bank", "ICICI Bank"]),
                    "status": "Active",
                    "balance": random.randint(2500000, 4000000),
                    "limit": 5000000,
                    "payment_history": "All payments on time"
                },
                {
                    "type": "Personal Loan",
                    "institution": random.choice(["ICICI Bank", "HDFC Bank"]),
                    "status": "Active",
                    "balance": random.randint(200000, 600000),
                    "limit": 800000,
                    "payment_history": "All payments on time"
                }
            ],
            "enquiries": [
                {
                    "institution": random.choice(["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI"]),
                    "purpose": "Credit Card",
                    "date": random_date(datetime(2023, 1, 1), datetime(2025, 3, 1))
                },
                {
                    "institution": random.choice(["HDFC Bank", "ICICI Bank", "Axis Bank", "SBI"]),
                    "purpose": "Auto Loan",
                    "date": random_date(datetime(2023, 1, 1), datetime(2025, 3, 1))
                }
            ]
        },
        "experian": {
            "credit_score": {
                "score": base_score + random.randint(-30, 30),
                "range": "300-900",
                "rating": "Excellent" if base_score + random.randint(-30, 30) >= 800 else "Good" if base_score + random.randint(-30, 30) >= 700 else "Fair",
                "report_date": "18-03-2025"
            },
            "account_summary": {
                "active_accounts": 3,
                "closed_accounts": random.randint(0, 2),
                "total_balance": sum(acc["balance"] for acc in [
                    {"balance": random.randint(10000, 90000)},
                    {"balance": random.randint(2500000, 4000000)},
                    {"balance": random.randint(200000, 600000)}
                ])
            },
            "accounts": [
                {
                    "type": "Credit Card",
                    "institution": "HDFC Bank",
                    "status": "Active",
                    "balance": random.randint(10000, 90000),
                    "opened": "May 2018",
                    "payment_status": "Current"
                },
                {
                    "type": "Home Loan",
                    "institution": "SBI",
                    "status": "Active",
                    "balance": random.randint(2500000, 4000000),
                    "opened": "Dec 2020",
                    "payment_status": "Current"
                },
                {
                    "type": "Personal Loan",
                    "institution": "ICICI Bank",
                    "status": "Active",
                    "balance": random.randint(200000, 600000),
                    "opened": "Mar 2022",
                    "payment_status": "Current"
                },
                {
                    "type": "Credit Card",
                    "institution": "Axis Bank",
                    "status": "Closed",
                    "balance": 0,
                    "opened": "Apr 2016",
                    "closed": "Aug 2023",
                    "payment_status": "Closed"
                }
            ],
            "credit_utilization": f"{random.randint(15, 35)}%"
        },
        "equifax": {
            "credit_score": {
                "score": base_score + random.randint(-30, 30),
                "range": "300-900",
                "rating": "Excellent" if base_score + random.randint(-30, 30) >= 800 else "Good" if base_score + random.randint(-30, 30) >= 700 else "Fair",
                "report_date": "18-03-2025"
            },
            "credit_overview": {
                "open_accounts": 3,
                "delinquent_accounts": 0,
                "outstanding_balance": sum(acc["balance"] for acc in [
                    {"balance": random.randint(10000, 90000)},
                    {"balance": random.randint(2500000, 4000000)},
                    {"balance": random.randint(200000, 600000)}
                ])
            },
            "active_accounts": [
                {
                    "type": "Credit Card",
                    "institution": "HDFC Bank",
                    "balance": random.randint(10000, 90000),
                    "limit": 200000,
                    "status": "Active"
                },
                {
                    "type": "Home Loan",
                    "institution": "SBI",
                    "balance": random.randint(2500000, 4000000),
                    "limit": 5000000,
                    "status": "Active"
                },
                {
                    "type": "Personal Loan",
                    "institution": "ICICI Bank",
                    "balance": random.randint(200000, 600000),
                    "limit": 800000,
                    "status": "Active"
                }
            ],
            "risk_factors": [
                "Multiple credit inquiries in last 12 months" if random.random() > 0.5 else "High credit utilization"
            ]
        }
    }

# Generate 50 credit reports
credit_reports = [generate_credit_report() for _ in range(50)]

# Save to a JSON file
with open("credit_reports.json", "w") as file:
    json.dump(credit_reports, file, indent=4)

# Print sample data
print(json.dumps(credit_reports[:2], indent=4))  # Print first 2 entries for preview