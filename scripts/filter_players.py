import json
from pathlib import Path

import pandas as pd


# --------------------------------------------------
# Project paths
# --------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent

PLAYERS_JSON = PROJECT_ROOT / "data" / "players.json"
OUTPUT_JSON = PROJECT_ROOT / "data" / "eligible_players.json"

SEASONS_CSV = Path(
    "/Users/vivekbharadwaj/Desktop/NBA_DataScience/all_seasons.csv"
)


# --------------------------------------------------
# Known naming differences
# CSV name -> players.json fullName
# --------------------------------------------------
NAME_ALIASES = {
    "A.J. Lawson": "AJ Lawson",
    "Alekesej Pokusevski": "Aleksej Pokusevski",
    "Brandon Boston": "Brandon Boston Jr.",
    "CJ Wilcox": "C.J. Wilcox",
    "Danuel House": "Danuel House Jr.",
    "Enes Kanter": "Enes Freedom",
    "Frank Mason": "Frank Mason III",
    "Jeff Dowtin": "Jeff Dowtin Jr.",
    "Kenyon Martin Jr.": "KJ Martin",
    "Marcus Morris": "Marcus Morris Sr.",
    "Nicolas Claxton": "Nic Claxton",
    "O.G. Anunoby": "OG Anunoby",
    "P.J. Dozier": "PJ Dozier",
    "PJ Tucker": "P.J. Tucker",
    "Patrick Baldwin": "Patrick Baldwin Jr.",
    "TJ Leaf": "T.J. Leaf",
    "TJ Warren": "T.J. Warren",
    "Xavier Tillman Sr.": "Xavier Tillman",
}


def main() -> None:
    # --------------------------------------------------
    # Validate files
    # --------------------------------------------------
    if not PLAYERS_JSON.exists():
        raise FileNotFoundError(
            f"Could not find players.json at:\n{PLAYERS_JSON}"
        )

    if not SEASONS_CSV.exists():
        raise FileNotFoundError(
            f"Could not find all_seasons.csv at:\n{SEASONS_CSV}"
        )

    # --------------------------------------------------
    # Load master players.json
    # --------------------------------------------------
    with PLAYERS_JSON.open("r", encoding="utf-8") as file:
        players = json.load(file)

    original_count = len(players)

    # --------------------------------------------------
    # Load all_seasons.csv
    # --------------------------------------------------
    df = pd.read_csv(SEASONS_CSV)

    if "player_name" not in df.columns:
        raise KeyError(
            "The CSV does not contain a 'player_name' column."
        )

    csv_player_names = set(
        df["player_name"]
        .dropna()
        .astype(str)
        .str.strip()
    )

    unique_csv_count = len(csv_player_names)

    # Apply known aliases
    historical_players = {
        NAME_ALIASES.get(name, name)
        for name in csv_player_names
    }

    # --------------------------------------------------
    # Filter players
    #
    # Keep a player when:
    # 1. They appear in all_seasons.csv
    # 2. OR they have isActive: true
    # --------------------------------------------------
    filtered_players = []
    seen_ids = set()

    for player in players:
        player_id = player.get("id")
        full_name = player.get("fullName", "").strip()
        is_active = player.get("isActive", False)

        keep_player = (
            is_active
            or full_name in historical_players
        )

        if keep_player and player_id not in seen_ids:
            filtered_players.append(player)
            seen_ids.add(player_id)

    # Sort alphabetically without changing player objects
    filtered_players.sort(
        key=lambda player: player.get("fullName", "").lower()
    )

    # --------------------------------------------------
    # Save filtered output
    # --------------------------------------------------
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_JSON.open("w", encoding="utf-8") as file:
        json.dump(
            filtered_players,
            file,
            indent=2,
            ensure_ascii=False,
        )

    # --------------------------------------------------
    # Build summary
    # --------------------------------------------------
    json_names = {
        player.get("fullName", "").strip()
        for player in players
        if player.get("fullName")
    }

    matched_names = historical_players & json_names
    unmatched_names = sorted(
        historical_players - json_names
    )

    active_count = sum(
        1
        for player in filtered_players
        if player.get("isActive", False)
    )

    historical_count = sum(
        1
        for player in filtered_players
        if player.get("fullName", "").strip()
        in historical_players
    )

    print("=" * 50)
    print("BallKnowledge Player Filter Complete")
    print("=" * 50)
    print(f"Original players.json:      {original_count}")
    print(f"Unique CSV player names:    {unique_csv_count}")
    print(f"Historical matches:         {len(matched_names)}")
    print(f"Historical players kept:    {historical_count}")
    print(f"Active players retained:    {active_count}")
    print(f"Final player count:         {len(filtered_players)}")
    print(f"Unmatched CSV names:        {len(unmatched_names)}")
    print(f"Output written to:          {OUTPUT_JSON}")

    if unmatched_names:
        print("\nPlayers in CSV but not found in players.json:")

        for name in unmatched_names:
            print(f" - {name}")


if __name__ == "__main__":
    main()