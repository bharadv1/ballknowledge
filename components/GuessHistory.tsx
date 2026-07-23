type Guess = {
    id: number;
    fullName: string;
  };
  
  type GuessHistoryProps = {
    guesses: Guess[];
    answerId: number;
  };
  
  export default function GuessHistory({
    guesses,
    answerId,
  }: GuessHistoryProps) {
    if (guesses.length === 0) {
      return null;
    }
  
    return (
      <section className="mx-auto mt-8 max-w-xl">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-zinc-500">
          Your Guesses
        </h2>
  
        <div className="space-y-2">
          {guesses.map((player, index) => {
            const isCorrect = player.id === answerId;
  
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                  isCorrect
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-white/10 bg-zinc-900"
                }`}
              >
                <span className="font-semibold">
                  {player.fullName}
                </span>
  
                <span
                  className={`text-sm font-bold uppercase tracking-wide ${
                    isCorrect ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isCorrect ? "Correct" : `Guess ${index + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }