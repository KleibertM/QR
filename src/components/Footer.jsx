export default function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200/60 bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7 text-center" aria-labelledby="advertising-contact-title">
          <h2 id="advertising-contact-title" className="font-title text-base font-bold text-slate-700">
            ¿Quieres anunciarte?
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Contáctame para consultas y espacios de publicidad.
          </p>
          <div className="mt-3 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
            <a
              href="mailto:kleibertmedina@gmail.com"
              className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:text-indigo-800"
            >
              <i className="fa-solid fa-envelope" aria-hidden="true" />
              kleibertmedina@gmail.com
            </a>
            <a
              href="https://wa.me/51976963819"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800"
            >
              <i className="fa-brands fa-whatsapp" aria-hidden="true" />
              WhatsApp: +51 976 963 819
            </a>
          </div>
        </section>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-5 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-dove text-indigo-400" aria-hidden="true" />
            <span>Herramienta comunitaria libre y gratuita para templos, ministerios y comunidades.</span>
          </div>
          <span>Desarrollado con dedicación para bendecir a tu congregación.</span>
        </div>
      </div>
    </footer>
  );
}
