/* =====================================================================
   COLORADO ESPORTES — DADOS DA VITRINE
   Este é o ÚNICO arquivo que você precisa editar para adicionar camisas.
   ===================================================================== */

/* ---------- Dados da loja ---------- */
window.LOJA = {
  nome: "Colorado Esportes",
  whatsapp: "5515996990733",            // país (55) + DDD (15) + número — sem espaços nem traços
  instagram: "https://www.instagram.com/coloradoesportes"
};

/* ---------- Categorias (mesmas da página inicial) ---------- */
window.CATEGORIAS = [
  { slug: "clubes-brasileiros", nome: "Clubes Brasileiros", icone: "ico-shirt",
    descricao: "Os principais times do futebol brasileiro. Escolheu a sua? É só chamar no WhatsApp." },
  { slug: "clubes-europeus", nome: "Clubes Europeus", icone: "ico-globe",
    descricao: "Premier League, La Liga, Serie A, Bundesliga e mais, com os lançamentos da temporada." },
  { slug: "selecoes", nome: "Seleções", icone: "ico-trophy",
    descricao: "Camisas das principais seleções do mundo, para torcer com estilo em qualquer competição." },
  { slug: "selecao-brasileira", nome: "Seleção Brasileira", icone: "ico-flag",
    descricao: "Modelos atuais e retrô da Seleção Brasileira." },
  { slug: "kits-treino", nome: "Kits de Treino", icone: "ico-dumbbell",
    descricao: "Conjuntos de treino com conforto e respirabilidade." },
  { slug: "kit-inverno", nome: "Kit Inverno", icone: "ico-snow",
    descricao: "Agasalhos, jaquetas corta-vento e blusas dos seus times do coração." },
  { slug: "acessorios", nome: "Acessórios Esportivos", icone: "ico-box",
    descricao: "Bonés, meiões, bolas e tudo para completar o visual do torcedor." }
];

/* ---------- Produtos ----------
   Para ADICIONAR uma camisa: copie um bloco { ... }, cole logo abaixo (com vírgula)
   e troque os dados.

   id         → identificador único, só letras minúsculas, números e hífen
   categoria  → um dos "slug" acima (ex.: "selecoes")
   preco      → número (ex.: 149.90) ou null para mostrar "Consulte o valor"
   tamanhos   → lista de tamanhos que o cliente pode escolher
   destaque   → true para aparecer na página inicial
   novo       → true para mostrar a etiqueta "Novo"
   tags       → palavras extras para a busca (time, liga, ano...)
   imagens    → fotos do produto (a primeira é a principal). Salve em /img
   thumb      → foto menor usada na grade (opcional; se faltar usa a primeira)
*/
window.PRODUTOS = [
  {
    id: "espanha-azul-copa-2026",
    nome: "Camisa Espanha Azul — Copa 2026",
    categoria: "selecoes",
    preco: null,                                   // ← coloque o seu valor de venda, ex.: 149.90
    tamanhos: ["P", "M", "G", "GG", "XG"],        // ← confirme os tamanhos disponíveis
    destaque: true,
    novo: true,
    tags: ["espanha", "españa", "copa do mundo", "2026", "selecao", "azul"],
    descricao: "Camisa da seleção da Espanha em azul-marinho, com estampa ornamental em relevo no tecido, gola em V com faixas nas cores da bandeira e detalhes em amarelo nos ombros e nos punhos.",
    detalhes: [
      "Azul-marinho com estampa ornamental em relevo",
      "Gola em V com faixas amarela, vermelha e azul-marinho",
      "Punhos listrados e detalhes amarelos nos ombros",
      "Nome “España” aplicado na nuca"
    ],
    imagens: [
      "img/espanha-azul-frente.webp",
      "img/espanha-azul-costas.webp"
    ],
    thumb: "img/espanha-azul-frente-thumb.webp"
  }
];
