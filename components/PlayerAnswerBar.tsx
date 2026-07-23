"use client";

import Image from "next/image";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

type Player = {
  id: number;
  fullName: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  image?: string | null;
};

type PlayerAnswerBarProps = {
  players: Player[];
  onGuess: (player: Player) => void;
  disabled?: boolean;
  guessedPlayerIds?: number[];
};

const MAX_RESULTS = 8;

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.'’-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function PlayerAnswerBar({
  players,
  onGuess,
  disabled = false,
  guessedPlayerIds = [],
}: PlayerAnswerBarProps) {
  const [query, setQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const guessedIds = useMemo(
    () => new Set(guessedPlayerIds),
    [guessedPlayerIds],
  );

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = normalizeName(query);

    if (!normalizedQuery) {
      return [];
    }

    return players
      .filter((player) => {
        if (guessedIds.has(player.id)) {
          return false;
        }

        return normalizeName(player.fullName).includes(normalizedQuery);
      })
      .sort((a, b) => {
        const aName = normalizeName(a.fullName);
        const bName = normalizeName(b.fullName);

        const aStartsWith = aName.startsWith(normalizedQuery);
        const bStartsWith = bName.startsWith(normalizedQuery);

        if (aStartsWith && !bStartsWith) {
          return -1;
        }

        if (!aStartsWith && bStartsWith) {
          return 1;
        }

        return a.fullName.localeCompare(b.fullName);
      })
      .slice(0, MAX_RESULTS);
  }, [players, query, guessedIds]);

  const showDropdown = query.trim().length > 0 && selectedPlayer === null;

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  function choosePlayer(player: Player) {
    setSelectedPlayer(player);
    setQuery(player.fullName);
  }

  function submitGuess(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!selectedPlayer || disabled) {
      return;
    }

    onGuess(selectedPlayer);

    setQuery("");
    setSelectedPlayer(null);
    setHighlightedIndex(0);
  }

  function updateQuery(value: string) {
    setQuery(value);
    setSelectedPlayer(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedIndex((current) =>
        Math.min(current + 1, Math.max(filteredPlayers.length - 1, 0)),
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((current) => Math.max(current - 1, 0));

      return;
    }

    if (event.key === "Enter") {
      if (showDropdown && filteredPlayers[highlightedIndex]) {
        event.preventDefault();
        choosePlayer(filteredPlayers[highlightedIndex]);
      }
    }
  }

  return (
    <form
      onSubmit={submitGuess}
      className="mx-auto w-full max-w-xl"
      autoComplete="off"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="search"
            value={query}
            disabled={disabled}
            placeholder="Guess an NBA player..."
            aria-label="Guess an NBA player"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="search"
            onChange={(event) => updateQuery(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
            className="
      h-14 w-full rounded-xl border border-white/15
      bg-zinc-900 px-4 text-base text-white
      outline-none transition
      placeholder:text-zinc-500
      focus:border-orange-500
      focus:ring-2 focus:ring-orange-500/20
      disabled:cursor-not-allowed disabled:opacity-50
    "
          />

          {showDropdown && (
            <div
              role="listbox"
              className="
        absolute left-0 right-0 top-[calc(100%+8px)]
        z-[100] max-h-[40vh]
        overflow-y-auto overscroll-contain
        rounded-xl border border-white/10 bg-zinc-900
        p-1 shadow-2xl
        [-webkit-overflow-scrolling:touch]
      "
            >
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => {
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
  key={player.id}
  type="button"
  role="option"
  aria-selected={isHighlighted}
  onMouseEnter={() => setHighlightedIndex(index)}
  onPointerDown={(event) => {
    event.preventDefault();
    choosePlayer(player);
  }}
  className={`
    flex w-full touch-manipulation items-center gap-3
    rounded-lg px-3 py-3 text-left transition
    ${
      isHighlighted
        ? "bg-orange-500 text-black"
        : "text-white hover:bg-white/10"
    }
  `}
>
  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-700">
    {player.image ? (
      <Image
        src={player.image}
        alt={`${player.fullName} headshot`}
        fill
        sizes="40px"
        className="object-cover"
        unoptimized
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-sm font-bold">
        {player.fullName.charAt(0)}
      </div>
    )}
  </div>

  <div className="min-w-0">
    <p className="truncate font-semibold">
      {player.fullName}
    </p>

    {player.isActive && (
      <p
        className={`text-xs ${
          isHighlighted
            ? "text-black/70"
            : "text-zinc-400"
        }`}
      >
        Active player
      </p>
    )}
  </div>
</button>
                  );
                })
              ) : (
                <div className="px-4 py-5 text-center text-sm text-zinc-400">
                  No eligible player found.
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!selectedPlayer || disabled}
          className="
            h-14 w-full rounded-xl bg-orange-500 px-6
            font-bold uppercase tracking-wide text-black
            transition hover:bg-orange-400
            disabled:cursor-not-allowed
            disabled:bg-zinc-700 disabled:text-zinc-400
            sm:w-auto
          "
        >
          Guess
        </button>
      </div>
    </form>
  );
}