import { reactive, readonly } from "vue"

// See vite.config.js for available environment configurations.
// eslint-disable-next-line no-undef
const loginServers = (LOGIN_SERVER || "").split(",")
// eslint-disable-next-line no-undef
const jskosServers = (JSKOS_SERVER || "").split(",")

const state = reactive({
  config: {
    login: loginServers.map((server) => {
      if (!server.endsWith("/")) {
        server += "/"
      }
      const [ , protocol, url ] = server.match(/(https?:\/\/)(.*)/)
      let ssl = false
      if (!protocol || protocol.startsWith("https")) {
        ssl = true
      }
      return {
        url,
        ssl,
      }
    }),
    jskos: jskosServers.map((url) => {
      if (!url.endsWith("/")) {
        url += "/"
      }
      return {
        type: "http://bartoc.org/api-type/jskos",
        url,
      }
    }),
  },
  selectedServer: null,
  setSelectedServer(server) {
    state.selectedServer = server
  },
  install(vue) {
    vue.provide("state", readonly(state))
  },
  async init() {
    // Load configurations for Login Servers
    for (let server of state.config.login) {
      try {
        server.about = await (await fetch(`${server.ssl ? "https" : "http"}://${server.url}about`)).json()
      } catch (error) {
        //
      }
    }
    // Load configurations for JSKOS servers
    for (let server of state.config.jskos) {
      try {
        server.about = await (await fetch(`${server.url}status`)).json()
        server.login = state.config.login.find((login) => server.about.config.auth.key === (login.about && login.about.publicKey))
      } catch (error) {
        //
      }
    }
    // Select first server with available login
    state.selectedServer = state.config.jskos.find((server) => server.login)
  },
})

export default readonly(state)
