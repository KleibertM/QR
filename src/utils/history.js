export const STORAGE_KEY = "iglesia_qr_history_v1";
export const MAX_HISTORY = 10;

export function readHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch (error) {
    console.error("No se pudo leer el historial de códigos QR.", error);
    return [];
  }
}

export function writeHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function addHistoryItem(item) {
  const history = readHistory();
  if (history[0]?.content === item.content && history[0]?.title === item.title) {
    return { history, duplicate: true, removedTitle: null };
  }

  const removedItem = history.length >= MAX_HISTORY ? history.pop() : null;
  const nextHistory = [item, ...history];
  writeHistory(nextHistory);
  return { history: nextHistory, duplicate: false, removedTitle: removedItem?.title ?? null };
}
