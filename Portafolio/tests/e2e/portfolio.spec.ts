import { test, expect } from "@playwright/test";
import { collectErrors, horizontalOverflow, litAmberPixels } from "./helpers";

const STOPS = [
  { label: "Inicio", id: "inicio" },
  { label: "Skills", id: "skills" },
  { label: "Proyectos", id: "proyectos" },
  { label: "Contacto", id: "contacto" },
];

test.describe("carga", () => {
  test("sin errores de consola ni overflow horizontal", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1500);

    let o = await horizontalOverflow(page);
    expect(o.scrollWidth, `scrollWidth ${o.scrollWidth} > innerWidth ${o.innerWidth} (top)`).toBeLessThanOrEqual(o.innerWidth);

    // Recorrer la página entera (dispara las animaciones de proyectos) y volver a medir.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += 600) {
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1500);
    o = await horizontalOverflow(page);
    expect(o.scrollWidth, `scrollWidth ${o.scrollWidth} > innerWidth ${o.innerWidth} (after scroll)`).toBeLessThanOrEqual(o.innerWidth);

    expect(errors, errors.join("\n")).toEqual([]);
  });
});

test.describe("header / recorrido", () => {
  test("4 paradas con hrefs y secciones destino", async ({ page }) => {
    await page.goto("/");
    const links = page.locator("header nav a[data-stop]");
    await expect(links).toHaveCount(4);
    for (let i = 0; i < STOPS.length; i++) {
      const link = links.nth(i);
      await expect(link).toHaveText(STOPS[i].label);
      await expect(link).toHaveAttribute("href", `#${STOPS[i].id}`);
      await expect(page.locator(`section#${STOPS[i].id}`)).toHaveCount(1);
    }
    await expect(links.nth(0)).toHaveAttribute("aria-current", "true");
  });

  for (const stop of [...STOPS.slice(1), STOPS[0]]) {
    test(`clic en "${stop.label}" scrollea y marca aria-current`, async ({ page }) => {
      await page.goto("/");
      if (stop.id === "inicio") {
        // Para probar Inicio primero hay que alejarse.
        await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
        await page.waitForTimeout(400);
      }
      const link = page.locator(`header nav a[data-stop="${stop.id}"]`);
      await link.click();

      // La sección destino queda cerca del borde superior (debajo del header fijo).
      await expect
        .poll(
          async () =>
            page.evaluate((id) => {
              const r = document.getElementById(id)!.getBoundingClientRect();
              const atBottom =
                window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
              // Contacto puede no llegar arriba del todo si es la última sección.
              return r.top < window.innerHeight * 0.4 && (r.top > -5 || r.bottom > window.innerHeight * 0.5 || atBottom);
            }, stop.id),
          { timeout: 5000 },
        )
        .toBe(true);

      await expect(link).toHaveAttribute("aria-current", "true", { timeout: 5000 });
      await expect(page.locator('header nav a[aria-current="true"]')).toHaveCount(1);
    });
  }
});

test.describe("hero", () => {
  test("h1 y cartel LED encendido", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Gimenez Jorge Mateo");

    const led = page.locator(".hero .led");
    const box = await led.boundingBox();
    expect(box, "canvas sin bounding box").not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);

    await page.waitForTimeout(2000);
    await expect.poll(() => litAmberPixels(page, ".hero .led"), { timeout: 6000 }).toBeGreaterThan(50);
  });

  test("CV descargable y redes en pestaña nueva", async ({ page, request }) => {
    await page.goto("/");
    const cv = page.locator(".hero a", { hasText: "Descargar CV" });
    await expect(cv).toHaveAttribute("href", "/Curriculum 2025.pdf");
    const res = await request.head(encodeURI("/Curriculum 2025.pdf"));
    expect(res.status()).toBe(200);

    for (const host of ["linkedin.com", "github.com"]) {
      const a = page.locator(`.hero a[href*="${host}"]`);
      await expect(a).toHaveCount(1);
      await expect(a).toHaveAttribute("target", "_blank");
      await expect(a).toHaveAttribute("rel", /\bnoopener\b/);
    }
  });
});

test.describe("skills", () => {
  test("10 skills con icono svg", async ({ page }) => {
    await page.goto("/");
    const items = page.locator("#skills li");
    await expect(items).toHaveCount(10);
    for (let i = 0; i < 10; i++) {
      await expect(items.nth(i).locator("svg path"), `skill #${i} sin svg`).toHaveCount(1);
    }
  });
});

