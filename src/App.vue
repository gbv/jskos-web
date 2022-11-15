<template>
  <header class="header">
    <a
      href="https://coli-conc.gbv.de/"
      class="coli-conc-logo-small">
      <img
        src="https://coli-conc.gbv.de/images/coli-conc.svg"
        alt="coli-conc Logo">
    </a>
    <h1>
      <router-link to="/">
        JSKOS Web
      </router-link>
    </h1>
    <ul class="menu">
      <li>
        <a
          href="https://coli-conc.gbv.de/"
          title="Go to coli-conc website">
          ⬅ back to coli-conc website
        </a>
      </li>
      <li>
        <user-status>
          <template #before>
            <p>
              Select JSKOS Server:
            </p>
            <ul>
              <li
                v-for="server in state.config.jskos"
                :key="server.url"
                :class="{
                  'selected-server': server === state.selectedServer,
                }">
                <a
                  href=""
                  @click.prevent="state.setSelectedServer(server)">
                  {{ (server.about && server.about.config.title) || server.url }}
                </a>
              </li>
            </ul>
            <hr>
          </template>
        </user-status>
      </li>
    </ul>
    <div style="clear:both" />
  </header>
  <main id="main">
    <!-- Empty div here to start the alternating section colors -->
    <div />
    <router-view />
    <div class="section">
      <h2>About</h2>
      <p>
        <b>JSKOS Web</b> is a web interface to view JSKOS data. Its source code and technical documentation are hosted on <a href="https://github.com/gbv/jskos-web">GitHub</a>.
      </p>
      <p>
        This project is still under construction.
      </p>
    </div>
  </main>
  <!-- The footer is mostly copied from https://coli-conc.gbv.de -->
  <footer class="footer">
    <p>
      <strong>coli-conc</strong> is a project of
      <a
        href="https://www.gbv.de/"
        target="_blank">Verbundzentrale des GBV (VZG)</a>.
      It is funded by German Research Foundation (DFG)
      <a
        href="https://gepris.dfg.de/gepris/projekt/276843344"
        target="_blank">2015-2019</a> and
      <a
        href="https://gepris.dfg.de/gepris/projekt/455051200"
        target="_blank">2021-2023</a>.
    </p>
    <p>
      <a
        href="https://www.gbv.de/impressum"
        target="_blank">Impressum</a> |
      <a href="https://coli-conc.gbv.de/erklaerung-zur-barrierefreiheit/">Barrierefreiheit</a> |
      <a
        href="https://www.gbv.de/datenschutz"
        target="_blank">Datenschutz</a>
    </p>
  </footer>
</template>

<script>
import { defineComponent, inject, watch } from "vue"

export default defineComponent({
  components: {
  },
  setup() {
    const state = inject("state")
    const login = inject("login")
    state.init()
    watch(() => state.selectedServer, (server) => {
      if (server && server.login) {
        login.connect(server.login.url, server.login)
      } else {
        login.disconnect()
      }
    })
    return {
      state,
    }
  },
})
</script>

<style>
.user-status {
  z-index: 9999;
}
.user-status > a {
  font-size: initial;
}
header .user-status li {
  float: none;
}
header .user-status li a {
  text-align: left;
}
header > h1 {
  float: left;
  padding: 18px 0 0 20px;
  font-size: 24px;
}
li.selected-server {
  background-color: #feffcc;
}
</style>
