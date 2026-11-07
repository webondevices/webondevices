import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served by webondevices.com at /demos/3d-product-page/. `npm run build`
// writes straight into the site's public/ folder, so `next build` copies it
// into out/ with everything else.
export default defineConfig({
  base: '/demos/3d-product-page/',
  plugins: [react()],
  build: { outDir: '../../public/demos/3d-product-page', emptyOutDir: true },
  // host: true → also reachable from phones on the same Wi-Fi (http://<mac-ip>:5174)
  server: { port: 5174, host: true },
})
