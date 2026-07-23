import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-800 px-6">
      <header className="pt-8 text-center">
        <Image
          src="/ballknowledge-logo.png"
          alt="BallKnowledge Logo"
          width={360}
          height={360}
          priority
          className="mx-auto h-auto w-72 sm:w-80"
        />

        <p className="mt-4 text-2xl font-semibold tracking-wide text-zinc-100">
          Do you know ball?
        </p>
      </header>

      <section className="mt-10 flex justify-center">
        <Link href="/game" className="rounded-xl bg-orange-500 px-10 py-4 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:bg-orange-400">
        START
        </Link>
      </section>
    </main>
  );
}