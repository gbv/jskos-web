import { createApp } from "vue"
import App from "./App.vue"

import state from "./state.js"

import { UserStatus, Login } from "gbv-login-client-vue"

createApp(App)
  .use(Login)
  .use(UserStatus)
  .use(state)
  .mount("#app")
