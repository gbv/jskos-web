import { createApp } from "vue"
import "@/style.css"
import App from "@/App.vue"
import router from "@/router.js"

import state from "@/state.js"

import { UserStatus, Login } from "gbv-login-client-vue"

createApp(App)
  .use(Login)
  .use(UserStatus)
  .use(state)
  .use(router)
  .mount("#app")
