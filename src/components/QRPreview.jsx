import { useEffect, useRef } from "react";
import { renderQRCode } from "../utils/qr.js";

export default function QRPreview({ qr, palette, onDownload, onCopy, onPrint, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!qr.content || !containerRef.current) return;
    try {
      renderQRCode(containerRef.current, qr.content, palette.dark, palette.light);
    } catch (error) {
      onError(error.message);
    }
  }, [qr, palette, onError]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col items-center rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Código QR Estático
        </div>
        <h2 className="font-title text-lg font-bold text-slate-800">{qr.title || "Tu código aparecerá aquí"}</h2>
        <p className="mt-1 max-w-full break-all text-xs text-slate-500">{qr.typeLabel}</p>
        <div id="print-area" className="my-5 rounded-2xl border border-slate-100 bg-white p-3">
          <div ref={containerRef} id="qrcode-container" className="flex min-h-[240px] min-w-[240px] items-center justify-center" />
        </div>
        {qr.content && <p className="mb-4 max-w-full break-all text-[11px] text-slate-500">{qr.content}</p>}
        <div className="grid w-full grid-cols-2 gap-2">
          <button type="button" onClick={() => onDownload("png")} className="action-button bg-indigo-600 text-white hover:bg-indigo-700">
            <i className="fa-solid fa-download" aria-hidden="true" /> Descargar PNG
          </button>
          <button type="button" onClick={() => onDownload("jpg")} className="action-button bg-slate-100 text-slate-700 hover:bg-slate-200">
            <i className="fa-regular fa-image" aria-hidden="true" /> Descargar JPG
          </button>
          <button type="button" onClick={onPrint} className="action-button bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
            <i className="fa-solid fa-print" aria-hidden="true" /> Imprimir QR
          </button>
          <button type="button" onClick={onCopy} className="action-button bg-slate-50 text-slate-700 hover:bg-slate-100">
            <i className="fa-regular fa-copy" aria-hidden="true" /> Copiar datos
          </button>
        </div>
        <p className="mt-4 border-t border-slate-100 pt-4 text-[11px] text-slate-400">
          <i className="fa-solid fa-infinity mr-1 text-indigo-400" aria-hidden="true" />
          Este código puede imprimirse o proyectarse y funcionará indefinidamente.
        </p>
      </div>
    </section>
  );
}
