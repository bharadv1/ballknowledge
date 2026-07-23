"use client";

import { useState } from "react";

import ShareResults from "@/components/ShareResults";
import GuessFeedback from "@/components/GuessFeedback";
import playerAttributesData from "@/data/player_attributes.json";
import GuessHistory from "@/components/GuessHistory";
import AllClues from "@/components/AllClues";
import AnswerReveal from "@/components/AnswerReveal";
import CurrentClue from "@/components/CurrentClue";
import GuessClock from "@/components/GuessClock";
import PlayerAnswerBar from "@/components/PlayerAnswerBar";
import { getDailyPuzzle } from "@/data/dailyPuzzle";
import eligiblePlayers from "@/data/eligible_players.json";

type Player = {
    id: number;
    fullName: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    image?: string | null;
};

type PlayerAttributes = {
    id: number;
    fullName: string;
    draftYear: number | null;
    draftPick: number | null;
    college: string | null;
};

const MAX_GUESSES = 6;

export default function GamePage() {
    const [guesses, setGuesses] = useState<Player[]>([]);
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const dailyPuzzle = getDailyPuzzle();
    const playerAttributes = playerAttributesData as PlayerAttributes[];

    const answerAttributes = playerAttributes.find(
        (player) => player.id === dailyPuzzle.playerId,
    );

    const guessedPlayerAttributes = guesses
        .map((guess) =>
            playerAttributes.find(
                (player) => player.id === guess.id,
            ),
        )
        .filter(
            (player): player is PlayerAttributes =>
                player !== undefined,
        );

    const players = eligiblePlayers as Player[];

    const answerPlayer = players.find(
        (player) => player.id === dailyPuzzle.playerId,
    );

    const guessesLeft = Math.max(0, MAX_GUESSES - guesses.length);

    const currentClueIndex = Math.min(
        guesses.length,
        dailyPuzzle.clues.length - 1,
    );

    const currentClue = dailyPuzzle.clues[currentClueIndex];

    const wonGame = guesses.some(
        (player) => player.id === dailyPuzzle.playerId,
    );

    function handleGuess(player: Player) {
        if (gameOver) {
            return;
        }

        const updatedGuesses = [...guesses, player];
        setGuesses(updatedGuesses);

        if (player.id === dailyPuzzle.playerId) {
            setMessage(`Correct! The answer was ${player.fullName}.`);
            setGameOver(true);
            return;
        }

        const remainingGuesses = MAX_GUESSES - updatedGuesses.length;

        if (remainingGuesses === 0) {
            setMessage(
                answerPlayer
                    ? `Game over. The answer was ${answerPlayer.fullName}.`
                    : "Game over.",
            );

            setGameOver(true);
            return;
        }

        setMessage(`${player.fullName} is incorrect. Another clue was revealed.`);
    }

    if (!answerPlayer) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
                <div className="max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                    <h1 className="text-xl font-bold text-red-400">
                        Daily puzzle configuration error
                    </h1>

                    <p className="mt-3 text-zinc-300">
                        No eligible player was found with ID {dailyPuzzle.playerId}.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <GuessClock
                        guessesLeft={guessesLeft}
                        maxGuesses={MAX_GUESSES}
                    />
                </div>

                {!gameOver && (
                    <CurrentClue
                        clue={currentClue}
                        clueNumber={currentClueIndex + 1}
                        totalClues={dailyPuzzle.clues.length}
                    />
                )}
                
                {!gameOver && (
                    <PlayerAnswerBar
                        players={players}
                        onGuess={handleGuess}
                        guessedPlayerIds={guesses.map((player) => player.id)}
                    />
                )}

                {guesses.length > 0 && answerAttributes && (
                    <section className="mt-8 space-y-4">
                        {guesses.map((guess, index) => {
                            const guessAttributes = playerAttributes.find(
                                (player) => player.id === guess.id,
                            );

                            if (!guessAttributes) {
                                return null;
                            }

                            return (
                                <GuessFeedback
                                    key={guess.id}
                                    guess={guessAttributes}
                                    answer={answerAttributes}
                                    guessNumber={index + 1}
                                />
                            );
                        })}
                    </section>
                )}

                {message && (
                    <p
                        className={`mt-4 text-center font-semibold ${wonGame
                            ? "text-green-400"
                            : gameOver
                                ? "text-red-400"
                                : "text-orange-400"
                            }`}
                    >
                        {message}
                    </p>
                )}

                {gameOver && (
                    <AnswerReveal
                        fullName={answerPlayer.fullName}
                        image={answerPlayer.image}
                        wonGame={wonGame}
                        guesses={guesses.length}
                    />
                )}
                {gameOver && (
                    <AllClues clues={dailyPuzzle.clues} />
                )}
                <GuessHistory
                    guesses={guesses}
                    answerId={dailyPuzzle.playerId}
                />

                {gameOver && answerAttributes && (
                    <ShareResults
                        guesses={guessedPlayerAttributes}
                        answer={answerAttributes}
                        puzzleNumber={dailyPuzzle.puzzleNumber}
                        wonGame={wonGame}
                        maxGuesses={MAX_GUESSES}
                    />
                )}
            </div>
        </main>
    );
}