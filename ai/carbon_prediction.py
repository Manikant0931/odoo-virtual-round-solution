import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

print("========== Carbon Emission Prediction ==========\n")
df = pd.read_csv("ai/carbon_data.csv")
print("Dataset Loaded Successfully\n")
X = df[["Energy_Used", "Production"]]
y = df["Carbon_Emission"]
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)
model = LinearRegression()
model.fit(
    X_train,
    y_train
)
print("Model Training Completed\n")
prediction = model.predict(X_test)
mae = mean_absolute_error(
    y_test,
    prediction
)
accuracy = r2_score(
    y_test,
    prediction
)
print("Model Performance")
print("-------------------")
print(f"Mean Absolute Error : {mae:.2f}")
print(f"R2 Score            : {accuracy:.2f}")
new_data = pd.DataFrame({

    "Energy_Used":[1800],

    "Production":[600]

})
future_emission = model.predict(new_data)
print("\nFuture Carbon Prediction")
print("------------------------")
print(f"Predicted Carbon Emission : {future_emission[0]:.2f} kg CO2")
result = pd.DataFrame({

    "Energy_Used":[1800],

    "Production":[600],

    "Predicted_Carbon_Emission":[
        round(future_emission[0],2)
    ]
})
result.to_csv(
    "ai/carbon_prediction_result.csv",
    index=False
)
print("\nPrediction Result Saved Successfully!")