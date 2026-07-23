type AllCluesProps = {
    clues: string[];
  };
  
  export default function AllClues({ clues }: AllCluesProps) {
    return (
      <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-xl">
        <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
          All Clues
        </h2>
  
        <div className="mt-5 space-y-3">
          {clues.map((clue, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-black/25 px-4 py-4"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Clue {index + 1}
              </p>
  
              <p className="mt-2 text-lg leading-relaxed text-zinc-100">
                {clue}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }