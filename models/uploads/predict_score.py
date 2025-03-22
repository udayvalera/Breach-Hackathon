#!/usr/bin/env python3
import numpy as np
import joblib
import sys
import os
import warnings

def predict_credit_score(equifax, transunion, experian):
    # Get current directory (where this script is located)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load model and scalers
    model = joblib.load(os.path.join(script_dir, 'rf_model.joblib'))
    X_scaler = joblib.load(os.path.join(script_dir, 'X_scaler.joblib'))
    y_scaler = joblib.load(os.path.join(script_dir, 'y_scaler.joblib'))
    
    # Prepare input as numpy array
    input_data = np.array([[equifax, transunion, experian]])
    
    # Scale input - suppress warnings
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        input_scaled = X_scaler.transform(input_data)
    
    # Make prediction
    prediction_scaled = model.predict(input_scaled)
    
    # Inverse transform to get actual prediction
    prediction = y_scaler.inverse_transform(prediction_scaled.reshape(-1, 1))
    
    return prediction[0][0]

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python predict_score.py <equifax_score> <transunion_score> <experian_score>")
        sys.exit(1)
    
    try:
        # Suppress all warnings
        warnings.filterwarnings("ignore")
        
        equifax = float(sys.argv[1])
        transunion = float(sys.argv[2])
        experian = float(sys.argv[3])
        
        prediction = predict_credit_score(equifax, transunion, experian)
        print(f"{prediction:.2f}")
    except Exception as e:
        sys.exit(1)