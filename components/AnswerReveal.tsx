import Image from "next/image";

type AnswerRevealProps = {
  fullName: string;
  image?: string | null;
  wonGame: boolean;
  guesses: number;
};

export default function AnswerReveal({
  fullName,
  image,
  wonGame,
  guesses,
}: AnswerRevealProps) {
  return (
    <section className="mx-auto mt-8 max-w-xl rounded-2xl border border-orange-500/30 bg-zinc-900 p-6 text-center shadow-xl">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
        Player of the Day
      </p>

      <div className="mx-auto mt-5 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-orange-500/40 bg-zinc-800 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
        {image ? (
          <Image
            src={image}
            alt={fullName}
            width={160}
            height={160}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-5xl font-black text-zinc-400">
            {fullName.charAt(0)}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-3xl font-black text-white">
        {fullName}
      </h2>

      <p
        className={`mt-2 font-semibold ${
          wonGame ? "text-green-400" : "text-red-400"
        }`}
      >
        {wonGame
          ? `You got it in ${guesses} ${guesses === 1 ? "guess" : "guesses"}.`
          : "Better luck tomorrow."}
      </p>
    </section>
  );
}