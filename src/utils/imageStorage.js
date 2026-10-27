export const MAX_SAVED_IMAGES = 10;

const DATABASE_NAME = "iglesia-qr-local";
const DATABASE_VERSION = 1;
const IMAGE_STORE = "images";
const LEGACY_STORAGE_KEY = "iglesia_qr_images_v1";

let databasePromise;
let migrationPromise;

function openDatabase() {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("Este navegador no permite guardar imágenes localmente."));
  }

  if (!databasePromise) {
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(IMAGE_STORE)) {
          database.createObjectStore(IMAGE_STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        databasePromise = undefined;
        reject(request.error ?? new Error("No se pudo abrir la biblioteca local de imágenes."));
      };
      request.onblocked = () => reject(new Error("Cierra otras pestañas de esta aplicación para actualizar el almacenamiento."));
    });
  }

  return databasePromise;
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Falló una operación del almacenamiento local."));
  });
}

function transactionComplete(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error ?? new Error("Se canceló la operación de almacenamiento."));
    transaction.onerror = () => reject(transaction.error ?? new Error("Falló una operación de almacenamiento."));
  });
}

function newestFirst(images) {
  return images.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

async function migrateLegacyImages(database) {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      let legacyImages;
      try {
        legacyImages = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || "[]");
      } catch (error) {
        console.error("No se pudo migrar la antigua biblioteca de imágenes.", error);
        return;
      }

      if (!Array.isArray(legacyImages) || legacyImages.length === 0) return;

      const readTransaction = database.transaction(IMAGE_STORE, "readonly");
      const readCompleted = transactionComplete(readTransaction);
      const existing = await requestResult(readTransaction.objectStore(IMAGE_STORE).getAll());
      await readCompleted;
      if (existing.length > 0) {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return;
      }

      try {
        const migrated = await Promise.all(
          legacyImages.slice(0, MAX_SAVED_IMAGES).map(async (image) => {
            const blob = await fetch(image.dataUrl).then((response) => response.blob());
            return {
              id: image.id || `${Date.now()}-${Math.random()}`,
              name: image.name || "Imagen guardada",
              blob,
              size: blob.size,
              savedAt: image.savedAt || new Date().toISOString(),
            };
          }),
        );
        const transaction = database.transaction(IMAGE_STORE, "readwrite");
        const completed = transactionComplete(transaction);
        const store = transaction.objectStore(IMAGE_STORE);
        migrated.forEach((image) => store.put(image));
        await completed;
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (error) {
        migrationPromise = undefined;
        throw error;
      }
    })();
  }

  return migrationPromise;
}

export async function listSavedImages() {
  const database = await openDatabase();
  await migrateLegacyImages(database);
  const transaction = database.transaction(IMAGE_STORE, "readonly");
  const completed = transactionComplete(transaction);
  const images = await requestResult(transaction.objectStore(IMAGE_STORE).getAll());
  await completed;
  return newestFirst(images).slice(0, MAX_SAVED_IMAGES);
}

export async function saveImage(image) {
  const database = await openDatabase();
  await migrateLegacyImages(database);

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(IMAGE_STORE, "readwrite");
    const store = transaction.objectStore(IMAGE_STORE);
    const request = store.getAll();
    let result;

    request.onsuccess = () => {
      const images = newestFirst(request.result);
      const removedImage = images.length >= MAX_SAVED_IMAGES ? images[MAX_SAVED_IMAGES - 1] : null;
      if (removedImage) store.delete(removedImage.id);

      const savedImage = {
        ...image,
        id: `${Date.now()}-${Math.random()}`,
        savedAt: new Date().toISOString(),
      };
      store.put(savedImage);
      result = {
        images: [savedImage, ...images.filter((item) => item.id !== removedImage?.id)]
          .slice(0, MAX_SAVED_IMAGES),
        removedImage,
      };
    };

    transaction.oncomplete = () => resolve(result);
    transaction.onabort = () => reject(transaction.error ?? new Error("No se pudo guardar la imagen."));
    transaction.onerror = () => reject(transaction.error ?? new Error("No se pudo guardar la imagen."));
  });
}

export async function deleteSavedImage(id) {
  const database = await openDatabase();
  const transaction = database.transaction(IMAGE_STORE, "readwrite");
  const completed = transactionComplete(transaction);
  transaction.objectStore(IMAGE_STORE).delete(id);
  await completed;
  return listSavedImages();
}

export async function compressImage(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecciona un archivo de imagen válido.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, 1800 / Math.max(image.naturalWidth, image.naturalHeight));
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
      if (blob.size <= 350_000) {
        return { name: file.name, blob, size: blob.size };
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
