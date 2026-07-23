type GuessClockProps = {
    guessesLeft: number;
    maxGuesses?: number;
  };
  
  export default function GuessClock({
    guessesLeft,
    maxGuesses = 6,
  }: GuessClockProps) {
    const safeGuessesLeft = Math.max(0, guessesLeft);
  
    const digitColor =
      safeGuessesLeft === 0
        ? "text-red-500"
        : safeGuessesLeft <= 1
          ? "text-red-400"
          : safeGuessesLeft <= 2
            ? "text-orange-400"
            : "text-[#ff5a1f]";
  
    const glow =
      safeGuessesLeft <= 1
        ? "drop-shadow-[0_0_12px_rgba(248,113,113,0.95)]"
        : "drop-shadow-[0_0_12px_rgba(255,90,31,0.9)]";
  
    return (
      <section
        aria-label={`${safeGuessesLeft} guesses left`}
        className="flex flex-col items-center"
      >
        <div className="relative">
          {/* Top mounting bar */}
          <div className="mx-auto h-3 w-24 rounded-t-md border-x border-t border-zinc-500 bg-zinc-700" />
  
          {/* Outer shot-clock housing */}
          <div
            className="
              relative w-40 rounded-[1.1rem]
              border-[5px] border-zinc-600
              bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950
              p-2
              shadow-[0_14px_35px_rgba(0,0,0,0.55)]
            "
          >
            {/* Small corner screws */}
            <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-inner" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-inner" />
            <span className="absolute bottom-2 left-2 h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-inner" />
            <span className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-zinc-400 shadow-inner" />
  
            {/* Inner black display */}
            <div
              className="
                relative overflow-hidden rounded-lg
                border-2 border-zinc-950
                bg-black px-4 py-4
                shadow-[inset_0_0_22px_rgba(0,0,0,1)]
              "
            >
              {/* Faint glass reflection */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.08] to-transparent" />
  
              {/* LED digit */}
              <div
                key={safeGuessesLeft}
                className={`
                  font-shotclock
                  relative z-10
                  text-center text-[5rem]
                  leading-none tracking-[0.06em]
                  ${digitColor}
                  ${glow}
                  animate-[shotClockPulse_220ms_ease-out]
                `}
              >
                {safeGuessesLeft}
              </div>
  
              {/* Shot-clock label inside housing */}
              <div className="mt-2 border-t border-red-950/80 pt-2 text-center">
                <p className="text-[0.55rem] font-black uppercase tracking-[0.35em] text-zinc-400">
                  Shot Clock
                </p>
              </div>
            </div>
          </div>
  
          {/* Bottom mounting block */}
          <div className="mx-auto h-2 w-28 rounded-b-md border-x border-b border-zinc-700 bg-zinc-900" />
        </div>
  
        <div className="mt-3 text-center">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-zinc-300">
            Guesses Left
          </p>
  
          <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-zinc-600">
            {maxGuesses} total
          </p>
        </div>
      </section>
    );
  }