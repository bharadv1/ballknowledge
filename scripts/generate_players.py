import json
from pathlib import Path

from nba_api.stats.static import players


def main() -> None:
    nba_players = players.get_players()

    output = []

    for player in nba_players:
        player_id = player["id"]

        output.append(
            {
                "id": player_id,
                "fullName": player["full_name"],
                "firstName": player["first_name"],
                "lastName": player["last_name"],
                "isActive": player["is_active"],
                "image": (
                    "https://cdn.nba.com/headshots/nba/latest/"
                    f"1040x760/{player_id}.png"
                ),
            }
        )

    output.sort(key=lambda player: player["fullName"])

    output_path = Path("data/players.json")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding="utf-8") as file:
        json.dump(output, file, indent=2, ensure_ascii=False)

    print(f"Created {output_path} with {len(output)} players.")


if __name__ == "__main__":
    main()