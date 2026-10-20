/* Lógica da vitrine: lê assets/produtos.js e monta cartões, categorias e página de produto.
   Funciona em 3 páginas, identificadas por <body data-page="home|categoria|produto">. */
(function () {
  'use strict';

  var L = window.LOJA || {};
  var CATS = window.CATEGORIAS || [];
  var PRODS = window.PRODUTOS || [];
  var page = document.body.getAttribute('data-page');
  var params = new URLSearchParams(window.location.search);

  /* ---------- utilidades ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else n.setAttribute(k, v === true ? '' : v);
      });
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function icon(id) {
    var ns = 'http://www.w3.org/2000/svg';
    var s = document.createElementNS(ns, 'svg');
    s.setAttribute('class', 'icon');
    s.setAttribute('aria-hidden', 'true');
    var u = document.createElementNS(ns, 'use');
    u.setAttribute('href', '#' + id);
    s.appendChild(u);
    return s;
  }

  function wa(texto) {
    return 'https://wa.me/' + L.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  function preco(p) {
    return typeof p === 'number'
      ? p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : 'Consulte o valor';
  }

  function norm(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function catBySlug(slug) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].slug === slug) return CATS[i];
    return null;
  }

  function prodUrl(p) { return 'produto.html?id=' + encodeURIComponent(p.id); }
  function catUrl(slug) { return 'categoria.html?c=' + encodeURIComponent(slug); }

  function setMetaDescription(texto) {
    var m = $('meta[name="description"]');
    if (m) m.setAttribute('content', texto);
  }

  /* ---------- cartão de produto ---------- */
  function card(p) {
    var cat = catBySlug(p.categoria);
    var media = el('div', { class: 'prod-media' }, [
      el('img', { src: p.thumb || p.imagens[0], alt: p.nome, loading: 'lazy', width: 600, height: 600 }),
      p.novo ? el('span', { class: 'tag', text: 'Novo' }) : null
    ]);
    var link = el('a', { class: 'prod-link', href: prodUrl(p) }, [
      media,
      el('div', { class: 'prod-body' }, [
        cat ? el('span', { class: 'prod-cat', text: cat.nome }) : null,
        el('h3', { text: p.nome }),
        el('span', { class: 'prod-price', text: preco(p.preco) })
      ])
    ]);
    var actions = el('div', { class: 'prod-actions' }, [
      el('a', {
        class: 'btn btn-whatsapp btn-sm btn-block',
        href: wa('Olá! Quero a camisa ' + p.nome + '. Vi no site da Colorado Esportes.'),
        target: '_blank', rel: 'noopener'
      }, [icon('ico-whatsapp'), 'Pedir no WhatsApp'])
    ]);
    return el('article', { class: 'prod-card' }, [link, actions]);
  }

  /* ---------- elementos comuns das subpáginas ---------- */
  function initChrome() {
    var burger = $('#burger');
    var nav = $('#navLinks');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
    document.querySelectorAll('[data-wa]').forEach(function (a) {
      a.setAttribute('href', wa(a.getAttribute('data-wa')));
    });
    var list = $('[data-cat-links]');
    if (list) {
      CATS.forEach(function (c) {
        list.appendChild(el('li', null, [el('a', { href: catUrl(c.slug), text: c.nome })]));
      });
    }
  }

  /* ---------- HOME: destaques ---------- */
  function initHome() {
    var sec = $('#destaques');
    var grid = $('#destaquesGrid');
    if (!sec || !grid) return;
    var list = PRODS.filter(function (p) { return p.destaque; });
    if (!list.length) { sec.hidden = true; return; }
    list.forEach(function (p) { grid.appendChild(card(p)); });
  }

  /* ---------- CATEGORIA ---------- */
  function initCategoria() {
    var slug = params.get('c') || 'todos';
    var todos = slug === 'todos';
    var cat = todos
      ? { slug: 'todos', nome: 'Todas as camisas', descricao: 'Tudo o que está na vitrine agora. Gostou de alguma? É só chamar no WhatsApp.' }
      : catBySlug(slug);

    var title = $('#catTitle');
    var desc = $('#catDesc');
    var grid = $('#grid');
    var vazio = $('#vazio');
    var contagem = $('#contagem');
    var busca = $('#busca');
    var crumbCat = $('#crumbCat');

    if (!cat) {
      title.textContent = 'Categoria não encontrada';
      desc.textContent = 'Esse endereço não existe mais. Escolha uma das categorias abaixo.';
      crumbCat.textContent = 'Categoria';
      $('.tools').hidden = true;
      renderPills('');
      return;
    }

    document.title = cat.nome + ' | Colorado Esportes';
    setMetaDescription(cat.descricao);
    title.textContent = cat.nome;
    desc.textContent = cat.descricao;
    crumbCat.textContent = cat.nome;

    var base = PRODS.filter(function (p) { return todos || p.categoria === slug; });

    function render() {
      var q = norm(busca.value.trim());
      var list = base.filter(function (p) {
        if (!q) return true;
        var c = catBySlug(p.categoria);
        var alvo = norm(p.nome + ' ' + (p.tags || []).join(' ') + ' ' + (c ? c.nome : ''));
        return q.split(/\s+/).every(function (t) { return alvo.indexOf(t) !== -1; });
      });

      grid.textContent = '';
      list.forEach(function (p) { grid.appendChild(card(p)); });
      grid.hidden = !list.length;
      contagem.textContent = base.length
        ? list.length + (list.length === 1 ? ' modelo' : ' modelos')
        : '';

      vazio.textContent = '';
      vazio.hidden = list.length > 0;
      if (!list.length) {
        if (!base.length) {
          vazio.appendChild(el('h2', { text: 'Estamos atualizando esta vitrine' }));
          vazio.appendChild(el('p', { text: 'Novos modelos de ' + cat.nome + ' chegam em breve. Chame no WhatsApp e peça as fotos e valores disponíveis agora.' }));
          vazio.appendChild(el('a', {
            class: 'btn btn-whatsapp', target: '_blank', rel: 'noopener',
            href: wa('Olá! Vi o site e quero ver as opções de ' + cat.nome + '.')
          }, [icon('ico-whatsapp'), 'Pedir opções no WhatsApp']));
        } else {
          vazio.appendChild(el('h2', { text: 'Nada encontrado' }));
          vazio.appendChild(el('p', { text: 'Não achamos “' + busca.value.trim() + '” aqui, mas podemos ter no catálogo completo. Pergunte pelo WhatsApp.' }));
          vazio.appendChild(el('a', {
            class: 'btn btn-whatsapp', target: '_blank', rel: 'noopener',
            href: wa('Olá! Vi o site e procuro: ' + busca.value.trim())
          }, [icon('ico-whatsapp'), 'Procurar pra mim']));
        }
      }
    }

    busca.addEventListener('input', render);
    render();
    renderPills(slug);
  }

  function renderPills(ativa) {
    var box = $('#pills');
    if (!box) return;
    var todosLink = el('a', { class: 'pill', href: catUrl('todos'), text: 'Todas' });
    if (ativa === 'todos') todosLink.setAttribute('aria-current', 'page');
    box.appendChild(todosLink);
    CATS.forEach(function (c) {
      var n = PRODS.filter(function (p) { return p.categoria === c.slug; }).length;
      var a = el('a', { class: 'pill', href: catUrl(c.slug), text: c.nome + (n ? ' (' + n + ')' : '') });
      if (c.slug === ativa) a.setAttribute('aria-current', 'page');
      box.appendChild(a);
    });
  }

  /* ---------- PRODUTO ---------- */
  function initProduto() {
    var id = params.get('id');
    var p = null;
    for (var i = 0; i < PRODS.length; i++) if (PRODS[i].id === id) p = PRODS[i];
    var root = $('#produto');
    var crumbCat = $('#crumbCat');
    var crumbProd = $('#crumbProd');

    if (!p) {
      crumbCat.textContent = 'Camisas';
      crumbCat.setAttribute('href', catUrl('todos'));
      crumbProd.textContent = 'Produto não encontrado';
      root.className = '';
      root.appendChild(el('div', { class: 'empty' }, [
        el('h2', { text: 'Produto não encontrado' }),
        el('p', { text: 'Esse modelo pode ter saído da vitrine. Veja as outras camisas ou fale com a gente no WhatsApp.' }),
        el('a', { class: 'btn btn-solid', href: catUrl('todos'), text: 'Ver todas as camisas' })
      ]));
      return;
    }

    var cat = catBySlug(p.categoria);
    document.title = p.nome + ' | Colorado Esportes';
    setMetaDescription(p.descricao);
    if (cat) {
      crumbCat.textContent = cat.nome;
      crumbCat.setAttribute('href', catUrl(cat.slug));
    } else {
      crumbCat.textContent = 'Camisas';
      crumbCat.setAttribute('href', catUrl('todos'));
    }
    crumbProd.textContent = p.nome;

    /* galeria */
    var main = el('img', { id: 'mainImg', src: p.imagens[0], alt: p.nome + ' — foto 1', width: 1000, height: 1000 });
    var gallery = el('div', { class: 'gallery' }, [el('div', { class: 'gallery-main' }, [main])]);
    if (p.imagens.length > 1) {
      var thumbs = el('div', { class: 'thumbs', role: 'group', 'aria-label': 'Fotos do produto' });
      p.imagens.forEach(function (src, idx) {
        var b = el('button', {
          type: 'button', class: 'thumb' + (idx === 0 ? ' active' : ''),
          'aria-label': 'Ver foto ' + (idx + 1)
        }, [el('img', { src: src, alt: '', loading: 'lazy', width: 156, height: 156 })]);
        if (idx === 0) b.setAttribute('aria-current', 'true');
        b.addEventListener('click', function () {
          main.src = src;
          main.alt = p.nome + ' — foto ' + (idx + 1);
          thumbs.querySelectorAll('.thumb').forEach(function (t) {
            t.classList.remove('active');
            t.removeAttribute('aria-current');
          });
          b.classList.add('active');
          b.setAttribute('aria-current', 'true');
        });
        thumbs.appendChild(b);
      });
      gallery.appendChild(thumbs);
    }

    /* tamanho + botão do WhatsApp */
    var tam = null;
    function mensagem() {
      return 'Olá! Quero a camisa *' + p.nome + '* — tamanho: ' + (tam || 'a confirmar') + '.\n' +
             'Vi no site: ' + window.location.href;
    }
    var cta = el('a', {
      class: 'btn btn-whatsapp btn-lg btn-block', target: '_blank', rel: 'noopener', href: wa(mensagem())
    }, [icon('ico-whatsapp'), 'Pedir pelo WhatsApp']);

    var sizes = null;
    if (p.tamanhos && p.tamanhos.length) {
      var chips = el('div', { class: 'chips' });
      p.tamanhos.forEach(function (t) {
        var input = el('input', { type: 'radio', name: 'tam', value: t });
        input.addEventListener('change', function () {
          tam = t;
          cta.setAttribute('href', wa(mensagem()));
        });
        chips.appendChild(el('label', { class: 'chip' }, [input, el('span', { text: t })]));
      });
      sizes = el('fieldset', { class: 'sizes' }, [
        el('legend', { text: 'Tamanho' }),
        chips,
        el('p', { class: 'size-hint', text: 'Sem certeza do tamanho? Escolha depois: a gente confirma no WhatsApp.' })
      ]);
    }

    var details = null;
    if (p.detalhes && p.detalhes.length) {
      details = el('ul', { class: 'details' });
      p.detalhes.forEach(function (d) {
        details.appendChild(el('li', null, [icon('ico-check'), d]));
      });
    }

    var info = el('div', { class: 'product-info' }, [
      cat ? el('p', { class: 'eyebrow', text: cat.nome }) : null,
      el('h1', { text: p.nome }),
      el('p', { class: 'price' + (typeof p.preco === 'number' ? '' : ' ask'), text: preco(p.preco) }),
      el('p', { class: 'desc', text: p.descricao }),
      sizes,
      details,
      el('div', { class: 'buy' }, [
        cta,
        el('div', { class: 'trust' }, [
          el('span', null, [icon('ico-truck'), 'Entrega em até 7 dias']),
          el('span', null, [icon('ico-shield'), 'Pagamento combinado no WhatsApp'])
        ]),
        el('p', { class: 'note', text: 'Fotos ilustrativas. Valor, prazo de entrega e formas de pagamento são combinados direto com a gente pelo WhatsApp.' })
      ])
    ]);

    root.appendChild(gallery);
    root.appendChild(info);

    /* mais da mesma categoria */
    var outros = PRODS.filter(function (x) { return x.id !== p.id && x.categoria === p.categoria; }).slice(0, 4);
    var more = $('#more');
    if (outros.length && more) {
      var g = $('#moreGrid');
      outros.forEach(function (x) { g.appendChild(card(x)); });
      more.hidden = false;
    }
  }

  /* ---------- início ---------- */
  if (page !== 'home') initChrome();
  if (page === 'home') initHome();
  else if (page === 'categoria') initCategoria();
  else if (page === 'produto') initProduto();
})();
