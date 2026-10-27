export default function ToastContainer({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} role="status" className={`pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold text-white shadow-lg ${toast.type === "success" ? "bg-emerald-800" : toast.type === "warning" ? "bg-amber-800" : "bg-indigo-900"}`}>
          <i className={`fa-solid ${toast.type === "warning" ? "fa-triangle-exclamation" : toast.type === "info" ? "fa-circle-info" : "fa-circle-check"}`} aria-hidden="true" />
          {toast.message}
        </div>
      ))}
    </div>
  );
}
