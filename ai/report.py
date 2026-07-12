import pandas as pd
df=pd.read_csv("ai/esg_results.csv")
print("EcoSphere ESG Report")
average=df["ESG Score"].mean()
best=df.loc[df["ESG Score"].idxmax()]
lowest=df.loc[df["ESG Score"].idxmin()]
print(f"Average ESG Score : {average:.2f}")
print(f"Best Department   : {best['Department']} ({best['ESG Score']})")
print(f"Lowest Department : {lowest['Department']} ({lowest['ESG Score']})")
print("\nDepartment-wise ESG Scores")
for index, row in df.iterrows():
    print(f"{row['Department']} : {row['ESG Score']}")