/* =========================================================
   D&M Artículos Publicitarios — JavaScript
   Sin frameworks. Cada bloque está separado por sección.
   ========================================================= */

/* ---------- 0. CONFIGURACIÓN ---------- */
// Número de WhatsApp con código de país (51 = Perú), sin "+" ni espacios
const WA_NUMBER = '51991868238';

// Arma el enlace de WhatsApp con el texto codificado
function waLink(text) {
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
}

/* ---------- 0.5 PANTALLA DE CARGA ---------- */
// Se muestra mínimo ~3 s (lo que dura la animación de la rasqueta)
// y además espera a que la página termine de cargar.
const loader = document.getElementById('loader');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LOADER_MIN_MS = reduceMotion ? 500 : 3100;

function hideLoader() {
  if (!loader || loader.classList.contains('is-done')) return;
  loader.classList.add('is-done');
  loader.setAttribute('aria-hidden', 'true');
}
function scheduleHide() {
  // performance.now() = milisegundos desde que se abrió la página
  const wait = Math.max(0, LOADER_MIN_MS - performance.now());
  setTimeout(hideLoader, wait);
}
if (document.readyState === 'complete') {
  scheduleHide();
} else {
  window.addEventListener('load', scheduleHide);
}
setTimeout(hideLoader, 7000); // seguro: nunca se queda pegada

/* ---------- 1. ENLACES DE WHATSAPP (botones .js-wa) ---------- */
// Cada botón con class="js-wa" y data-msg="..." abre WhatsApp con ese mensaje
document.querySelectorAll('.js-wa').forEach(function (el) {
  const msg = el.dataset.msg || 'Hola D&M, quiero cotizar.';
  el.href = waLink(msg);
  el.target = '_blank';
  el.rel = 'noopener';
});

/* ---------- 2. HEADER: sombra al hacer scroll ---------- */
const header = document.getElementById('header');
function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- 3. MENÚ MÓVIL (hamburguesa) ---------- */
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
navToggle.addEventListener('click', function () {
  setMenu(!nav.classList.contains('is-open'));
});
// Cierra el menú al elegir una opción o con la tecla Escape
nav.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', function () { setMenu(false); });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
});

/* ---------- 5. GALERÍA: filtro por material y "Ver más" ---------- */
const gallery = document.getElementById('gallery');
const filters = document.querySelectorAll('.filter');
const galleryItems = document.querySelectorAll('#gallery li');
const moreBtn = document.getElementById('moreBtn');
const moreBox = moreBtn.parentElement;

filters.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const value = btn.dataset.filter;

    // Marca el botón activo
    filters.forEach(function (b) {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });

    // Al filtrar se muestran todas las fotos de ese material
    if (value !== 'todos') gallery.classList.add('is-expanded');

    // Muestra u oculta cada foto según su data-material
    galleryItems.forEach(function (li) {
      const show = value === 'todos' || li.dataset.material === value;
      li.classList.toggle('is-hidden', !show);
    });
    updateMoreBtn();
  });
});

// Botón "Ver más trabajos": muestra las fotos con class="is-extra"
moreBtn.addEventListener('click', function () {
  gallery.classList.add('is-expanded');
  updateMoreBtn();
});

// Oculta el botón cuando ya no hay fotos escondidas
function updateMoreBtn() {
  const expanded = gallery.classList.contains('is-expanded');
  moreBox.hidden = expanded;
  moreBtn.setAttribute('aria-expanded', String(expanded));
}

/* ---------- 6. GALERÍA: vista ampliada (lightbox) ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery__item').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const img = btn.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    if (typeof lightbox.showModal === 'function') {
      lightbox.showModal();
    } else {
      window.open(img.src, '_blank'); // navegadores muy antiguos
    }
  });
});
lightboxClose.addEventListener('click', function () { lightbox.close(); });
// Cierra al hacer clic fuera de la imagen
lightbox.addEventListener('click', function (e) {
  if (e.target === lightbox) lightbox.close();
});

/* ---------- 7. COTIZADOR → WhatsApp ---------- */
const form = document.getElementById('quoteForm');
const formError = document.getElementById('formError');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Campos obligatorios
  const required = ['qRubro', 'qTipo', 'qCantidad', 'qNegocio'];
  let ok = true;
  required.forEach(function (id) {
    const input = document.getElementById(id);
    const empty = !input.value.trim();
    input.closest('.field').classList.toggle('has-error', empty);
    input.setAttribute('aria-invalid', String(empty));
    if (empty) ok = false;
  });
  formError.hidden = ok;
  if (!ok) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  // Lee los valores
  const data = new FormData(form);
  const comentario = (data.get('comentario') || '').trim();

  // Mensaje ordenado
  const lines = [
    'Hola D&M, quiero una cotización:',
    '',
    '• Negocio: ' + data.get('negocio').trim(),
    '• Rubro: ' + data.get('rubro'),
    '• Tipo de bolsa/producto: ' + data.get('tipo'),
    '• Cantidad aproximada: ' + data.get('cantidad'),
    '• Colores de impresión: ' + data.get('colores')
  ];
  if (comentario) lines.push('• Comentario: ' + comentario);

  window.open(waLink(lines.join('\n')), '_blank', 'noopener');
});

/* ---------- 8. AÑO DEL FOOTER ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
