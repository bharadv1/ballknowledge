type PlayerAttributes = {
    id: number;
    fullName: string;
    draftYear: number | null;
    draftPick: number | null;
    college: string | null;
  };
  
  type GuessFeedbackProps = {
    guess: PlayerAttributes;
    answer: PlayerAttributes;
    guessNumber: number;
  };
  
  function normalizeCollege(college: string | null) {
    return college?.trim().toLowerCase() ?? null;
  }
  
  export default function GuessFeedback({
    guess,
    answer,
    guessNumber,
  }: GuessFeedbackProps) {
    const draftYearMatches = guess.draftYear === answer.draftYear;
    const draftPickMatches = guess.draftPick === answer.draftPick;
  
    const collegeMatches =
      normalizeCollege(guess.college) === normalizeCollege(answer.college);
  
    function getDraftYearFeedback() {
      if (draftYearMatches) {
        return "Same";
      }
  
      if (guess.draftYear === null || answer.draftYear === null) {
        return "No comparison";
      }
  
      return answer.draftYear < guess.draftYear ? "Earlier" : "Later";
    }
  
    function getDraftPickFeedback() {
      if (draftPickMatches) {
        return "Same";
      }
  
      if (guess.draftPick === null || answer.draftPick === null) {
        return "No comparison";
      }
  
      return answer.draftPick < guess.draftPick
        ? "Earlier pick"
        : "Later pick";
    }
  
    return (
      <article className="rounded-2xl border border-white/10 bg-zinc-900 p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-white">
            {guess.fullName}
          </h3>
  
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Guess {guessNumber}
          </span>
        </div>
  
        <div className="grid gap-3 sm:grid-cols-3">
          <div
            className={`rounded-xl border p-4 ${
              draftYearMatches
                ? "border-green-500/40 bg-green-500/10"
                : "border-orange-500/40 bg-orange-500/10"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Draft Year
            </p>
  
            <p className="mt-2 text-xl font-black text-white">
              {guess.draftYear ?? "Undrafted"}
            </p>
  
            <p
              className={`mt-1 text-sm font-bold ${
                draftYearMatches ? "text-green-400" : "text-orange-400"
              }`}
            >
              {draftYearMatches ? "✓ " : ""}
              {getDraftYearFeedback()}
            </p>
          </div>
  
          <div
            className={`rounded-xl border p-4 ${
              draftPickMatches
                ? "border-green-500/40 bg-green-500/10"
                : "border-orange-500/40 bg-orange-500/10"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Draft Pick
            </p>
  
            <p className="mt-2 text-xl font-black text-white">
              {guess.draftPick ?? "Undrafted"}
            </p>
  
            <p
              className={`mt-1 text-sm font-bold ${
                draftPickMatches ? "text-green-400" : "text-orange-400"
              }`}
            >
              {draftPickMatches ? "✓ " : ""}
              {getDraftPickFeedback()}
            </p>
          </div>
  
          <div
            className={`rounded-xl border p-4 ${
              collegeMatches
                ? "border-green-500/40 bg-green-500/10"
                : "border-red-500/30 bg-red-500/10"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              College
            </p>
  
            <p className="mt-2 break-words text-xl font-black text-white">
              {guess.college ?? "None"}
            </p>
  
            <p
              className={`mt-1 text-sm font-bold ${
                collegeMatches ? "text-green-400" : "text-red-400"
              }`}
            >
              {collegeMatches ? "✓ Same" : "✕ Different"}
            </p>
          </div>
        </div>
      </article>
    );
  }