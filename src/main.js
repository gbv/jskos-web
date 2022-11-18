import { createApp } from "vue"

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
import { ItemName, ItemList, AutoLink, LoadingIndicator } from "jskos-vue"
app.use(ItemName)
app.use(ItemList)
app.use(AutoLink)
app.use(LoadingIndicator)

import jskos from "jskos-tools"
app.config.globalProperties.jskos = jskos

import "@/style.css"

app.mount("#app")
