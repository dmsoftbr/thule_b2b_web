// API_URL relativo (same-origin) para que o cookie HttpOnly de refresh seja
// first-party. Em dev, o proxy do Vite encaminha /api → backend; em produção,
// remote.thule.com/b2b e remote.thule.com/b2bapi compartilham o domínio.
window.__APP_CONFIG__ = {
  API_URL: "/api/v1",
  // Override OPCIONAL do token de bypass do Azure WAF. Se vazio, o app usa o valor
  // ofuscado embutido no bundle (lib/api.ts). Preencha aqui só se precisar trocar o
  // token sem rebuild (ex.: rotação no deploy). Em dev fica vazio.
  WAF_TOKEN: "",
  // Fallbacks das fotos de produto, por pasta. Quando o arquivo local (servido sob
  // /b2b/products/{thumbs,originals}/) não existe (404), o app tenta a URL abaixo,
  // preservando o nome do arquivo (incl. o sufixo _seq da galeria). Se ficar vazio,
  // pula direto para o placeholder (products/sem_imagem.jpg). Editável no deploy.
  IMG_THUMB_FALLBACK_URL: "https://remote.thule.com/imgrepo/",
  IMG_ORIGINAL_FALLBACK_URL: "https://remote.thule.com/imgrepo/",
  // Exportação de Pedido/Simulação (PDF e XLSX): define se o arquivo é BAIXADO
  // (false) ou ABERTO em uma nova aba do navegador (true). Editável no deploy.
  EXPORT_OPEN_IN_BROWSER: false,
};
