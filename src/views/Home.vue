<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <h2>{{ $t("general.home") }}</h2>
    <p>
      <router-link to="/?uri=https://coli-conc.gbv.de/api/mappings/761fe565-3815-4c14-b277-4fc980639ced">
        Example Mapping
      </router-link> ·
      <router-link to="/?uri=https://coli-conc.gbv.de/api/mappings/15d5cc0a-1a31-42db-9b90-861363de16fb">
        Example Mapping (1-to-n)
      </router-link> ·
      <router-link to="/?uri=https://coli-conc.gbv.de/api/mappings/92769cf4-1f76-4bd1-ad2d-8c92f4ede20e">
        Example Mapping (1-to-0)
      </router-link>
    </p>
  </div>
</template>
