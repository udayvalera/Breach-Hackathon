import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import joblib
import os

# File path
csv_file_path = 'synthetic_credit_scores.csv'

try:
    # Read and process the data
    data = pd.read_csv(csv_file_path)
    print("CSV data loaded successfully!")
    
    # Check for NaN or invalid values
    clean_data = data.dropna(subset=['equifax_credit_score', 'transUnion_credit_score', 
                                     'experian_credit_score', 'unified_credit_score'])
    
    print(f"Filtered out {len(data) - len(clean_data)} rows with invalid data")
    
    # Extract features and labels
    X = clean_data[['equifax_credit_score', 'transUnion_credit_score', 'experian_credit_score']]
    y = clean_data['unified_credit_score']
    
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Create and fit the scalers
    X_scaler = MinMaxScaler()
    y_scaler = MinMaxScaler()
    
    # Scale the inputs and outputs
    X_train_scaled = X_scaler.fit_transform(X_train)
    X_test_scaled = X_scaler.transform(X_test)
    
    # Reshape y for scaling
    y_train_reshaped = y_train.values.reshape(-1, 1)
    y_test_reshaped = y_test.values.reshape(-1, 1)
    
    y_train_scaled = y_scaler.fit_transform(y_train_reshaped).ravel()
    y_test_scaled = y_scaler.transform(y_test_reshaped).ravel()
    
    # Create and train Random Forest model
    print("Training the Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    # Train the model
    model.fit(X_train_scaled, y_train_scaled)
    
    # Evaluate the model
    train_score = model.score(X_train_scaled, y_train_scaled)
    test_score = model.score(X_test_scaled, y_test_scaled)
    
    print(f"Training R² score: {train_score:.4f}")
    print(f"Testing R² score: {test_score:.4f}")
    
    # Test with sample input
    sample_input = np.array([[690, 710, 680]])
    sample_input_scaled = X_scaler.transform(sample_input)
    prediction_scaled = model.predict(sample_input_scaled)
    prediction = y_scaler.inverse_transform(prediction_scaled.reshape(-1, 1))
    
    print(f"Prediction for Equifax=690, TransUnion=710, Experian=680: {prediction[0][0]:.2f}")
    
    # Save all components
    model_dir = os.getcwd()
    joblib.dump(model, os.path.join(model_dir, 'rf_model.joblib'))
    joblib.dump(X_scaler, os.path.join(model_dir, 'X_scaler.joblib'))
    joblib.dump(y_scaler, os.path.join(model_dir, 'y_scaler.joblib'))
    
    print(f"Model and scalers saved to {model_dir}")
    
    # Create a standalone prediction script
    prediction_script = """#!/usr/bin/env python3
import numpy as np
import joblib
import sys
import os

def predict_credit_score(equifax, transunion, experian):
    # Get current directory (where this script is located)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Load model and scalers
    model = joblib.load(os.path.join(script_dir, 'rf_model.joblib'))
    X_scaler = joblib.load(os.path.join(script_dir, 'X_scaler.joblib'))
    y_scaler = joblib.load(os.path.join(script_dir, 'y_scaler.joblib'))
    
    # Prepare input as numpy array
    input_data = np.array([[equifax, transunion, experian]])
    
    # Scale input
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
        equifax = float(sys.argv[1])
        transunion = float(sys.argv[2])
        experian = float(sys.argv[3])
        
        prediction = predict_credit_score(equifax, transunion, experian)
        print(f"Predicted unified credit score: {prediction:.2f}")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
"""
    
    # Save the prediction script
    script_path = os.path.join(model_dir, 'predict_score.py')
    with open(script_path, 'w') as f:
        f.write(prediction_script)
    
    # Make the script executable
    os.chmod(script_path, 0o755)
    
    print(f"Prediction script saved to {script_path}")
    print("You can now predict scores using: ./predict_score.py <equifax_score> <transunion_score> <experian_score>")
    
except Exception as e:
    print(f"Error: {e}")