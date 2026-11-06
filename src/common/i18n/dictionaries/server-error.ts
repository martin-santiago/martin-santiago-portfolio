import type { Locale } from "../locales";

type ServerErrorCopy = { heading: string; body: string; retry: string };

export const SERVER_ERROR_COPY: Record<Locale, ServerErrorCopy> = {
  es: {
    heading: "No se pudo cargar el portafolio",
    body: "Algo falló en el servidor. Intenta de nuevo y, si sigue fallando, revisa los logs del servidor.",
    retry: "Intentar de nuevo",
  },
  en: {
    heading: "The portfolio could not load",
    body: "Something failed on the server. Try again, and check the server logs if it keeps failing.",
    retry: "Try again",
  },
};
