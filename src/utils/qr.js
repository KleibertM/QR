export const QR_TYPES = {
  link: { label: "Enlace Web", icon: "fa-globe", color: "indigo", iconClass: "text-indigo-600" },
  image: { label: "Folleto Digital", icon: "fa-image", color: "emerald", iconClass: "text-emerald-600" },
  wifi: { label: "Acceso Wi-Fi", icon: "fa-wifi", color: "sky", iconClass: "text-sky-600" },
  text: { label: "Versículo / Mensaje", icon: "fa-book-bible", color: "amber", iconClass: "text-amber-600" },
  contact: { label: "Contacto Pastoral", icon: "fa-address-card", color: "purple", iconClass: "text-purple-600" },
};

export const COLOR_PALETTES = [
  { label: "Negro clásico", dark: "#0f172a", light: "#ffffff", swatch: "#0f172a" },
  { label: "Azul Marino", dark: "#1e3a8a", light: "#ffffff", swatch: "#1e3a8a" },
  { label: "Verde Olivo", dark: "#064e3b", light: "#ffffff", swatch: "#064e3b" },
  { label: "Púrpura Noble", dark: "#4c1d95", light: "#ffffff", swatch: "#4c1d95" },
  { label: "Cálido / Crema", dark: "#7c2d12", light: "#fffbeb", swatch: "#7c2d12" },
];

export const INITIAL_FORM = {
  title: "",
  link: "https://www.youtube.com/@iglesiacomunidad",
  image: "",
  ssid: "",
  password: "",
  wifiSecurity: "WPA",
  text: "",
  contactName: "",
  contactRole: "",
  contactPhone: "",
  contactEmail: "",
};

const escapeWifiValue = (value) => value.replace(/([\\;,":])/g, "\\$1");

export function createQRContent(type, form) {
  const title = form.title.trim() || "Código Comunitario";
  let content = "";

  switch (type) {
    case "image":
      content = form.image.trim() || "https://drive.google.com";
      break;
    case "wifi": {
      const ssid = escapeWifiValue(form.ssid.trim() || "Templo_Wi-Fi");
      const password = escapeWifiValue(form.password.trim());
      content =
        form.wifiSecurity === "nopass" || !password
          ? `WIFI:T:nopass;S:${ssid};;`
          : `WIFI:T:${form.wifiSecurity};S:${ssid};P:${password};;`;
      break;
    }
    case "text":
      content = form.text.trim() || "«El Señor es mi pastor, nada me faltará» - Salmos 23:1";
      break;
    case "contact": {
      const name = form.contactName.trim() || "Pastor de la Comunidad";
      const role = form.contactRole.trim() || "Ministerio Pastoral";
      const phone = form.contactPhone.trim() || "+000000000";
      const email = form.contactEmail.trim();
      content = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${name}`,
        `ORG:${role}`,
        `TEL;TYPE=CELL:${phone}`,
        `EMAIL:${email}`,
        "NOTE:Contacto de la Iglesia",
        "END:VCARD",
      ].join("\n");
      break;
    }
    default:
      content = form.link.trim() || "https://www.youtube.com";
  }

  return { content, title, typeLabel: QR_TYPES[type].label };
}

export function renderQRCode(container, content, darkColor, lightColor) {
  if (!window.QRCode) {
    throw new Error("No se pudo cargar EasyQRCodeJS. Revisa tu conexión a internet.");
  }

  container.replaceChildren();
  return new window.QRCode(container, {
    text: content,
    width: 240,
    height: 240,
    colorDark: darkColor,
    colorLight: lightColor,
    correctLevel: window.QRCode.CorrectLevel.H,
    quietZone: 12,
    quietZoneColor: lightColor,
  });
}
