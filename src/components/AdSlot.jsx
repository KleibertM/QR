export default function AdSlot({ label = "Publicidad", size, className = "" }) {
  return (
    <section aria-label={`Espacio publicitario ${label}`} className={`flex w-full flex-col items-center ${className}`}>
      <span className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <div
        className={`ad-slot-container flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center ${size}`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <i className="fa-regular fa-rectangle-ad text-base text-indigo-400" aria-hidden="true" />
          <span>Espacio reservado para Anuncio ({label === "Publicidad de apoyo" ? "728x90 / Banner Adaptable" : "300x250"})</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-400">
          Los anuncios autorizados ayudan a mantener este generador gratuito para la comunidad.
        </p>
      </div>
    </section>
  );
}
