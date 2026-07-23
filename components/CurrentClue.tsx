type CurrentClueProps = {
    clue: string;
    clueNumber: number;
    totalClues: number;
  };
  
  export default function CurrentClue({
    clue,
    clueNumber,
    totalClues,
  }: CurrentClueProps) {
    return (
      <section className="mb-8 rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
            Player of the Day
          </p>
  
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Clue {clueNumber} of {totalClues}
          </p>
        </div>
  
        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-4">
          <p className="text-lg leading-relaxed text-zinc-100">
            {clue}
          </p>
        </div>
      </section>
    );
  }