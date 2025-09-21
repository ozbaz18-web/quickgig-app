export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-baseline gap-1 font-bold">
          <span className="text-2xl text-orange-500 leading-none">Q</span>
          <span className="text-lg -ml-1 tracking-tight">Gig</span>
        </div>
        <div className="text-sm text-zinc-600">ג׳וב בקליק.</div>
      </div>
    </header>
  );
}
