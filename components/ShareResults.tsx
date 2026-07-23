"use client";

import { useState } from "react";

type PlayerAttributes = {
  id: number;
  fullName: string;
  draftYear: number | null;
  draftPick: number | null;
  college: string | null;
};

type Props = {
  guesses: PlayerAttributes[];
  answer: PlayerAttributes;
  puzzleNumber: number;
  wonGame: boolean;
  maxGuesses: number;
};

function normalizeCollege(college: string | null) {
  return college?.trim().toLowerCase() ?? null;
}

export default function ShareResults({
  guesses,
  answer,
  puzzleNumber,
  wonGame,
  maxGuesses,
}: Props) {
  const [shareStatus, setShareStatus] = useState<
    "idle" | "copied" | "shared" | "error"
  >("idle");

  function rowForGuess(guess: PlayerAttributes) {
    const year = guess.draftYear === answer.draftYear ? "🟩" : "🟨";
    const pick = guess.draftPick === answer.draftPick ? "🟩" : "🟨";

    const college =
      normalizeCollege(guess.college) === normalizeCollege(answer.college)
        ? "🟩"
        : "🟥";

    return `${year}${pick}${college}`;
  }

  function buildShareText() {
    const rows = guesses.map(rowForGuess).join("\n");

    return `🏀 BallKnowledge #${puzzleNumber}

${rows}

${wonGame ? `✅ ${guesses.length}/${maxGuesses}` : `❌ X/${maxGuesses}`}

${window.location.origin}`;
  }

  async function copyWithFallback(text: string) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const copiedSuccessfully = document.execCommand("copy");

    document.body.removeChild(textarea);

    if (!copiedSuccessfully) {
      throw new Error("Clipboard copy failed.");
    }
  }

  async function handleShare() {
    const text = buildShareText();

    try {
      setShareStatus("idle");

      if (navigator.share) {
        await navigator.share({
          title: `BallKnowledge #${puzzleNumber}`,
          text,
        });

        setShareStatus("shared");
      } else {
        await copyWithFallback(text);
        setShareStatus("copied");
      }

      window.setTimeout(() => {
        setShareStatus("idle");
      }, 2000);
    } catch (error) {
      // Closing the native share sheet is not a real application error.
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Unable to share results:", error);
      setShareStatus("error");
    }
  }

  return (
    <div className="mt-8 text-center">
      <button
        type="button"
        onClick={handleShare}
        className="
          touch-manipulation rounded-xl bg-green-500
          px-6 py-3 font-bold text-black
          transition hover:bg-green-400
          active:scale-[0.98]
        "
      >
        Share Results
      </button>

      {shareStatus === "shared" && (
        <p className="mt-2 text-green-400">
          Results shared!
        </p>
      )}

      {shareStatus === "copied" && (
        <p className="mt-2 text-green-400">
          Copied to clipboard!
        </p>
      )}

      {shareStatus === "error" && (
        <p className="mt-2 text-red-400">
          Could not share results. Try again after the game is deployed.
        </p>
      )}
    </div>
  );
}