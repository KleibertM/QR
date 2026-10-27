export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-amber-100/60 bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-300 text-white shadow-sm">
            <i className="fa-solid fa-church text-xl" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-title text-xl font-bold leading-tight text-slate-800">
              QR Parroquial &amp; Comunidad
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Códigos QR eternos, gratuitos y fáciles de usar
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
          <i className="fa-solid fa-shield-halved" aria-hidden="true" />
          <span>100% Estáticos • No caducan nunca</span>
        </div>
      </div>
    </header>
  );
}
