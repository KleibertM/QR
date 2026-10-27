import { COLOR_PALETTES, QR_TYPES } from "../utils/qr.js";
import ImageDropzone from "./ImageDropzone.jsx";

function renderFields(type, form, onChange, imageProps) {
  const fields = {
    link: (
      <>
        <label className="field-label" htmlFor="link-url">Dirección web o enlace (URL)</label>
        <input id="link-url" type="url" name="link" value={form.link} onChange={onChange} className="field-input" placeholder="https://www.tuiglesia.com" />
        <p className="field-hint">Comparte transmisiones, donaciones, peticiones de oración o tu página oficial.</p>
      </>
    ),
    image: (
      <>
        <ImageDropzone {...imageProps} />
        <p className="field-hint">
          La vista previa solo está disponible en este dispositivo. Para que el QR abra la imagen a otras personas, primero súbela a un servicio público (Drive, Dropbox o tu sitio web) y pega su enlace aquí.
        </p>
        <label className="field-label" htmlFor="image-url">Enlace directo a tu imagen o afiche digital</label>
        <input id="image-url" type="url" name="image" value={form.image} onChange={onChange} className="field-input" placeholder="https://drive.google.com/..." />
        <p className="field-hint">Sube tu afiche a Drive, Dropbox, OneDrive o Imgur y permite que cualquiera con el enlace lo vea.</p>
      </>
    ),
    wifi: (
      <>
        <label className="field-label" htmlFor="wifi-ssid">Nombre de la red Wi-Fi (SSID)</label>
        <input id="wifi-ssid" name="ssid" value={form.ssid} onChange={onChange} className="field-input" placeholder="Ej: Templo_Comunidad_Invitados" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="wifi-pass">Clave del Wi-Fi</label>
            <input id="wifi-pass" name="password" value={form.password} onChange={onChange} className="field-input" placeholder="Clave de la red" />
          </div>
          <div>
            <label className="field-label" htmlFor="wifi-type">Seguridad</label>
            <select id="wifi-type" name="wifiSecurity" value={form.wifiSecurity} onChange={onChange} className="field-input">
              <option value="WPA">WPA / WPA2 (Más común)</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Sin contraseña (Abierta)</option>
            </select>
          </div>
        </div>
        <p className="field-hint">Quienes escaneen este QR podrán conectarse sin escribir la clave.</p>
      </>
    ),
    text: (
      <>
        <label className="field-label" htmlFor="text-content">Versículo, mensaje de ánimo o aviso</label>
        <textarea id="text-content" name="text" value={form.text} onChange={onChange} rows="3" className="field-input resize-none" placeholder="Escribe aquí tu mensaje..." />
        <p className="field-hint">El mensaje se mostrará directamente en pantalla, sin conexión a internet.</p>
      </>
    ),
    contact: (
      <>
        <p className="field-label">Tarjeta de Contacto Pastoral (vCard)</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input aria-label="Nombre y apellidos" name="contactName" value={form.contactName} onChange={onChange} className="field-input" placeholder="Pastor Juan Pérez" />
          <input aria-label="Ministerio o cargo" name="contactRole" value={form.contactRole} onChange={onChange} className="field-input" placeholder="Pastor Principal / Jóvenes" />
          <input aria-label="Teléfono o WhatsApp" name="contactPhone" value={form.contactPhone} onChange={onChange} type="tel" className="field-input" placeholder="+51 987 654 321" />
          <input aria-label="Correo electrónico" name="contactEmail" value={form.contactEmail} onChange={onChange} type="email" className="field-input" placeholder="pastoral@tuiglesia.org" />
        </div>
        <p className="field-hint">El teléfono ofrecerá guardar el contacto directamente en su agenda.</p>
      </>
    ),
  };
  return fields[type];
}

const typeDescriptions = {
  link: "YouTube, Facebook, Web",
  image: "Foto en Drive, Dropbox...",
  wifi: "Conexión con 1 escaneo",
  text: "Mensaje o bendición",
  contact: "Guarda teléfono y correo",
};

export default function QRForm({ type, setType, paletteIndex, setPaletteIndex, onGenerate, onChange, form, imageLibrary, selectedImage, onImageUpload, onImageSelect, onImageDelete }) {
  return (
    <form
      className="space-y-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"
      onSubmit={(event) => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <section>
        <Step number="1" title="¿Qué deseas compartir con este código?" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {Object.entries(QR_TYPES).map(([key, info]) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              aria-pressed={type === key}
              className={`flex min-h-24 flex-col justify-between rounded-2xl border p-3 text-left transition-all ${
                type === key
                  ? "border-indigo-300 bg-indigo-50/80 text-indigo-900 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              } ${key === "contact" ? "col-span-2 sm:col-span-2" : ""}`}
            >
              <i className={`fa-solid ${info.icon} mb-2 text-lg ${info.iconClass}`} aria-hidden="true" />
              <span className="text-sm font-bold leading-tight">{key === "contact" ? "Contacto Pastoral / Ministerio" : key === "text" ? "Versículo / Texto" : key === "wifi" ? "Clave Wi-Fi" : key === "image" ? "Folleto o Imagen" : "Enlace Web"}</span>
              <span className="mt-0.5 text-[11px] text-slate-500">{typeDescriptions[key]}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <Step number="2" title="Completa la información" />
        <label className="field-label" htmlFor="qr-label-input">Nombre de referencia para tu código <span className="font-normal text-slate-400">(Visible en tu historial)</span></label>
        <input id="qr-label-input" name="title" value={form.title} onChange={onChange} className="field-input mb-4" placeholder="Ej: Transmisión Culto Dominical" />
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          {renderFields(type, form, onChange, {
            images: imageLibrary,
            selectedImage,
            onUpload: onImageUpload,
            onSelect: onImageSelect,
            onDelete: onImageDelete,
          })}
        </div>
      </section>

      <section>
        <Step number="3" title="Elige la combinación de color" />
        <div className="flex flex-wrap gap-2.5">
          {COLOR_PALETTES.map((palette, index) => (
            <button
              key={palette.label}
              type="button"
              onClick={() => setPaletteIndex(index)}
              aria-pressed={paletteIndex === index}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 ${
                paletteIndex === index ? "border-2 border-indigo-500 bg-slate-50" : "border border-slate-200 bg-white"
              }`}
            >
              <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: palette.swatch }} />
              {palette.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Usamos combinaciones de alto contraste para facilitar el escaneo.</p>
      </section>

      <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 px-6 py-3.5 font-title text-base font-bold text-white shadow-md transition hover:opacity-95">
        <i className="fa-solid fa-wand-magic-sparkles mr-2" aria-hidden="true" />
        Generar y Actualizar Código QR
      </button>
    </form>
  );
}

function Step({ number, title }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">{number}</span>
      <h2 className="font-title text-base font-bold text-slate-800">{title}</h2>
    </div>
  );
}
