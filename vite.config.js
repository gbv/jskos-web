import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

import dotenv from "dotenv"
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ["gbv-login-client"],
  },
  define: {
    LOGIN_SERVER: `"${process.env.LOGIN_SERVER}"`,
    JSKOS_SERVER: `"${process.env.JSKOS_SERVER}"`,
  },
})
