import json
import pandas as pd


def safe_int(value):
    if pd.isna(value):
        return None

    try:
        return int(value)
    except (ValueError, TypeError):
        return None


# Load eligible players
with open("data/eligible_players.json", "r", encoding="utf-8") as f:
    eligible_players = json.load(f)

# Load season data
df = pd.read_csv("/Users/vivekbharadwaj/Desktop/NBA_DataScience/all_seasons.csv")

# Keep each player's first NBA season
player_lookup = (
    df.sort_values("season")
      .drop_duplicates(subset="player_name", keep="first")
      .set_index("player_name")
)

attributes = []

for player in eligible_players:
    name = player["fullName"]

    if name not in player_lookup.index:
        print(f"Skipping {name}")
        continue

    row = player_lookup.loc[name]

    attributes.append({
        "id": player["id"],
        "fullName": name,
        "draftYear": safe_int(row["draft_year"]),
        "draftPick": safe_int(row["draft_number"]),
        "college": (
            row["college"]
            if pd.notna(row["college"])
            else None
        ),
    })

with open("data/player_attributes.json", "w", encoding="utf-8") as f:
    json.dump(attributes, f, indent=2)

print(f"Generated attributes for {len(attributes)} players.")