import { useCallback, useState } from "react";
import AdSlot from "./components/AdSlot.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import HistorySection from "./components/HistorySection.jsx";
import QRForm from "./components/QRForm.jsx";
import QRPreview from "./components/QRPreview.jsx";
import ToastContainer from "./components/ToastContainer.jsx";
import { addHistoryItem, MAX_HISTORY, readHistory, STORAGE_KEY, writeHistory } from "./utils/history.js";
import { COLOR_PALETTES, createQRContent, INITIAL_FORM } from "./utils/qr.js";

export default function App() {
  const [type, setType] = useState("link");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [history, setHistory] = useState(readHistory);
  const [qr, setQr] = useState(() => ({
    ...createQRContent("link", INITIAL_FORM),
    id: "",
    type: "link",
    colorDark: COLOR_PALETTES[0].dark,
    colorLight: COLOR_PALETTES[0].light,
  }));
  const [toasts, setToasts] = useState([]);
  const palette = COLOR_PALETTES[paletteIndex];

  const notify = useCallback((message, toastType = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type: toastType }]);
    window.setTimeout(() => {
      setToasts((items) => items.filter((item) => item.id !== id));
    }, 3500);
  }, []);

  const generate = useCallback((shouldSave = true) => {
    const item = {
      ...createQRContent(type, form),
      id: `${Date.now()}-${Math.random()}`,
      type,
      colorDark: palette.dark,
      colorLight: palette.light,
      form: { ...form },
      date: new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setQr(item);

    if (!shouldSave) return;
    try {
      const result = addHistoryItem(item);
      setHistory(result.history);
      if (result.duplicate) {
        notify("Código actualizado en pantalla.", "info");
      } else if (result.removedTitle) {
        notify(`¡Código creado! Se retiró "${result.removedTitle}" por el límite de ${MAX_HISTORY}.`, "warning");
      } else {
        notify("¡Código QR generado y guardado en tu historial!", "success");
      }
    } catch (error) {
      console.error("No se pudo guardar el código en el historial.", error);
      notify("El código se generó, pero no se pudo guardar en el historial.", "warning");
    }
  }, [form, notify, palette, type]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleRestore = (item) => {
    const restoredForm = { ...INITIAL_FORM, ...(item.form ?? {}) };
    if (!item.form) {
      if (item.type === "link") restoredForm.link = item.content;
      if (item.type === "image") restoredForm.image = item.content;
      if (item.type === "text") restoredForm.text = item.content;
    }
    setForm(restoredForm);
    setType(item.type);
    const restoredPalette = COLOR_PALETTES.findIndex((color) => color.dark === item.colorDark && color.light === item.colorLight);
    setPaletteIndex(restoredPalette >= 0 ? restoredPalette : 0);
    setQr(item);
    notify(`Código "${item.title}" cargado al visor`, "info");
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    try {
      const nextHistory = history.filter((item) => item.id !== id);
      writeHistory(nextHistory);
      setHistory(nextHistory);
      notify("Código retirado del historial.", "info");
    } catch (error) {
      console.error("No se pudo eliminar el código del historial.", error);
      notify("No se pudo eliminar el código del historial.", "warning");
    }
  };

  const handleClear = () => {
    if (history.length === 0) {
      notify("El historial ya está vacío.", "info");
      return;
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      notify("Historial vaciado correctamente.", "success");
    } catch (error) {
      console.error("No se pudo vaciar el historial.", error);
      notify("No se pudo vaciar el historial.", "warning");
    }
  };

  const download = (format) => {
    const canvas = document.querySelector("#qrcode-container canvas");
    const image = document.querySelector("#qrcode-container img");
    const fileName = (qr.title || "codigo-qr-iglesia").toLowerCase().replace(/[^a-z0-9]/gi, "_");
    let dataUrl;

    if (canvas) {
      if (format === "jpg") {
        const outputCanvas = document.createElement("canvas");
        outputCanvas.width = canvas.width;
        outputCanvas.height = canvas.height;
        const context = outputCanvas.getContext("2d");
        if (!context) {
          notify("No se pudo preparar la imagen para descargar.", "warning");
          return;
        }
        context.fillStyle = palette.light;
        context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
        context.drawImage(canvas, 0, 0);
        dataUrl = outputCanvas.toDataURL("image/jpeg", 0.95);
      } else {
        dataUrl = canvas.toDataURL("image/png");
      }
    } else if (image?.src) {
      dataUrl = image.src;
    } else {
      notify("No se encontró la imagen del QR para descargar.", "warning");
      return;
    }

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${fileName}.${format}`;
    link.click();
    notify(`Descargando ${fileName}.${format}...`, "success");
  };

  const copy = async () => {
    if (!qr.content) {
      notify("No hay datos para copiar.", "warning");
      return;
    }
    try {
      await navigator.clipboard.writeText(qr.content);
      notify("¡Texto o enlace copiado al portapapeles!", "success");
    } catch (error) {
      console.error("No se pudo copiar el contenido del código QR.", error);
      notify("No se pudo copiar automáticamente. Revisa los permisos del navegador.", "warning");
    }
  };

  const handleQRRenderError = useCallback((message) => notify(message, "warning"), [notify]);

  return (
    <div className="flex min-h-screen flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:px-6">
        <AdSlot label="Publicidad de apoyo" size="min-h-[90px] max-w-4xl" />
        <section className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-indigo-50/50 to-emerald-50 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="space-y-1">
            <h2 className="font-title flex items-center gap-2 text-xl font-bold text-slate-800">Bienvenido, hermano/a <span>🕊️</span></h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">Crea folletos, comparte cultos en vivo, avisos o facilita el acceso al Wi-Fi del templo. Los códigos generados funcionan para siempre y no necesitan registro ni pago.</p>
          </div>
          <a href="#historial-section" className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50">
            <i className="fa-solid fa-clock-rotate-left text-indigo-500" aria-hidden="true" /> Ver mis últimos 10 QR
          </a>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <QRForm
              form={form}
              type={type}
              setType={setType}
              paletteIndex={paletteIndex}
              setPaletteIndex={setPaletteIndex}
              onGenerate={() => generate(true)}
              onChange={handleFormChange}
            />
            <AdSlot label="Publicidad" size="min-h-[250px] max-w-[320px]" />
          </div>
          <div className="lg:col-span-5">
            <QRPreview
              qr={qr}
              palette={palette}
              onDownload={download}
              onCopy={copy}
              onPrint={() => window.print()}
              onError={handleQRRenderError}
            />
          </div>
        </div>

        <HistorySection history={history} onRestore={handleRestore} onDelete={handleDelete} onClear={handleClear} />

        <section className="rounded-3xl border border-slate-200/70 bg-slate-50 p-6 sm:p-7">
          <h2 className="mb-3 flex items-center gap-2 font-title text-base font-bold text-slate-800">
            <i className="fa-solid fa-lightbulb text-amber-500" aria-hidden="true" /> Ideas prácticas para tu congregación o ministerio
          </h2>
          <div className="grid gap-4 text-xs leading-relaxed text-slate-600 md:grid-cols-3">
            <Idea icon="fa-wifi" title="Cartel de Wi-Fi en el Atrio">Imprime el QR de Wi-Fi y colócalo en la recepción o las paredes del templo.</Idea>
            <Idea icon="fa-newspaper" title="Boletín y Escuela Dominical">Comparte lecciones o devocionales en línea y facilita su lectura desde el teléfono.</Idea>
            <Idea icon="fa-heart" title="Peticiones y Contacto Pastoral">Crea un QR para el contacto pastoral o un formulario de oración.</Idea>
          </div>
        </section>
      </main>
      <Footer />
      <ToastContainer toasts={toasts} />
    </div>
  );
}

function Idea({ icon, title, children }) {
  return (
    <article className="space-y-1 rounded-2xl border border-slate-200/60 bg-white p-4">
      <h3 className="font-bold text-slate-800"><i className={`fa-solid ${icon} mr-1.5 text-indigo-500`} aria-hidden="true" />{title}</h3>
      <p>{children}</p>
    </article>
  );
}
