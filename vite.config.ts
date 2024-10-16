import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Formiverse',
      short_name: 'formiverse',
      description: 'Create and manage forms effortlessly',
      theme_color: '#7248B9',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/google-forms.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/add.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/bussiness-man.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/contact-form.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/feedback.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/formLogo.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/oops.png',
          sizes: '613x407',
          type: 'image/png',
        },
        {
          src: '/party-card.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      screenshots: [
        {
          src: '/formiversemobile.png',
          sizes: '453x796',
          type: 'image/png',
        },

      ]
    },
  }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
