import pandas as pd
data = pd.read_csv("ai/esg_results.csv")

print("========== ESG Analytics ==========\n")

average_score = data["ESG Score"].mean()
print(f"Average ESG Score : {average_score:.2f}")

highest = data.loc[data["ESG Score"].idxmax()]
print(f"\nBest Department : {highest['Department']}")
print(f"Score : {highest['ESG Score']}")

lowest = data.loc[data["ESG Score"].idxmin()]
print(f"\nLowest Department : {lowest['Department']}")
print(f"Score : {lowest['ESG Score']}")

print("\nDepartment Ranking")
ranking = data.sort_values(by="ESG Score", ascending=False)
print(ranking[["Department", "ESG Score"]])