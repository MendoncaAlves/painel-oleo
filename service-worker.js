// Nome do cache — troque a versão (v1 -> v2...) sempre que atualizar o HTML,
// para forçar os aparelhos a baixarem a versao nova.
const CACHE_NOME = "painel-oleo-v1";

// Arquivos que ficam guardados para funcionar offline.
// Se o seu HTML tiver outro nome, ajuste "./index.html" abaixo.
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png"
];

// Instalação: guarda os arquivos no cache.
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

// Ativação: limpa caches antigos de versões anteriores.
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(
        chaves.filter((chave) => chave !== CACHE_NOME).map((chave) => caches.delete(chave))
      )
    )
  );
  self.clients.claim();
});

// Requisições: tenta o cache primeiro; se não achar, busca na internet.
self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((resposta) => {
      return resposta || fetch(evento.request);
    })
  );
});
