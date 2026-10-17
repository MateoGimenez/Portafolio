---
name: Línea Mateo
description: "Portafolio de Mateo Gimenez como recorrido de colectivo porteño: paradas, boletos y el timbre de contacto."
colors:
  navy: "#0b1a3a"
  navy-deep: "#060f24"
  navy-soft: "#16295a"
  amber: "#ffb000"
  amber-soft: "#ffd166"
  yellow: "#ffc21a"
  red: "#c8261a"
  red-bright: "#ff3b2a"
  green: "#1fa774"
  blue: "#2f6fd0"
  livery-violet: "#6b3fa0"
  paper: "#f4efe1"
  ink: "#0b1a3a"
  ink-soft: "#3d4a68"
  white: "#ffffff"
  muted-on-navy: "#b9c3dc"
  led-off: "#2b2010"
typography:
  display:
    fontFamily: "Big Shoulders Display, Archivo Variable, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Archivo Variable, sans-serif"
    fontSize: "clamp(2.8rem, 7vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Big Shoulders Display, Archivo Variable, sans-serif"
    fontSize: "clamp(2.4rem, 4.6vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Archivo Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Big Shoulders Display, Archivo Variable, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
rounded:
  sm: "4px"
  md: "12px"
  window: "28px"
  pill: "999px"
  round: "50%"
spacing:
  gutter: "clamp(16px, 4vw, 56px)"
  section-y: "clamp(80px, 11vw, 140px)"
  header-h: "64px"
components:
  button-ticket:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    padding: "14px 26px"
  button-ticket-hover:
    backgroundColor: "{colors.amber-soft}"
    textColor: "{colors.navy}"
  button-round:
    backgroundColor: "{colors.navy-soft}"
    textColor: "{colors.white}"
    rounded: "{rounded.round}"
    width: "52px"
    height: "52px"
  button-round-hover:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy}"
  button-timbre:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    rounded: "{rounded.round}"
    width: "88px"
    height: "88px"
  button-timbre-pressed:
    backgroundColor: "{colors.red-bright}"
    textColor: "{colors.white}"
  link-project:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  link-project-hover:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy}"
  field:
    backgroundColor: "{colors.navy-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
  boleto:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "30px 32px"
  ventanilla:
    backgroundColor: "{colors.navy-deep}"
    rounded: "{rounded.window}"
    padding: "12px"
---

# Design System: Línea Mateo

## Overview

**Creative North Star: "Línea Mateo"**

The page is a Buenos Aires colectivo route. The navy ground is the bus livery, and each section is a stop along the line: Inicio, Skills, Proyectos, Contacto. The header carries the route itself, a four-stop line with a bus that moves along it on damped spring physics. The LED destination sign in the hero is the memorable first moment, drawn in amber dot-matrix on canvas. Projects are printed boletos on paper stock, and contact is the round red timbre you press to get off.

The personality is friendly and plain-spoken, in Spanish with rioplatense ease. Density is generous: one stop fills most of a viewport, and projects are full-bleed livery bands rather than cards in a grid. The world is literal on purpose. Objects that exist on a bus (the sign housing, the ticket machine, the window, the paper ticket, the bell) carry physical depth. Surfaces that are only print (livery bands, text) stay flat.

This system was recorded from the built site. Where the build diverges from the original concept, the build is what is written here.

**Key Characteristics:**
- Navy livery ground with full-bleed colour bands per section and per project.
- Amber dot-matrix LED sign, rendered in canvas from `src/scripts/led.ts`.
- Paper boletos with perforated top and bottom edges.
- Round red timbre as the contact submit; notched amber ticket as the primary action.
- Header route line with four stops and a spring-driven bus.
- Big Shoulders Display for headings and labels over Archivo Variable for body.

## Colors

The palette is closed: navy and its two depths, the amber family, yellow, red, green, blue, one violet livery, paper, and white. Nothing else appears in the build.

