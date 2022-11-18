import { reactive, readonly } from "vue"
import jskos from "jskos-tools"

// See vite.config.js for available environment configurations.
// eslint-disable-next-line no-undef
const loginServers = (LOGIN_SERVER || "").split(",").filter(Boolean)
// eslint-disable-next-line no-undef
const jskosServers = (JSKOS_SERVER || "").split(",").filter(Boolean)

// BARTOC for loading concept data
import { cdk } from "cocoda-sdk"
const bartoc = cdk.initializeRegistry({
  provider: "ConceptApi",
  uri: "http://coli-conc.gbv.de/registry/bartoc",
  status: "https://bartoc.org/api/status",
  schemes: "https://bartoc.org/api/voc?partOf=http%3A%2F%2Fbartoc.org%2Fen%2Fnode%2F18926",
})

const state = reactive({
  items: {},
  addItem(item, source) {
    let uris
    if (!item && source) {
      uris = jskos.getAllUris(source)
    } else {
      uris = jskos.getAllUris(item)
    }
    uris.forEach(uri => {
      state.items[uri] = item
    })
  },
  getItem(item, fallback = true) {
    const uris = jskos.getAllUris(item)
    for (const uri of uris) {
      const itemFromState = state.items[uri]
      if (itemFromState !== undefined) {
        return itemFromState
      }
    }
    return fallback ? item : undefined
  },
  registries: {
    bartoc,
  },
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
  initialized: false,
  _initPromise: null,
  async init() {
    // Make sure init is only called once; otherwise wait for existing promise
    if (state._initPromise) {
      await state._initPromise
    } else {
      state._initPromise = (async () => {
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
        // Load schemes from BARTOC
        const schemes = await bartoc.getSchemes()
        schemes.forEach(scheme => {
          state.addItem(scheme)
        })

        state.initialized = true
      })()
    }
  },
})

export default readonly(state)
