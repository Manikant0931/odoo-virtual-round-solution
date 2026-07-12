import pandas as pd

df = pd.read_csv("ai/carbon_data.csv")
print("========== Carbon Emission Report ==========\n")
total_emission = df["Carbon_Emission"].sum()
print(f"Total Carbon Emission : {total_emission} kg CO2")
average = df["Carbon_Emission"].mean()
print(f"Average Transaction Emission : {average:.2f} kg CO2")
print("\nDepartment Wise Carbon Emission")
department_emission = (
    df.groupby("Department")["Carbon_Emission"]
    .sum()
    .sort_values(ascending=False)
)
print(department_emission)
highest = department_emission.idxmax()
print(f"\nHighest Emission Department : {highest}")
print(
    f"Emission : {department_emission[highest]} kg CO2"
)
lowest = department_emission.idxmin()
print(f"\nLowest Emission Department : {lowest}")
print(f"Emission : {department_emission[lowest]} kg CO2")
print("\nActivity Wise Carbon Emission")

activity = (
    df.groupby("Activity")["Carbon_Emission"]
    .sum()
    .sort_values(ascending=False)
)
print(activity)
print("\nMonthly Carbon Trend")
monthly = (
    df.groupby("Month")["Carbon_Emission"]
    .sum()
)
print(monthly)
report = {
    "Total Carbon Emission": total_emission,
    "Average Emission": round(average,2),
    "Highest Emission Department": highest,
    "Lowest Emission Department": lowest
}
report_df = pd.DataFrame([report])
report_df.to_csv(
    "ai/carbon_report.csv",
    index=False
)
print("\nCarbon Report Generated Successfully!")