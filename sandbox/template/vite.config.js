import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const sandboxId = process.env.SANDBOX_ID
const hmrHost = sandboxId ? `${sandboxId}.preview.localhost` : 'localhost'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      host: hmrHost,
      clientPort: 80,
      protocol: "ws",
    },
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ["**/node_modules/**", "**/.git/**"],
    }
  }
})
