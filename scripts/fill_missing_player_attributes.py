import json
import time

import pandas as pd
from nba_api.stats.endpoints import commonplayerinfo
from requests.exceptions import ReadTimeout, ConnectionError


ELIGIBLE_PLAYERS_PATH = "data/eligible_players.json"
ATTRIBUTES_PATH = "data/player_attributes.json"

MAX_RETRIES = 3
REQUEST_TIMEOUT = 60
DELAY_BETWEEN_REQUESTS = 1.0


def safe_int(value):
    if value is None or pd.isna(value):
        return None

    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def clean_text(value):
    if value is None or pd.isna(value):
        return None

    text = str(value).strip()

    if not text or text.lower() in {"none", "nan", "n/a"}:
        return None

    return text


with open(ELIGIBLE_PLAYERS_PATH, "r", encoding="utf-8") as f:
    eligible_players = json.load(f)

with open(ATTRIBUTES_PATH, "r", encoding="utf-8") as f:
    player_attributes = json.load(f)

existing_ids = {
    player["id"]
    for player in player_attributes
}

missing_players = [
    player
    for player in eligible_players
    if player["id"] not in existing_ids
]

print(f"Found {len(missing_players)} missing players.")

for index, player in enumerate(missing_players, start=1):
    player_id = player["id"]
    full_name = player["fullName"]

    print(
        f"[{index}/{len(missing_players)}] Fetching {full_name}..."
    )

    successful = False

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            endpoint = commonplayerinfo.CommonPlayerInfo(
                player_id=player_id,
                timeout=REQUEST_TIMEOUT,
            )

            data_frames = endpoint.get_data_frames()

            if not data_frames or data_frames[0].empty:
                print(f"No API data returned for {full_name}.")
                break

            row = data_frames[0].iloc[0]

            player_attributes.append({
                "id": player_id,
                "fullName": full_name,
                "draftYear": safe_int(row.get("DRAFT_YEAR")),
                "draftPick": safe_int(row.get("DRAFT_NUMBER")),
                "college": clean_text(row.get("SCHOOL")),
            })

            existing_ids.add(player_id)
            successful = True

            with open(ATTRIBUTES_PATH, "w", encoding="utf-8") as f:
                json.dump(
                    player_attributes,
                    f,
                    indent=2,
                    ensure_ascii=False,
                )

            print(f"Added {full_name}.")
            break

        except (ReadTimeout, ConnectionError) as error:
            print(
                f"Attempt {attempt}/{MAX_RETRIES} failed "
                f"for {full_name}: {error}"
            )

            if attempt < MAX_RETRIES:
                time.sleep(3)

        except Exception as error:
            print(f"Unexpected error for {full_name}: {error}")
            break

    if not successful:
        print(f"Could not add {full_name}.")

    time.sleep(DELAY_BETWEEN_REQUESTS)

player_attributes.sort(
    key=lambda player: player["fullName"].lower()
)

with open(ATTRIBUTES_PATH, "w", encoding="utf-8") as f:
    json.dump(
        player_attributes,
        f,
        indent=2,
        ensure_ascii=False,
    )

print(
    f"Finished. player_attributes.json now contains "
    f"{len(player_attributes)} players."
)