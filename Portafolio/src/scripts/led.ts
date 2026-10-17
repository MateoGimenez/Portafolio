// Cartel de destino de colectivo: matriz de puntos 5x7 dibujada en canvas.

const GLYPHS: Record<string, string> = {
  A: "01110100011000111111100011000110001",
  B: "11110100011000111110100011000111110",
  C: "01110100011000010000100001000101110",
  D: "11110100011000110001100011000111110",
  E: "11111100001000011110100001000011111",
  F: "11111100001000011110100001000010000",
  G: "01110100011000010111100011000101111",
  H: "10001100011000111111100011000110001",
  I: "01110001000010000100001000010001110",
  J: "00111000100001000010000101001001100",
  K: "10001100101010011000101001001010001",
  L: "10000100001000010000100001000011111",
  M: "10001110111010110101100011000110001",
  N: "10001100011100110101100111000110001",
  O: "01110100011000110001100011000101110",
  P: "11110100011000111110100001000010000",
  Q: "01110100011000110001101011001001101",
  R: "11110100011000111110101001001010001",
  S: "01111100001000001110000010000111110",
  T: "11111001000010000100001000010000100",
  U: "10001100011000110001100011000101110",
  V: "10001100011000110001100010101000100",
  W: "10001100011000110101101011010101010",
  X: "10001100010101000100010101000110001",
  Y: "10001100010101000100001000010000100",
  Z: "11111000010001000100010001000011111",
  "0": "01110100011001110101110011000101110",
  "1": "00100011000010000100001000010001110",
  "2": "01110100010000100010001000100011111",
  "3": "11111000100010000010000011000101110",
  "4": "00010001100101010010111110001000010",
  "5": "11111100001111000001000011000101110",
  "6": "00110010001000011110100011000101110",
  "7": "11111000010001000100010000100001000",
  "8": "01110100011000101110100011000101110",
  "9": "01110100011000101111000010001001100",
  "?": "01110100010000100010001000000000100",
  "¿": "00100000000010001000100001000101110",
  "!": "00100001000010000100001000000000100",
  ".": "00000000000000000000000000110001100",
  ",": "00000000000000000000011000010001000",
  ":": "00000011000110000000011000110000000",
  "-": "00000000000000011111000000000000000",
  "/": "00001000010001000100010001000010000",
  "·": "00000000000000000100000000000000000",
  "@": "01110100011011110101101111000001110",
};

const ROWS = 7;
const PAD_ROWS = 2;

