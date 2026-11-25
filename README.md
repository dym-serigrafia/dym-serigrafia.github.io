# D&M Artículos Publicitarios — Landing page

Sitio estático (HTML, CSS y JS sin frameworks) publicado en GitHub Pages:
https://dym-serigrafia.github.io/

## Estructura
- `index.html` — contenido de la página
- `css/styles.css` — estilos
- `js/main.js` — botones de WhatsApp, cotizador, galería, menú y pantalla de carga
- `assets/` — logo, tipografía y fotos (`assets/trabajos/`)

## Cambiar el número de WhatsApp
En `js/main.js`, edita la constante `WA_NUMBER` (código de país 51 + número, sin "+" ni espacios).
Los enlaces `tel:` del `index.html` también usan el número.

## Agregar una foto a la galería
1. Guarda la foto en `assets/trabajos/` (formato .webp o .jpg, de unos 800 x 1100 px).
2. En `index.html`, dentro de `<ul class="gallery">`, copia un `<li>` existente y cambia la ruta, el texto alternativo y el rubro.

## Publicar cambios
Cada vez que subes cambios a la rama `main`, GitHub Pages actualiza la página en 1 a 3 minutos.
