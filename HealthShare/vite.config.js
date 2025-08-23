import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',   
      devOptions: {
        enabled: true,              
      },
      manifest: {
        name: "HealthShare",
        short_name: "HealthShare",
        description: "Upload your images and PDFs instantly. Get shareable QR codes for easy access anywhere.",
        theme_color: "#317EFB",
        background_color: "#ffffff",
        display: "standalone",   
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})
