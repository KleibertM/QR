export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200/60 bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-xs text-slate-500 sm:flex-row sm:px-6 sm:text-left">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-dove text-indigo-400" aria-hidden="true" />
          <span>Herramienta comunitaria libre y gratuita para templos, ministerios y comunidades.</span>
        </div>
        <span>Desarrollado con dedicación para bendecir a tu congregación.</span>
      </div>
    </footer>
  );
}
