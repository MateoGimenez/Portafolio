---
version: 1
slug: "src-layouts-layout-astro"
primary_target: "src/layouts/Layout.astro"
related_targets: ["src/components"]
---

Scope: whole portfolio page (src/layouts/Layout.astro + src/components/*). Visitor mode: Experience.
Audience: recruiters and freelance clients, equal weight. Action: download CV, LinkedIn/GitHub, contact form (formsubmit).
Memorable moment: LED destination sign intro + bus moving along the route as you scroll; boletera printing each project ticket.

## Direction contract

THESIS: The portfolio is a Buenos Aires colectivo route, "Línea Mateo": sections are stops, projects are printed boletos, contact is pressing the timbre. Refuses the dark hero + card grid portfolio template.

OWN-WORLD: Navy livery enamel ground (#0b1a3a) with page-scale livery bands in amber/yellow, red and green; amber dot-matrix LED destination sign drawn in canvas; boletos on ticket paper with perforated edges and stamped tech; round red timbre button; route line with stops; Big Shoulders Display (city signage) over Archivo body.

STORY: Visitor reads the sign (who Mateo is), rides the route through skills and real client projects, and gets off at contact by ringing the bell.

FIRST VIEWPORT: Full-width LED destination sign housing at top-center, ~40% of viewport height, writing GIMENEZ MATEO then cycling DEV WEB / JS · REACT · NODE; beneath, photo in a bus window frame left, name, title, short bio right, CV boleto button primary plus LinkedIn/GitHub; route line with stops starts at the bottom edge.

AMENDMENTS (after finish review): LED housing is ~25% of the first viewport, not 40%, so the full name fits one line on desktop; on phones the sign uses larger dots and splits by word. The route line lives in the fixed header for the whole page instead of starting at the hero's bottom edge, so the bus is visible at every stop.

FORM: Colectivo porteño, position 6 of 7 on the ordered list. seed:36f8b7eef48c1ca6. Signature interaction: the bus rides the route line with damped inertia following scroll; each project ticket prints out of the boletera slot (clip-path) on entering view; timbre lights PARADA SOLICITADA on submit. Raises: strict state vocabulary (one-bit), single axis of travel (agit-train), full-page color per project (yé-yé), damped physical motion (six-pack).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
