export const IMAGE_LIBRARY_KEY = "iglesia_qr_images_v1";
export const MAX_SAVED_IMAGES = 10;

const MAX_IMAGE_DATA_URL_LENGTH = 165_000;

export function readImageLibrary() {
  try {
    const stored = localStorage.getItem(IMAGE_LIBRARY_KEY);
    if (!stored) return [];

    const images = JSON.parse(stored);
    return Array.isArray(images) ? images.slice(0, MAX_SAVED_IMAGES) : [];
  } catch (error) {
    console.error("No se pudo leer la biblioteca local de imágenes.", error);
    return [];
  }
}

export function saveImageToLibrary(image) {
  const images = readImageLibrary();
  const removedImage = images.length >= MAX_SAVED_IMAGES ? images[images.length - 1] : null;
  const nextImages = [
    { ...image, id: `${Date.now()}-${Math.random()}`, savedAt: new Date().toISOString() },
    ...images,
  ].slice(0, MAX_SAVED_IMAGES);

  localStorage.setItem(IMAGE_LIBRARY_KEY, JSON.stringify(nextImages));
  return { images: nextImages, removedImage };
}

export function removeImageFromLibrary(id) {
  const nextImages = readImageLibrary().filter((image) => image.id !== id);
  localStorage.setItem(IMAGE_LIBRARY_KEY, JSON.stringify(nextImages));
  return nextImages;
}

export async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen válido.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, 1400 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("El navegador no pudo procesar la imagen.");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const quality = Math.max(0.35, 0.82 - attempt * 0.07);
      const blob = await canvasToBlob(canvas, "image/jpeg", quality);
      if (blob.size <= 120_000) {
        const dataUrl = await blobToDataUrl(blob);
        if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
          throw new Error("La imagen procesada supera el espacio permitido para el almacenamiento local.");
        }
        return {
          name: file.name,
          dataUrl,
          size: blob.size,
        };
      }

      canvas.width = Math.max(1, Math.round(canvas.width * 0.82));
      canvas.height = Math.max(1, Math.round(canvas.height * 0.82));
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    throw new Error("No se pudo reducir la imagen lo suficiente para guardarla localmente.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("No se pudo abrir la imagen seleccionada."));
    image.src = source;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("El navegador no pudo preparar la imagen para guardarla."));
    }, type, quality);
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen procesada."));
    reader.readAsDataURL(blob);
  });
}
