import { useEffect, useMemo, useState } from "react";

const EMPTY_IMAGES = [];

export default function ImageDropzone({ images = EMPTY_IMAGES, selectedImage, onUpload, onSelect, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const previewUrls = useMemo(
    () => Object.fromEntries(images.map((image) => [image.id, URL.createObjectURL(image.blob)])),
    [images],
  );

  useEffect(() => {
    return () => Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const selectImage = async (image) => {
    if (!image) return;
    if (!image.type?.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      return;
    }

    setError("");
    try {
      await onUpload(image);
    } catch (uploadError) {
      setError(uploadError.message || "No se pudo guardar la imagen en este navegador.");
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    selectImage(event.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor="image-upload"
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
          isDragging
            ? "border-indigo-400 bg-indigo-50"
            : "border-slate-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
        }`}
      >
        <i className="fa-regular fa-images mb-2 text-2xl text-indigo-400" aria-hidden="true" />
        <span className="text-sm font-bold text-slate-700">Selecciona una imagen o arrástrala aquí</span>
        <span className="mt-1 text-[11px] text-slate-500">Desde la galería del celular o desde tu ordenador</span>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            selectImage(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>

      {error && <p role="alert" className="text-xs font-semibold text-rose-600">{error}</p>}

      {selectedImage && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
          <img src={previewUrls[selectedImage.id] ?? ""} alt={`Vista previa de ${selectedImage.name}`} className="h-16 w-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-700">{selectedImage.name}</p>
            <p className="text-[11px] text-slate-500">Guardada en este navegador · {(selectedImage.size / 1024).toFixed(0)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="rounded-lg px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50"
          >
            Quitar selección
          </button>
        </div>
      )}

      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold text-slate-700">Imágenes guardadas en este dispositivo</p>
          <span className="text-[11px] text-slate-500">{images.length} / 10</span>
        </div>
        {images.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg border border-slate-200">
                <button type="button" onClick={() => onSelect(image)} className="block w-full text-left hover:bg-indigo-50">
                  <img src={previewUrls[image.id] ?? ""} alt="" className="h-20 w-full object-cover" />
                  <span className="block truncate px-2 py-1 text-[10px] font-semibold text-slate-600">{image.name}</span>
                </button>
                <div className="flex items-center justify-between border-t border-slate-100 px-2 py-1">
                  <button type="button" onClick={() => onSelect(image)} className="text-[10px] font-bold text-indigo-600 hover:underline">Cargar</button>
                  <button type="button" onClick={() => onDelete(image.id)} className="text-[10px] font-bold text-rose-600 hover:underline">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-slate-500">Las imágenes que agregues aparecerán aquí. Se conservan las 10 más recientes.</p>
        )}
      </div>
    </div>
  );
}
