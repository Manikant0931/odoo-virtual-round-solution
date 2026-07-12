import pandas as pd
df = pd.read_csv("ai/sample_data.csv")

df["ESG Score"] = (
    df["Environmental"] * 0.40 +
    df["Social"] * 0.30 +
    df["Governance"] * 0.30
)
df["ESG Score"]=df["ESG Score"].round(2)
print("Department-wise ESG Scores")
print(df)
df.to_csv("ai/esg_results.csv", index=False)
