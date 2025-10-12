export default function RadioPanel(){
  return (
    <aside className="card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="live-dot" />
        <span>Online Radio – Live</span>
      </div>
      <div className="rounded-xl h-28 bg-gradient-to-br from-brand-neon/30 via-brand-blue/20 to-transparent flex items-center justify-center">
        <span className="text-xs opacity-80">Lo‑Fi Beats 24/7 – Powered by Prime Gadget</span>
      </div>
    </aside>
  )
}
