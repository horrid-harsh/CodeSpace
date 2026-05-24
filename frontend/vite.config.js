import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function getSandboxIdFromUrl(req) {
  const requestUrl = new URL(req.url, 'http://localhost')
  return requestUrl.searchParams.get('sandboxId')
}

function setSandboxAgentHost(proxyReq, req) {
  const sandboxId = getSandboxIdFromUrl(req)
  if (!sandboxId) return

  proxyReq.setHeader('Host', `${sandboxId}.agent.localhost`)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    cors: {
      origin: /^https:\/\/(?:.+\.)?localhost(?::\d+)?$/
    },
    proxy: {
      "/api": {
        target: "http://localhost",
        changeOrigin: true,
        secure: false
      },
      "/socket.io": {
        target: "http://localhost",
        ws: true,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', setSandboxAgentHost)
          proxy.on('proxyReqWs', setSandboxAgentHost)
        }
      }
    }
  }
})
