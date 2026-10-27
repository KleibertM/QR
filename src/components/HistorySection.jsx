import { MAX_HISTORY } from "../utils/history.js";
import { QR_TYPES } from "../utils/qr.js";

export default function HistorySection({ history, onRestore, onDelete, onClear }) {
  return (
    <section id="historial-section" className="space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-title text-lg font-bold text-slate-800">Tus Últimos Códigos Generados</h2>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-800">{history.length} / {MAX_HISTORY}</span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">Guardados de forma privada en este navegador. Máximo 10 elementos.</p>
        </div>
        <button type="button" onClick={onClear} className="rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">
          <i className="fa-regular fa-trash-can mr-1" aria-hidden="true" /> Borrar Todo el Historial
        </button>
      </div>

      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-900">
        <i className="fa-solid fa-circle-info mr-2 text-amber-600" aria-hidden="true" />
        Se conservan tus 10 códigos más recientes. Al generar el número 11, el más antiguo se retira automáticamente.
      </div>

      {history.length ? (
        <div className="grid grid-cols-1 gap-3.5 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {history.map((item) => {
            const typeInfo = QR_TYPES[item.type] ?? QR_TYPES.link;
            return (
              <article key={item.id} className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 text-xs transition hover:bg-white hover:shadow-sm">
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-1">
                    <span className="truncate rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      <i className={`fa-solid ${typeInfo.icon} mr-1`} aria-hidden="true" />{item.typeLabel}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">{item.date}</span>
                  </div>
                  <h3 className="mb-1 truncate font-bold text-slate-800" title={item.title}>{item.title}</h3>
                  <p className="mb-3 break-all rounded-lg border border-slate-100 bg-white p-1.5 font-mono text-[11px] text-slate-500 line-clamp-2">{item.content}</p>
                </div>
                <div className="flex items-center justify-between gap-1 border-t border-slate-200/60 pt-2">
                  <button type="button" onClick={() => onRestore(item)} className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline">
                    <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /> Cargar
                  </button>
                  <button type="button" onClick={() => onDelete(item.id)} className="rounded-md p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700" title="Eliminar este código" aria-label={`Eliminar ${item.title}`}>
                    <i className="fa-regular fa-trash-can" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2 py-8 text-center text-slate-400">
          <i className="fa-solid fa-box-archive text-3xl text-slate-300" aria-hidden="true" />
          <p className="text-xs font-semibold">Aún no has generado ningún código QR.</p>
          <p className="text-[11px]">Genera uno arriba y quedará guardado aquí para descargarlo cuando quieras.</p>
        </div>
      )}
    </section>
  );
}
