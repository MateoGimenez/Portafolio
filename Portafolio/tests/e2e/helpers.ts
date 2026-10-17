import type { Page, ConsoleMessage } from "@playwright/test";

/** Registra errores de consola y excepciones no capturadas de la página. */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg: ConsoleMessage) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

/** Cuenta píxeles "encendidos" en ámbar (#ffb000 aprox.) dentro de un canvas. */
export async function litAmberPixels(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const c = document.querySelector<HTMLCanvasElement>(sel);
    if (!c || !c.width || !c.height) return -1;
    const ctx = c.getContext("2d");
    if (!ctx) return -1;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let lit = 0;
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (a > 200 && r > 220 && g > 140 && g < 210 && b < 80) lit++;
    }
    return lit;
  }, selector);
}

export async function horizontalOverflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
}
