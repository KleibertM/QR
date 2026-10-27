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

Tailwind CSS, Font Awesome, las fuentes y EasyQRCodeJS se cargan desde CDN en `index.html`.

Las imágenes seleccionadas se optimizan en el navegador y se guardan en `localStorage`, con un máximo de 10 y reemplazo automático de la más antigua. Esta biblioteca es local al dispositivo; para incluir una imagen en un QR que otros dispositivos puedan abrir, hace falta una URL pública.
