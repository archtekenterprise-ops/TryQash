const STACK = ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4"];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Frontend application
        </p>

        <h1 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          TryQash
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          This is the TryQash web frontend — a Next.js application written in
          TypeScript and styled with Tailwind CSS. The technical foundation is
          in place; product features and the Supabase backend integration are
          scheduled for later milestones.
        </p>

        <ul className="mt-8 flex flex-wrap gap-2">
          {STACK.map((item) => (
            <li
              key={item}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-slate-600">
            Run locally with{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800">
              npm run dev
            </code>
            . Setup instructions, environment configuration, and project
            structure are documented in{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-slate-800">
              README.md
            </code>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
