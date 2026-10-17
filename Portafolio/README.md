# Línea Mateo: portafolio de Mateo Gimenez

Portafolio personal de Gimenez Jorge Mateo, Técnico en Programación y desarrollador web. Muestra quién soy, con qué trabajo y los proyectos que hice, incluidos sitios y sistemas para clientes reales, y termina en contacto: descarga del CV, LinkedIn, GitHub o el formulario.

## Stack

- [Astro 5](https://astro.build) (sitio estático)
- Tailwind CSS 3, con estilos propios en cada componente
- Tipografías self-hosted con `@fontsource`: Big Shoulders Display (títulos) y Archivo Variable (texto)
- `simple-icons` para los logos de tecnologías
- Formulario de contacto con [formsubmit.co](https://formsubmit.co)

## Cómo correrlo

```bash
npm install      # instala las dependencias
npm run dev      # servidor de desarrollo en http://localhost:4321
npm run build    # genera el sitio estático en dist/
```

## Estructura de carpetas

```
src/
  components/    secciones y piezas: Header, SobreMi, Skills, Proyectos, Contactame, Footer
  data/
    proyectos.json   proyectos que se muestran en la sección Proyectos
    skills.json      tecnologías de la sección Skills
  layouts/       Layout.astro: head, fuentes, cabecera y pie
  pages/         index.astro: arma la página con las secciones
  scripts/       led.ts: el cartel LED de destino dibujado en canvas
  styles/        global.css: variables de color, tipografía y botones base
public/          imágenes, video, CV y favicon
PRODUCT.md       contexto del producto y del público
DESIGN.md        sistema de diseño del sitio
```

## Editar proyectos

Los proyectos están en `src/data/proyectos.json`. Cada entrada es un objeto con:

- `name`: nombre del proyecto.
- `descripcion`: texto corto.
- `cliente`: `true` si el proyecto fue para un cliente real (muestra el sello "Cliente real").
- `video` o `image`: ruta a un archivo dentro de `public/`, por ejemplo `"/Joyeria.mp4"`.
- `tecnologias`: lista de objetos `{ "name": "React" }`.
- `web` o `git`: enlace al sitio en vivo (`web`) o al repositorio (`git`). Si hay `web`, el botón dice "Ver sitio"; si no, dice "Ver código".

Para agregar un proyecto, sumá un objeto al array `proyectos`. Cada proyecto recibe automáticamente una banda de color del colectivo.

## Editar skills

Las tecnologías están en `src/data/skills.json`, agrupadas por categoría. Cada habilidad tiene un `name` y un `icon`, que es la clave del icono en `simple-icons`, por ejemplo:

```json
{ "name": "React", "icon": "siReact" }
```

Las claves válidas están en el paquete `simple-icons` (buscá el nombre con prefijo `si`, como `siNodedotjs` o `siMysql`). Si la clave no existe, la habilidad aparece sin icono.

## Concepto visual: Línea Mateo

El sitio es un recorrido de colectivo porteño. El fondo azul marino es la librea, las secciones son paradas, los proyectos son boletos impresos y el contacto es tocar el timbre. El cartel LED ámbar de la portada y la línea de ruta del encabezado, con un colectivo que se mueve con física de resorte, completan la idea. Las reglas visuales están documentadas en `DESIGN.md`.
