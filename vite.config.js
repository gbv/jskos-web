import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath } from "url"

import dotenv from "dotenv"
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ["gbv-login-client"],
  },
  define: {
    LOGIN_SERVER: `"${process.env.LOGIN_SERVER || ""}"`,
    JSKOS_SERVER: `"${process.env.JSKOS_SERVER || ""}"`,
    BASE: `"${process.env.BASE || ""}"`,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // Use base / for everything other than production
  base: process.env.NODE_ENV === "production" ? process.env.BASE : "/",
})
