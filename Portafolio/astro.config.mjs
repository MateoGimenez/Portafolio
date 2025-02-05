import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind'; // ✅ Integración oficial de Astro para Tailwind

export default defineConfig({
  integrations: [tailwind()] // 👈 Así debe quedar
});