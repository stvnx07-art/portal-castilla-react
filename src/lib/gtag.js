/**
 * gtag — helper para enviar eventos custom a GA4 desde el cliente.
 *
 * @next/third-parties/google no aplica en Vite/React puro
 * (es solo para Next.js App Router). Aquí el snippet va inline
 * en index.html, y este helper existe para los eventos que
 * disparamos desde interacciones del usuario (clicks en CTAs,
 * envíos de form, etc.).
 *
 * Uso típico en un componente React:
 *   import { trackEvent } from "@/lib/gtag";
 *   <a onClick={() => trackEvent("cta_whatsapp_click", { href: url })}>
 *
 * Seguridad:
 * - trackEvent no hace nada si `window.gtag` no existe (SSR-safe,
 *   aunque Vite es client-only por defecto, pero en tests puede
 *   correr en jsdom).
 * - No uses estos helpers para meter PII en los params.
 *
 * 2026-06-15: creado (paralelo al de gorbeiav2) para trackear
 * el mensaje de WhatsApp con UTMs.
 */

export function trackEvent(name, params) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

/**
 * Lee los UTMs de la URL actual y los devuelve como objeto
 * normalizado. Útil para enriquecer eventos con la fuente de
 * adquisición sin parsear `window.location.search` cada vez.
 *
 * Devuelve `null` si no hay ningún UTM en la URL.
 */
export function getUtms() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const out = {};
  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]) {
    const v = params.get(key);
    if (v) out[key.replace("utm_", "")] = v;
  }
  return Object.keys(out).length > 0 ? out : null;
}