test.describe("proyectos", () => {
  test("6 viajes llegan a la parada al entrar en vista", async ({ page }) => {
    await page.goto("/");
    const viajes = page.locator("article.viaje");
    await expect(viajes).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const v = viajes.nth(i);
      await v.scrollIntoViewIfNeeded();
      await v.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(v).toHaveClass(/\ben-parada\b/);
      const vidrio = v.locator(".vidrio");
      await expect
        .poll(() => vidrio.evaluate((el) => getComputedStyle(el).transform), { timeout: 4000 })
        .toBe("none");
      await expect.poll(() => vidrio.evaluate((el) => getComputedStyle(el).opacity), { timeout: 4000 }).toBe("1");
      expect(await v.locator("a.link", { hasText: /Ver sitio|Ver código|Ver GitHub/ }).count()).toBeGreaterThanOrEqual(1);
    }
  });

  test("imágenes y videos responden 200", async ({ page, request }) => {
    await page.goto("/");
    const srcs = await page.$$eval("article.viaje img, article.viaje video source", (els) =>
      els.map((e) => e.getAttribute("src")!),
    );
    expect(srcs.length).toBe(6);
    for (const src of srcs) {
      const res = await request.head(encodeURI(src));
      expect(res.status(), `HEAD ${src}`).toBe(200);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("contenido visible sin animaciones y LED encendido", async ({ page }) => {
    await page.goto("/");
    const viajes = page.locator("article.viaje");
    await expect(viajes).toHaveCount(6);
    for (let i = 0; i < 6; i++) {
      const v = viajes.nth(i);
      expect(await v.locator(".boleto").evaluate((el) => getComputedStyle(el).transform), `boleto #${i}`).toBe("none");
      expect(await v.locator(".vidrio").evaluate((el) => getComputedStyle(el).opacity), `vidrio #${i} opacity`).toBe("1");
      expect(await v.locator(".vidrio").evaluate((el) => getComputedStyle(el).transform), `vidrio #${i} transform`).toBe("none");
    }
    await expect.poll(() => litAmberPixels(page, ".hero .led"), { timeout: 4000 }).toBeGreaterThan(50);
  });
});

test.describe("formulario de contacto", () => {
  test("campos requeridos: enviar vacío no navega", async ({ page }) => {
    let posted = false;
    await page.route("**/formsubmit.co/**", (route) => {
      posted = true;
      return route.fulfill({ status: 200, contentType: "text/html", body: "<p>ok</p>" });
    });
    await page.goto("/");
    const email = page.locator("#email");
    const mensaje = page.locator("#mensaje");
    await expect(email).toHaveAttribute("required", "");
    await expect(mensaje).toHaveAttribute("required", "");

    const url = page.url();
    const timbre = page.locator(".contacto .timbre");
    await timbre.scrollIntoViewIfNeeded();
    await timbre.click();
    await page.waitForTimeout(1500);

    expect(page.url()).toBe(url);
    expect(posted).toBe(false);
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.valueMissing)).toBe(true);
    expect(await mensaje.evaluate((el: HTMLTextAreaElement) => el.validity.valueMissing)).toBe(true);
    expect(await page.locator(".contacto form").evaluate((f: HTMLFormElement) => f.checkValidity())).toBe(false);
    await expect(timbre).not.toHaveAttribute("data-pressed", /.*/);
    expect(await page.locator(".contacto :invalid").count()).toBeGreaterThan(0);
  });

  test("envío válido: timbre presionado, estado aria-live y POST interceptado", async ({ page }) => {
    const posts: { method: string; body: string }[] = [];
    await page.route("**/formsubmit.co/**", (route) => {
      posts.push({ method: route.request().method(), body: route.request().postData() ?? "" });
      return route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><p>gracias</p>" });
    });
    await page.goto("/");
    await page.fill("#nombre", "Tester");
    await page.fill("#email", "tester@example.com");
    await page.fill("#mensaje", "Mensaje de prueba e2e");

    const timbre = page.locator(".contacto .timbre");
    await timbre.scrollIntoViewIfNeeded();
    await timbre.click();

    await expect(timbre).toHaveAttribute("data-pressed", "");
    const estado = page.locator(".contacto [data-estado]");
    await expect(estado).toHaveAttribute("aria-live", "polite");
    await expect(estado).toHaveText(/^Parada solicitada.*…$/);

    // A los ~900ms el form se envía de verdad (interceptado).
    await expect.poll(() => posts.length, { timeout: 5000 }).toBe(1);
    expect(posts[0].method).toBe("POST");
    expect(posts[0].body).toContain("email=tester%40example.com");
  });
});

test.describe("accesibilidad básica", () => {
  test("imágenes internas con alt", async ({ page }) => {
    await page.goto("/");
    const missing = await page.$$eval("img", (imgs) =>
      imgs
        .filter((i) => new URL(i.src, location.href).origin === location.origin)
        .filter((i) => !(i.getAttribute("alt") ?? "").trim())
        .map((i) => i.outerHTML),
    );
    expect(missing, missing.join("\n")).toEqual([]);
  });

  test("todos los links y botones tienen nombre accesible", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = (await cdp.send("Accessibility.getFullAXTree")) as {
      nodes: { ignored: boolean; role?: { value: string }; name?: { value: string }; backendDOMNodeId?: number }[];
    };
    const unnamed: string[] = [];
    for (const n of nodes) {
      if (n.ignored) continue;
      const role = n.role?.value;
      if (role !== "link" && role !== "button") continue;
      if ((n.name?.value ?? "").trim()) continue;
      let html = `backendDOMNodeId=${n.backendDOMNodeId}`;
      if (n.backendDOMNodeId) {
        const { outerHTML } = (await cdp.send("DOM.getOuterHTML", { backendNodeId: n.backendDOMNodeId })) as {
          outerHTML: string;
        };
        html = outerHTML.slice(0, 200);
      }
      unnamed.push(`${role}: ${html}`);
    }
    const count = nodes.filter((n) => !n.ignored && (n.role?.value === "link" || n.role?.value === "button")).length;
    expect(count).toBeGreaterThan(10);
    expect(unnamed, unnamed.join("\n")).toEqual([]);
  });
});
