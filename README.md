# Generador QR para iglesias y comunidades

Aplicación React construida con Vite. La interfaz se divide en componentes dentro de `src/components`, y la generación de contenido QR y el historial local están en `src/utils`.

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

Tailwind CSS se compila localmente con Tailwind CLI. Font Awesome, las fuentes y EasyQRCodeJS se cargan desde CDN en `index.html`.

Las imágenes se optimizan en el navegador y se guardan en IndexedDB, el almacenamiento nativo del navegador pensado para archivos y datos binarios. Se conservan como máximo 10, con reemplazo automático de la más antigua. Esta biblioteca es local al dispositivo; para incluir una imagen en un QR que otros dispositivos puedan abrir, hace falta una URL pública.
