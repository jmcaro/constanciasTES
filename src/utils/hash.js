/** Normaliza un número de documento: solo dígitos, sin espacios ni puntos. */
export function normalizeDocumento(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/** SHA-256 en hex del documento normalizado (Web Crypto — debe coincidir con scripts/build-data.mjs). */
export async function hashDocumento(value) {
  const normalized = normalizeDocumento(value);
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
