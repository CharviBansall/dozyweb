/** Simple iPhone frame with a nap Live Activity–style UI (no asset required). */
export function IPhoneNapMock() {
  return (
    <div
      className="relative mx-auto w-[200px] shrink-0 rounded-[2.25rem] border-[3px] border-neutral-800 bg-neutral-950 p-2 shadow-2xl sm:w-[220px]"
      aria-hidden
    >
      <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-neutral-900" />
      <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-black px-4 py-5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          Live Activity
        </p>
        <p className="mt-1 text-sm font-semibold text-white">Power nap</p>
        <div className="relative mx-auto my-4 flex h-28 w-28 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgb(38 38 38)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="hsl(210, 80%, 55%)"
              strokeWidth="6"
              strokeDasharray="180 264"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <p className="text-2xl font-semibold tabular-nums text-white">14:32</p>
            <p className="text-[10px] text-neutral-400">remaining</p>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-neutral-400">
          <span>Debt −42m</span>
          <span>Window open</span>
        </div>
      </div>
    </div>
  );
}
