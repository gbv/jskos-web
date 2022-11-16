import { createApp } from "vue"
import "@/style.css"

import App from "@/App.vue"
const app = createApp(App)

import router from "@/router.js"
app.use(router)

import state from "@/state.js"
app.use(state)

import { UserStatus, Login } from "gbv-login-client-vue"
app.use(Login)
app.use(UserStatus)

import "jskos-vue/dist/style.css"
import { ItemName, AutoLink } from "jskos-vue"
app.use(ItemName)
app.use(AutoLink)

app.mount("#app")
