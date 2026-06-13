// Fallbacks das fotos de produto, configuráveis por pasta (thumbs / originals).
// As bases vêm do runtime config (public/config.js) para poder trocar no deploy
// sem rebuild. Quando uma base está vazia, aquela pasta não tem fallback remoto e
// o app cai direto no placeholder.
//
// Centralizado aqui para que listagens (ProductImage) e a galeria de cadastro
// usem exatamente a mesma cadeia.

const CFG = (window as { __APP_CONFIG__?: Record<string, string> }).__APP_CONFIG__ ?? {};

export const PRODUCT_IMAGE_PLACEHOLDER = "products/sem_imagem.jpg";

const REMOTE_DEFAULT = "https://remote.thule.com/imgrepo/";
const THUMB_FALLBACK_BASE = CFG.IMG_THUMB_FALLBACK_URL ?? REMOTE_DEFAULT;
const ORIGINAL_FALLBACK_BASE = CFG.IMG_ORIGINAL_FALLBACK_URL ?? REMOTE_DEFAULT;

// Troca a base local (products/thumbs|originals/...) pela base de fallback,
// preservando o nome do arquivo (incl. o sufixo _seq da galeria, para que cada foto
// resolva para um arquivo distinto no remoto). A extensão é normalizada para .jpg
// porque o repositório remoto é jpg-based — os thumbs locais são .jpeg e cairiam em
// 404 se mantivessem a extensão original. Retorna null quando não há fallback.
function swapBase(localUrl: string, base: string): string | null {
  if (!base) return null;
  const file = localUrl.split("/").pop();
  if (!file) return null;
  const name = file.replace(/\.[^.]+$/, "") + ".jpg";
  const sep = base.endsWith("/") ? "" : "/";
  return `${base}${sep}${name}`;
}

// Cadeia completa a partir da fonte primária (URL local), já terminando no
// placeholder. Use o primeiro item como `src` e `onImageError` no `onError`.
export function thumbChain(localThumbUrl: string): string[] {
  return [localThumbUrl, swapBase(localThumbUrl, THUMB_FALLBACK_BASE), PRODUCT_IMAGE_PLACEHOLDER].filter(
    (u): u is string => !!u,
  );
}

export function originalChain(localOriginalUrl: string): string[] {
  // Thumb local correspondente, derivado pela convenção de pastas
  // (products/originals/NAME.jpg -> products/thumbs/NAME.jpeg). É o último recurso
  // ANTES do placeholder: o remoto (imgrepo) só tem a foto principal {id}.jpg, então
  // as fotos da galeria (_seq) só existem localmente como thumb. Sem isto, a 2ª/3ª
  // foto cairia direto no sem_imagem.jpg.
  const localThumb = localOriginalUrl.includes("/originals/")
    ? localOriginalUrl.replace("/originals/", "/thumbs/").replace(/\.[^.]+$/, ".jpeg")
    : null;
  return [
    localOriginalUrl,
    swapBase(localOriginalUrl, ORIGINAL_FALLBACK_BASE),
    localThumb,
    PRODUCT_IMAGE_PLACEHOLDER,
  ].filter((u): u is string => !!u);
}

// Avança para a próxima fonte da cadeia quando a atual falha (404). O índice atual
// é rastreado no atributo data-step do próprio <img>. Defina data-step="0" no JSX.
export function onImageError(
  e: React.SyntheticEvent<HTMLImageElement>,
  chain: string[],
): void {
  const el = e.currentTarget;
  const next = Number(el.dataset.step ?? "0") + 1;
  if (next < chain.length) {
    el.dataset.step = String(next);
    el.src = chain[next];
  }
}