function normalize(text: string) {
  return text
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Convierte un texto en columnas de bits (cada columna = 7 filas). */
function textToColumns(text: string): number[][] {
  const cols: number[][] = [];
  for (const ch of normalize(text)) {
    if (ch === " ") {
      cols.push(Array(ROWS).fill(0), Array(ROWS).fill(0), Array(ROWS).fill(0));
      continue;
    }
    const g = GLYPHS[ch];
    if (!g) continue;
    for (let x = 0; x < 5; x++) {
      const col: number[] = [];
      for (let y = 0; y < ROWS; y++) col.push(g[y * 5 + x] === "1" ? 1 : 0);
      cols.push(col);
    }
    cols.push(Array(ROWS).fill(0));
  }
  if (cols.length) cols.pop();
  return cols;
}

type Options = {
  messages: string[];
  hold?: number;
  maxPitch?: number;
  minPitch?: number;
  targetCols?: number;
  intro?: boolean;
};


export class LedSign {
  private ctx: CanvasRenderingContext2D;
  private pitch = 10;
  private cols = 0;
  private width = 0;
  private dpr = 1;
  private rows = ROWS + PAD_ROWS * 2;
  private grid: Float32Array = new Float32Array(0);
  private target: Uint8Array = new Uint8Array(0);
  private msgIndex = 0;
  private visible = true;
  private raf = 0;
  private timer = 0;
  private reduced: boolean;
  private phase: "intro" | "wipe" | "hold" | "scroll" = "wipe";
  private phaseStart = 0;
  private msgCols: number[][] = [];
  private lines: string[] = [];
  private amber: string;
  private dim: string;

  constructor(private canvas: HTMLCanvasElement, private opts: Options) {
    this.ctx = canvas.getContext("2d")!;
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cs = getComputedStyle(canvas);
    this.amber = cs.getPropertyValue("--led-on").trim() || "#ffb000";
    this.dim = cs.getPropertyValue("--led-off").trim() || "#2b2010";
    if (!opts.messages.length) opts.messages = [" "];
    this.phase = opts.intro && !this.reduced ? "intro" : "wipe";
    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas);
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.resume();
      else this.pause();
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden ? this.pause() : this.resume()));
  }

  /** Cambia los mensajes en vivo (por ejemplo, el timbre). */
  show(messages: string[]) {
    this.opts.messages = messages.length ? messages : [" "];
    this.cols = 0; // fuerza a recalcular el tamaño de los puntos para el texto nuevo
    if (this.phase !== "intro") this.phase = "wipe";
    this.resize();
  }

  private pause() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.timer);
    this.raf = 0;
  }

  private resume() {
    if (!this.visible || document.hidden) return;
    this.pause();
    if (this.phase === "hold") this.scheduleNext();
    else {
      this.phaseStart = performance.now();
      this.loop();
    }
  }

  /** Columnas que ocupa la palabra más larga: el cartel nunca la corta. */
  private longestWord() {
    let max = 0;
    for (const msg of this.opts.messages)
      for (const word of msg.split(" ")) max = Math.max(max, textToColumns(word).length);
    return max;
  }

  private resize() {
    const w = this.canvas.clientWidth;
    if (!w) return;
    const { maxPitch = 16, minPitch = 4, targetCols = 84 } = this.opts;
    // En pantallas angostas, puntos más grandes: el cartel parte el texto en palabras.
    const wanted = Math.max(w < 600 ? Math.min(targetCols, 44) : targetCols, this.longestWord() + 2);
    const pitch = Math.max(minPitch, Math.min(maxPitch, w / wanted));
    const cols = Math.floor(w / pitch);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (cols === this.cols && w === this.width && dpr === this.dpr) return;

    const colsChanged = cols !== this.cols;
    this.pitch = pitch;
    this.width = w;
    this.dpr = dpr;
    const h = this.rows * pitch;
    this.canvas.style.height = `${h}px`;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (colsChanged) {
      this.cols = cols;
      this.grid = new Float32Array(cols * this.rows);
      this.target = new Uint8Array(cols * this.rows);
      this.setMessage(Math.min(this.msgIndex, Math.max(0, this.lines.length - 1)));
    }
    // Cambiar el tamaño del canvas lo borra: redibujar aunque esté fuera de pantalla.
    this.draw();
  }

  /** Parte cada frase en renglones que entren, cortando primero en " · " y después en espacios. */
  private fitMessages(): string[] {
    const fits = (s: string) => textToColumns(s).length <= this.cols;
    const out: string[] = [];
    for (const msg of this.opts.messages) {
      if (fits(msg)) {
        out.push(msg);
        continue;
      }
      // Cada pedazo recuerda con qué separador se une al anterior.
      const pieces: { text: string; sep: string }[] = [];
      msg.split(" · ").forEach((group, g) => {
        const words = fits(group) ? [group] : group.split(" ");
        words.forEach((text, w) => pieces.push({ text, sep: w === 0 && g > 0 ? " · " : " " }));
      });
      let line = "";
      for (const { text, sep } of pieces) {
        const next = line ? line + sep + text : text;
        if (line && !fits(next)) {
          out.push(line);
          line = text;
        } else line = next;
      }
      if (line) out.push(line);
    }
    return out;
  }

  private setMessage(i: number) {
    this.pause();
    this.lines = this.fitMessages();
    this.msgIndex = i % this.lines.length;
    this.msgCols = textToColumns(this.lines[this.msgIndex]);
    const tooWide = this.msgCols.length > this.cols;
    this.composeTarget(tooWide ? (this.reduced ? 0 : this.cols) : -1);
    this.phaseStart = performance.now();
    if (this.reduced) {
      this.grid.set(this.target);
      this.enterHold();
      return;
    }
    if (this.phase !== "intro") this.phase = "wipe";
    this.loop();
  }

  /** offset >= 0: posición de scroll; -1: centrado. */
  private composeTarget(offset: number) {
    this.target.fill(0);
    const len = this.msgCols.length;
    const start = offset < 0 ? Math.floor((this.cols - len) / 2) : offset;
    for (let c = 0; c < len; c++) {
      const x = start + c;
      if (x < 0 || x >= this.cols) continue;
      const col = this.msgCols[c];
      for (let y = 0; y < ROWS; y++) {
        if (col[y]) this.target[(y + PAD_ROWS) * this.cols + x] = 1;
      }
    }
  }

  /** Cuadros de animación solo mientras algo se mueve (encendido, barrido, desplazamiento). */
  private loop = () => {
    cancelAnimationFrame(this.raf);
    if (!this.visible || document.hidden) return;
    this.raf = requestAnimationFrame((t) => {
      this.step(t);
      this.draw();
      if (this.phase === "hold") this.enterHold();
      else this.loop();
    });
  };

  /** Mensaje quieto: se dibuja una vez y el siguiente se agenda con un timer. */
  private enterHold() {
    this.phase = "hold";
    this.draw();
    this.scheduleNext();
  }

  private scheduleNext() {
    clearTimeout(this.timer);
    if (this.lines.length < 2 || !this.visible || document.hidden) return;
    this.timer = window.setTimeout(() => this.setMessage(this.msgIndex + 1), this.opts.hold ?? 2600);
  }

  private step(now: number) {
    const elapsed = now - this.phaseStart;
    const n = this.cols * this.rows;

    if (this.phase === "intro") {
      // Encendido: los puntos parpadean al azar antes de mostrar el destino.
      for (let i = 0; i < n; i++) this.grid[i] = Math.random() < 0.18 * (1 - elapsed / 700) ? 1 : 0;
      if (elapsed > 700) {
        this.grid.fill(0);
        this.phase = "wipe";
        this.phaseStart = now;
      }
      return;
    }

    if (this.phase === "wipe") {
      // Barrido columna por columna, como el cartel al cambiar de destino.
      const wipeCol = Math.floor((elapsed / 700) * this.cols);
      for (let x = 0; x < this.cols; x++) {
        for (let y = 0; y < this.rows; y++) {
          const i = y * this.cols + x;
          if (x <= wipeCol) this.grid[i] += (this.target[i] - this.grid[i]) * 0.5;
          else this.grid[i] *= 0.75;
        }
      }
      if (wipeCol >= this.cols + 2) {
        this.grid.set(this.target);
        this.phase = this.msgCols.length > this.cols ? "scroll" : "hold";
        this.phaseStart = now;
      }
      return;
    }

    if (this.phase === "scroll") {
      // Último recurso si una palabra no entra ni con los puntos más chicos.
      const offset = this.cols - Math.floor(elapsed * 0.028);
      this.composeTarget(offset);
      this.grid.set(this.target);
      if (offset < -this.msgCols.length) {
        if (this.lines.length > 1) this.setMessage(this.msgIndex + 1);
        else this.phaseStart = now;
      }
    }
  }

  private draw() {
    const { ctx, pitch, cols, rows } = this;
    const r = pitch * 0.36;
    ctx.clearRect(0, 0, cols * pitch, rows * pitch);
    ctx.fillStyle = this.dim;
    ctx.beginPath();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (this.grid[y * cols + x] > 0.5) continue;
        ctx.moveTo(x * pitch + pitch / 2 + r, y * pitch + pitch / 2);
        ctx.arc(x * pitch + pitch / 2, y * pitch + pitch / 2, r, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    ctx.fillStyle = this.amber;
    ctx.shadowColor = this.amber;
    ctx.shadowBlur = pitch * 0.9;
    ctx.beginPath();
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (this.grid[y * cols + x] <= 0.5) continue;
        ctx.moveTo(x * pitch + pitch / 2 + r, y * pitch + pitch / 2);
        ctx.arc(x * pitch + pitch / 2, y * pitch + pitch / 2, r, 0, Math.PI * 2);
      }
    }
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
