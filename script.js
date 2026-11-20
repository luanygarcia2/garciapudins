/* ==========================================================
   GARCIA PUDINS GOURMERT - JAVASCRIPT
   O JavaScript é a parte que deixa o site "interativo".
   ========================================================== */

/* Dados do negócio num só lugar: se mudar o número, é só trocar aqui. */
const WHATSAPP = '5531988151994';   // 55 (Brasil) + 31 (DDD) + número
const DIAS_MINIMOS = 4;             // antecedência mínima das encomendas

/* ---------- 1. MENU DO CELULAR ---------- */
const botaoMenu = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

function fecharMenu() {
  menu.classList.remove('aberto');
  botaoMenu.classList.remove('aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
}

botaoMenu.addEventListener('click', () => {
  const abriu = menu.classList.toggle('aberto');
  botaoMenu.classList.toggle('aberto', abriu);
  botaoMenu.setAttribute('aria-expanded', String(abriu));
});

// Ao clicar em um link do menu, ele fecha sozinho
menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', fecharMenu));

/* ---------- 2. SOMBRA NO CABEÇALHO AO ROLAR ---------- */
const cabecalho = document.querySelector('.header');
window.addEventListener('scroll', () => {
  cabecalho.classList.toggle('rolou', window.scrollY > 10);
});

/* ---------- 3. ANIMAÇÃO DOS ELEMENTOS AO APARECEREM NA TELA ---------- */
const elementos = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observador = new IntersectionObserver((itens) => {
    itens.forEach((item) => {
      if (item.isIntersecting) {
        item.target.classList.add('visivel');
        observador.unobserve(item.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach((el) => observador.observe(el));
} else {
  // Navegador antigo: mostra tudo de uma vez
  elementos.forEach((el) => el.classList.add('visivel'));
}

/* ---------- 4. GALERIA COM FOTO AMPLIADA ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxFechar = document.getElementById('lightboxFechar');

document.querySelectorAll('.galeria__item').forEach((botao) => {
  botao.addEventListener('click', () => {
    lightboxImg.src = botao.dataset.img;
    lightboxImg.alt = botao.dataset.alt;
    lightbox.hidden = false;
    lightboxFechar.focus();
  });
});

function fecharLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
}

lightboxFechar.addEventListener('click', fecharLightbox);
lightbox.addEventListener('click', (evento) => {
  if (evento.target === lightbox) fecharLightbox(); // clicou fora da foto
});
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && !lightbox.hidden) fecharLightbox();
});

/* ---------- 5. FORMULÁRIO DE ENCOMENDA -> WHATSAPP ---------- */
const form = document.getElementById('formEncomenda');
const campoNome = document.getElementById('nome');
const campoTamanho = document.getElementById('tamanho');
const campoQtd = document.getElementById('quantidade');
const campoData = document.getElementById('data');
const campoObs = document.getElementById('obs');
const textoTotal = document.getElementById('total');
const textoErro = document.getElementById('erro');

// Transforma uma data em texto "AAAA-MM-DD" (formato do campo de data)
function formatarParaCampo(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Define a menor data que o cliente pode escolher (hoje + 4 dias)
const dataMinima = new Date();
dataMinima.setDate(dataMinima.getDate() + DIAS_MINIMOS);
campoData.min = formatarParaCampo(dataMinima);

// Mostra o valor total do pedido enquanto a pessoa preenche
function atualizarTotal() {
  const opcao = campoTamanho.options[campoTamanho.selectedIndex];
  const preco = Number(opcao.dataset.preco);
  const qtd = Number(campoQtd.value);

  if (preco && qtd > 0) {
    textoTotal.textContent = `Total estimado: R$ ${(preco * qtd).toFixed(2).replace('.', ',')}`;
  } else {
    textoTotal.textContent = '';
  }
}
campoTamanho.addEventListener('change', atualizarTotal);
campoQtd.addEventListener('input', atualizarTotal);

// Quando clica em "Enviar", valida e abre o WhatsApp com a mensagem pronta
form.addEventListener('submit', (evento) => {
  evento.preventDefault(); // impede a página de recarregar
  textoErro.textContent = '';

  const nome = campoNome.value.trim();
  const tamanho = campoTamanho.value;
  const qtd = Number(campoQtd.value);
  const data = campoData.value;
  const obs = campoObs.value.trim();

  if (!nome) { textoErro.textContent = 'Digite o seu nome.'; campoNome.focus(); return; }
  if (!tamanho) { textoErro.textContent = 'Escolha o tamanho do pudim.'; campoTamanho.focus(); return; }
  if (!qtd || qtd < 1) { textoErro.textContent = 'Informe a quantidade.'; campoQtd.focus(); return; }
  if (!data) { textoErro.textContent = 'Escolha o dia da retirada.'; campoData.focus(); return; }
  if (data < campoData.min) {
    textoErro.textContent = `Escolha uma data com pelo menos ${DIAS_MINIMOS} dias de antecedência.`;
    campoData.focus();
    return;
  }

  // Converte "2026-12-05" em "05/12/2026"
  const [ano, mes, dia] = data.split('-');
  const dataBR = `${dia}/${mes}/${ano}`;

  let mensagem =
    `Olá, Vanessa! Vim pelo site e gostaria de fazer uma encomenda:\n\n` +
    `Nome: ${nome}\n` +
    `Pudim: ${tamanho}\n` +
    `Quantidade: ${qtd}\n` +
    `Data para retirada: ${dataBR}`;

  if (obs) mensagem += `\nObservações: ${obs}`;

  const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
  window.open(link, '_blank', 'noopener');
});

/* ---------- 6. ANO AUTOMÁTICO NO RODAPÉ ---------- */
document.getElementById('ano').textContent = new Date().getFullYear();
