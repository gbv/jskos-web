<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <h2>Mapping Info</h2>
    <p v-if="mapping === undefined">
      <loading-indicator /> Loading mapping from URI {{ uri }}...
    </p>
    <p v-else-if="mapping === null">
      Mapping data from URI {{ uri }} could not be loaded.
    </p>
    <div v-else>
      <div class="row">
        <div class="col col-25">
          Source Scheme:
        </div>
        <div class="col">
          <item-name :item="state.getItem(mapping.fromScheme)" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Source Concept:
        </div>
        <div class="col">
          <item-list
            :items="jskos.conceptsOfMapping(mapping, 'from').map(concept => state.getItem(concept))"
            :row-mode="false" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Target Scheme:
        </div>
        <div class="col">
          <item-name :item="state.getItem(mapping.toScheme)" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Target Concept(s):
        </div>
        <div class="col">
          <item-list
            :items="jskos.conceptsOfMapping(mapping, 'to').map(concept => state.getItem(concept))"
            :row-mode="false" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Mapping Type:
        </div>
        <div class="col">
          <auto-link
            v-if="jskos.mappingTypeByType(mapping.type)"
            :href="jskos.mappingTypeByType(mapping.type).uri">
            {{ jskos.prefLabel(jskos.mappingTypeByType(mapping.type)) }} ({{ jskos.notation(jskos.mappingTypeByType(mapping.type)) }})
          </auto-link>
          <span v-else>
            No mapping type
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Creator:
        </div>
        <div class="col">
          <auto-link
            v-if="mapping.creator && mapping.creator[0]"
            :href="mapping.creator[0].uri">
            {{ jskos.prefLabel(mapping.creator[0]) }}
          </auto-link>
          <span v-else>
            No mapping type
          </span>
        </div>
      </div>
      <div
        v-if="mapping.created"
        class="row">
        <div class="col col-25">
          Created:
        </div>
        <div class="col">
          {{ mapping.created.slice(0,10) }}
        </div>
      </div>
      <div
        v-if="mapping.modified"
        class="row">
        <div class="col col-25">
          Modified:
        </div>
        <div class="col">
          {{ mapping.modified.slice(0,10) }}
        </div>
      </div>
      <div
        v-if="mapping.partOf && mapping.partOf.length"
        class="row">
        <div class="col col-25">
          Part of Concordance:
        </div>
        <div class="col">
          <auto-link
            :href="mapping.partOf[0].uri"
            :text="jskos.prefLabel(mapping.partOf[0])" />
        </div>
      </div>
      <div class="row">
        <div class="col col-25">
          Identifier:
        </div>
        <div class="col">
          <div
            v-for="identifier in [].concat(mapping.uri, mapping.identifier).filter(Boolean)"
            :key="identifier">
            <auto-link
              :href="identifier"
              :class="{
                'font-weight-bold': identifier === mapping.uri,
                'font-weight-regular': identifier !== mapping.uri,
              }" /> <span v-if="identifier === mapping.uri">(URI)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="section">
    <h2>Context Info</h2>
    <div
      v-if="mapping"
      class="context">
      <div>
        <h4>Source</h4>
        <item-details :item="state.getItem(jskos.conceptsOfMapping(mapping, 'from')[0])" />
      </div>
      <div>
        <h4>Target</h4>
        <item-details :item="state.getItem(jskos.conceptsOfMapping(mapping, 'to')[0])" />
      </div>
    </div>
  </div>
  <div class="section">
    <h2>Links</h2>
    <ul>
      <li v-if="cocodaLink">
        <auto-link
          :href="cocodaLink"
          text="Open in Cocoda" />
      </li>
      <li v-if="cocodaLinkWithConcepts">
        <auto-link
          :href="cocodaLinkWithConcepts"
          text="Open in Cocoda (with concepts)" />
      </li>
      <li v-if="catalogEnrichmentLink">
        <auto-link
          :href="catalogEnrichmentLink"
          text="Search for Enrichment in K10plus" />
      </li>
      <li v-if="mailToLink">
        <a :href="mailToLink">Provide feedback about this mapping via email</a><br>(If this link doesn't work for you, please email coli-conc@gbv.de.)
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue"
import axios from "axios"
import jskos from "jskos-tools"
import formatHighlight from "json-format-highlight"

const state = inject("state")

const props = defineProps({
  uri: {
    type: String,
    default: "",
  },
})

const mapping = ref(undefined)
watch(props, (newProps, oldProps) => {
  const uri = newProps.uri, oldUri = oldProps && oldProps.uri
  if (uri === oldUri) {
    return
  }
  if (!uri) {
    mapping.value = undefined
    return
  }
  // Load mapping data in an async function
  (async () => {
    // Wait for state initialization
    await state.init()
    let data
    try {
      data = (await axios.get(uri)).data
    } catch (error) {
      console.error(error)
    }
    if (props.uri === uri) {
      if (data) {
        mapping.value = data
        loadMappingDetails(data)
      } else {
        mapping.value = null
      }
    }
  })()
}, {
  immediate: true,
})

async function loadMappingDetails(mapping) {
  const promises = []
  for (const side of ["from", "to"]) {
    const scheme = state.getItem(mapping[`${side}Scheme`])
    if (scheme && scheme._registry && scheme._registry.getConcepts) {
      // Load data for concepts on this side
      const concepts = jskos.conceptsOfMapping(mapping, side).filter(concept => state.getItem(concept, false) === undefined)
      concepts.length && promises.push((async () => {
        const loaded = await scheme._registry.getConcepts({ concepts })
        for (const concept of loaded) {
          // Load ancestors and narrower
          if (!concept.ancestors || concept.ancestors.includes(null)) {
            concept.ancestors = await scheme._registry.getAncestors({ concept })
            concept.broader = concept.ancestors && concept.ancestors.slice(0, 1)
          }
          if (!concept.narrower || concept.narrower.includes(null)) {
            concept.narrower = await scheme._registry.getNarrower({ concept })
          }
          state.addItem(concept)
        }
      })())
    }
  }
  return await Promise.all(promises)
}

const cocodaLink = computed(() => {
  if (!mapping.value || !mapping.value.uri) {
    return null
  }
  return `https://coli-conc.gbv.de/cocoda/app/?mappingUri=${encodeURIComponent(mapping.value.uri)}`
})

const cocodaLinkWithConcepts = computed(() => {
  if (!cocodaLink.value) {
    return null
  }
  let link = cocodaLink.value
  for (const side of ["from", "to"]) {
    let concept = jskos.conceptsOfMapping(mapping.value, side)[0]
    if (concept && concept.uri) {
      link += `&${side}Scheme=${encodeURIComponent(mapping.value[`${side}Scheme`].uri)}&${side}=${encodeURIComponent(concept.uri)}`
    }
  }
  return link
})

const mailToLink = computed(() => {
  if (!mapping.value || !mapping.value.uri) {
    return null
  }
  return `mailto:coli-conc@gbv.de?subject=Mapping Feedback&body=Dear coli-conc team,%0A%0AI would like to provide feedback about this mapping: ${mapping.value.uri}`
})
// Taken directly out of Cocoda
const catalogEnrichmentLink = computed(() => {
  if (!mapping.value || !mapping.value.uri || !mapping.value.uri.startsWith("https://coli-conc.gbv.de/api/mappings/")) {
    return null
  }
  return "https://opac.k10plus.de/DB=2.299/CMD?ACT=SRCHA&IKT=8659&TRM=" + mapping.value.uri.replace(/[\W_]+/g,"+")
})

// TODO: Add JSON data as a popover or something
// eslint-disable-next-line no-unused-vars
const json = computed(() => mapping.value && formatHighlight(mapping.value, { stringColor: "#a02d11" }))
</script>

<style scoped>
.context {
  display: flex;
}
.context > div {
  flex: 1;
}
.context > div > h4 {
  text-align: center;
}
</style>