### Primary
- **Livery Navy** (#0b1a3a): The page ground for hero, bio, and the body of the site, and the text colour on amber and yellow. Used as `--navy`.
- **Route Amber** (#ffb000): The signal colour. LED characters, the bus, the active stop, the primary ticket button, the round hover fill, and the scrollbar. Used as `--amber`, and as `--led-on` for the sign.
- **Timbre Red** (#c8261a): The contact band, the route badge in the hero sign, the skills heading accent, the stamp on boletos, and the timbre cap. Used as `--red`.

### Secondary
- **Skills Yellow** (#ffc21a): The skills band only. Used as `--yellow`. Navy text on yellow.
- **Amber Soft** (#ffd166): Hover state of the primary ticket button.
- **Navy Soft** (#16295a): Round social button fill and input border.

### Tertiary
- **Livery Green** (#1fa774), **Livery Blue** (#2f6fd0), **Livery Violet** (#6b3fa0): The livery band cycle for projects, in the order blue, red, amber, green, violet. Green is also in the hero and footer band stripe. Blue is defined as `--blue`, but the project bands take their colours as literal hex in `Proyectos.astro`; violet exists only as that literal.
- **Red Bright** (#ff3b2a): Pressed timbre and invalid field border.

### Neutral
- **Deep Navy** (#060f24): Footer ground, scrollbar track, form panel, window frame.
- **Paper** (#f4efe1): The boleto stock. Used only on the printed ticket.
- **Ink** (#0b1a3a) and **Ink Soft** (#3d4a68): Text on paper.
- **Muted on Navy** (#b9c3dc): Secondary text on navy and red grounds.
- **White** (#ffffff): Primary text on dark grounds.
- **LED Off** (#2b2010): Unlit LED dots.

### Named Rules
**The Livery Rule.** Every section and every project is a full-bleed band of one livery colour. Navy carries the page, yellow is the skills stop, red is the contact stop, and the project bands cycle the five livery colours in order.

**The Route Colour Rule.** Amber is the one signal colour. It marks the current stop, the bus, the LED characters and the primary action. Its rarity on text is the point.

## Typography

**Display Font:** Big Shoulders Display (with Archivo Variable, sans-serif)
**Body Font:** Archivo Variable (with system-ui, sans-serif)
**Label Font:** Big Shoulders Display, uppercase

**Character:** A condensed, poster-like display face for stops, destinations and buttons, which reads like route signage. Archivo Variable is a neutral grotesque that keeps long Spanish copy readable. Both are self-hosted through @fontsource.

### Hierarchy
- **Display** (800, clamp(3rem, 8vw, 6rem), line-height 0.95, -0.01em, uppercase): The hero name `h1`. Also the footer line "Fin del recorrido" at weight 900.
- **Headline** (800, clamp(2.8rem, 7vw, 5.5rem), line-height 0.95): Section headings `h2` (Lo que llevo a bordo, Proyectos, ¿Te bajás acá?). Proyectos runs larger, up to 9rem; Contacto runs up to 7.5rem.
- **Title** (800, clamp(2.4rem, 4.6vw, 3.6rem), line-height 0.95): The project name `h3` on each boleto.
- **Body** (400, 1.0625rem, line-height 1.6): Running copy. Bio and descriptions cap at 52–60ch. Archivo Variable weight 650 appears on tags and emphasis.
- **Label** (600 to 900, 0.8–1.25rem, letter-spacing 0.04–0.14em, uppercase): Route stops, the role line under the hero name, boleto headers, the project link, and the timbre instruction. Labels inherit Big Shoulders Display.

### Named Rules
**The Destination Caps Rule.** Headings and labels are set in Big Shoulders Display, uppercase, and never in a system display face. Body copy stays in Archivo Variable in sentence case.

## Layout

The container is 1180px, centred, with horizontal padding of `--gutter` (clamp(16px, 4vw, 56px)). Section bands are full-bleed, so the livery colour runs to the viewport edge while content sits in the container.

Vertical rhythm: sections pad by `clamp(80px, 11vw, 140px)` at the top and bottom on Proyectos and Contacto, and `clamp(72px, 10vw, 128px)` on Skills. The hero pads from the fixed header height (`--header-h`, 64px) plus `clamp(20px, 4vw, 48px)`. Anchor targets clear the header through `scroll-padding-top: calc(64px + 8px)`.

Splits: the hero is a 340px portrait window beside the copy. Projects split 5fr to 7fr, with the boleto machine on one side and the screen window on the other, alternating on even projects. Contact splits 1fr to 1fr. Skills is three columns.

Responsive behaviour: at 860px the project and contact splits stack to one column. At 820px skills stacks to one column. At 760px the hero stacks, and the hero window narrows to `min(220px, 60vw)`. At 640px the header hides the route badge text and shrinks the stop labels to 0.68rem.

## Elevation & Depth

Depth is physical and selective. Objects that exist in the bus cast soft, large-blur shadows, and print surfaces stay flat. The sign housing, the ticket machine, the window frame, the paper boleto, the bus and the timbre each carry a shadow that matches their weight. Livery bands and text carry none.

### Shadow Vocabulary
- **Lifted housing** (`box-shadow: 0 18px 40px -12px rgba(0, 0, 0, 0.6)`): The LED sign housing.
- **Window drop** (`box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.6)`): The hero portrait window. The project screen window uses `0 30px 60px -24px rgba(0, 0, 0, 0.55)`.
- **Ticket machine** (`box-shadow: 0 10px 20px -8px rgba(0, 0, 0, 0.5)`): The boletera header.
- **Paper drop** (`filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.28))`): The boleto paper. Used as a filter because the mask clips box-shadow.
- **Timbre rest** (`box-shadow: 0 8px 18px -6px rgba(0, 0, 0, 0.6), inset 0 -3px 0 rgba(0, 0, 0, 0.25)`): The timbre at rest.
- **Bus drop** (`filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45))`): The bus in the header track.

### Named Rules
**The Physical Object Rule.** Only objects that exist in the bus carry depth. Shadows are large and soft, and they never appear on livery bands or on text.

## Shapes

Form language mixes three families. Hardware is rounded and heavy: the sign housing at 18px, the ticket machine with 14px top corners and 6px bottom corners, the timbre and the round social buttons as full circles. Print is flat with a perforated edge: the boleto uses a mask of 6px radial notches on an 18px pitch along top and bottom. The primary action is a notched ticket, with 9px half-circle notches cut at each end. Windows use the shared 28px window radius, with the inner image at 16–18px.

Pills (999px) are reserved for project links. Inputs use 12px. Tags use 4px, and the route stamp uses 6px. Border-radius is not used for the bus itself, which is a flat rounded rectangle with two rectangle windows and two wheels.

## Components

### Buttons
- **Ticket (primary):** The notched amber button, 14px by 26px padding, Big Shoulders Display 800 at 1.25rem, uppercase, letter-spacing 0.04em. It is the CV download. Hover lifts 2px to amber-soft. Press drops 1px and turns white.
- **Round (social):** A 52px circle in navy-soft with a 2px white-18% ring. Hover fills amber, text turns navy, and it lifts 2px. Press drops 1px.
- **Timbre (contact submit):** An 88px circle with a steel ring (radial gradient #e5e9f2 to #7d879c) and a red cap inset 12px. Hover nudges the cap up 1px. Press depresses the cap 4px. The `data-pressed` state turns the cap bright red with a red glow, and the button disables while the message sends.

### Project Link
- **Shape:** Pill (999px), navy fill, white label in Big Shoulders Display 800, 1.15rem, uppercase. Padding 12px by 20px.
- **Hover:** Amber fill, navy text, lift 2px.

### Boleto (Project Card)
- **Corner Style:** Flat paper with perforated top and bottom edges. No radius.
- **Background:** Paper (#f4efe1) with a faint 22px right-edge fold line in navy at 4%.
- **Shadow Strategy:** Paper drop filter.
- **Header:** A dashed rule under the strip "Línea M" and "Boleto Nº"; the strip is Big Shoulders Display 700 at 0.95rem with letter-spacing 0.14em.
- **Tags:** 4px-radius outlined boxes in ink, 1.5px border, 0.82rem uppercase.
- **Sello:** A red-outlined stamp, rotated -6deg, 3px border, 6px radius. It appears on client projects only.

### Window (Screen)
- **Shape:** A 28px-radius frame in deep navy with 12px padding. The screen inside is 16:10 with a 16px radius, set 12px inside the frame. Bot screenshot uses a white field with 12% padding.

### Field
- **Style:** Deep navy fill, 2px navy-soft stroke, 12px radius, 14px by 16px padding, white text.
- **Focus:** Amber stroke plus a 4px amber-22% halo.
- **Error:** Red-bright stroke on user-invalid.

### LED Sign
- **Shape:** Housing in #120d05 with an inset 2px #2b2418 ring, 18px radius. Screen inset in #0a0703 at 10px radius. Characters are amber on the canvas, with unlit dots in `--led-off`.
- **Behaviour:** Reads `--led-on` and `--led-off` from CSS at runtime. The hero sign runs an intro sequence and scrolls messages; the contact sign shows "Próxima parada / Contacto" and changes to "Parada solicitada" on submit.

### Route Header
- **Shape:** Fixed bar, 64px tall, navy-deep at 88% with a 10px backdrop blur and a 1px white-8% bottom rule.
- **Track:** A 4px line from the centre of the first stop to the centre of the last, in white-16%, filled amber by progress. The bus is a 34px vector bus that moves along the track on a damped spring (stiffness 38, damping ratio 0.92).
- **Stops:** Four stops (Inicio, Skills, Proyectos, Contacto) in uppercase 0.8rem. Current stop is amber with an enlarged dot. Passed stops fill amber.

## Do's and Don'ts

### Do:
- **Do** set every section on a full-bleed livery band, cycling the project colours in order blue, red, amber, green, violet.
- **Do** keep amber as the single signal colour for current state, the bus, the LED and the primary action.
- **Do** make primary actions physical: the notched ticket for the CV and the round red timbre for contact.
- **Do** keep print surfaces (boletos, windows) on the paper and navy stock, with perforated or framed edges.
- **Do** use the 1180px container and `--gutter` for all content width.

### Don't:
- **Don't** set body or heading text in Archivo or Big Shoulders in a light or pale colour on yellow or amber; navy is the ink on those grounds.
- **Don't** introduce a hue outside the palette above.
- **Don't** replace the perforated boleto, the notched ticket or the round timbre with flat rectangles; those shapes are the identity.
- **Don't** set headings in a system display face.
- **Don't** copy the hard offset shadows on the timbre cap or the skills plate. They are build defects, not the system.
- **Don't** put a shadow on a livery band or on text.
