import pandas as pd
df = pd.read_csv("ai/sample_data.csv")

df["ESG Score"] = (
    df["Environmental"] * 0.40 +
    df["Social"] * 0.30 +
    df["Governance"] * 0.30
)
print(df)
