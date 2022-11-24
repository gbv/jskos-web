<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="section">
    <h2>Mapping Info</h2>
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
        Target Concept<span v-if="jskos.conceptsOfMapping(mapping, 'to').length > 1">s</span>:
      </div>
      <div class="col">
        <item-list
          v-if="jskos.conceptsOfMapping(mapping, 'to').length"
          :items="jskos.conceptsOfMapping(mapping, 'to').map(concept => state.getItem(concept))"
          :row-mode="false" />
        <span v-else>No target concepts</span>
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
      v-if="mapping.created || mapping.modified"
      class="row">
      <div class="col col-25">
        Created:
      </div>
      <div class="col">
        {{ mapping.created.slice(0,10) }} <span v-if="mapping.modified && mapping.modified !== mapping.created">(Modified: {{ mapping.modified.slice(0,10) }})</span>
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
    <div
      v-if="catalogEnrichmentLink"
      class="row">
      <div class="col col-25">
        Search for Enrichment in K10plus:
      </div>
      <div class="col">
        <auto-link :href="catalogEnrichmentLink" />
      </div>
    </div>
    <div
      v-if="mailToLink"
      class="row">
      <div class="col col-25">
        Feedback:
      </div>
      <div class="col">
        <a :href="mailToLink">Provide feedback about this mapping via email</a><br>(If this link doesn't work for you, please email coli-conc@gbv.de and include the mapping identifier.)
      </div>
    </div>
  </div>
  <div class="section">
    <h2>Context Info</h2>
    <div
      v-if="cocodaLinkWithConcepts"
      style="display: inline-block; margin-left: 15px; font-size: 17px;">
      <auto-link
        :href="cocodaLinkWithConcepts"
        text="Open in Cocoda" />
    </div>
    <div
      v-if="mapping"
      class="context">
      <div>
        <h4>
          Source
          (<item-name
            :item="state.getItem(mapping.fromScheme)"
            :show-label="false" />)
        </h4>
        <item-details
          :item="state.getItem(jskos.conceptsOfMapping(mapping, 'from')[0])"
          :show-tabs="false"
          :item-list-options="{ rowMode: false }" />
        <item-details-tabs
          :item="state.getItem(jskos.conceptsOfMapping(mapping, 'from')[0])" />
      </div>
      <div>
        <h4>
          Target
          (<item-name
            :item="state.getItem(mapping.toScheme)"
            :show-label="false" />)
        </h4>
        <div
          v-if="jskos.conceptsOfMapping(mapping, 'to').length > 1"
          class="target-indexes">
          <span
            v-for="index in jskos.conceptsOfMapping(mapping, 'to').map((value, index) => index)"
            :key="index">
            <a
              href=""
              :class="{ 'selected-index': index === targetConceptIndex }"
              @click.prevent.stop="targetConceptIndex = index">
              {{ index + 1 }}
            </a>
          </span>
        </div>
        <item-details
          v-if="jskos.conceptsOfMapping(mapping, 'to').length"
          :item="state.getItem(jskos.conceptsOfMapping(mapping, 'to')[targetConceptIndex])"
          :show-tabs="false"
          :item-list-options="{ rowMode: false }" />
        <item-details-tabs
          v-if="jskos.conceptsOfMapping(mapping, 'to').length"
          :item="state.getItem(jskos.conceptsOfMapping(mapping, 'to')[targetConceptIndex])" />
        <span v-else>
          No target concepts
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue"
import jskos from "jskos-tools"
import formatHighlight from "json-format-highlight"

const state = inject("state")

const props = defineProps({
  mapping: {
    type: Object,
    required: true,
  },
})

// If there is more than one target concept, this is the selected index
const targetConceptIndex = ref(0)

watch(props, (newProps, oldProps) => {
  const uri = newProps.mapping && newProps.mapping.uri, oldUri = oldProps && oldProps.mapping && oldProps.mapping.uri
  if (uri === oldUri) {
    return
  }
  targetConceptIndex.value = 0
  loadMappingDetails(newProps.mapping)
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
            try {
              concept.ancestors = await scheme._registry.getAncestors({ concept })
              concept.broader = concept.ancestors && concept.ancestors.slice(0, 1)
            } catch (error) {
              concept.ancestors = []
            }
          }
          if (!concept.narrower || concept.narrower.includes(null)) {
            try {
              concept.narrower = await scheme._registry.getNarrower({ concept })
            } catch (error) {
              concept.narrower = []
            }
          }
          state.addItem(concept)
        }
      })())
    }
  }
  return await Promise.all(promises)
}

const cocodaLink = computed(() => {
  if (!props.mapping || !props.mapping.uri) {
    return null
  }
  return `https://coli-conc.gbv.de/cocoda/app/?mappingUri=${encodeURIComponent(props.mapping.uri)}`
})

const cocodaLinkWithConcepts = computed(() => {
  if (!cocodaLink.value) {
    return null
  }
  let link = cocodaLink.value
  for (const side of ["from", "to"]) {
    link += `&${side}Scheme=${encodeURIComponent(props.mapping[`${side}Scheme`].uri)}`
    let concept = jskos.conceptsOfMapping(props.mapping, side)[0]
    if (concept && concept.uri) {
      link += `&${side}=${encodeURIComponent(concept.uri)}`
    }
  }
  return link
})

const mailToLink = computed(() => {
  if (!props.mapping || !props.mapping.uri) {
    return null
  }
  return `mailto:coli-conc@gbv.de?subject=Mapping Feedback&body=Dear coli-conc team,%0A%0AI would like to provide feedback about this mapping: ${props.mapping.uri}`
})
// Taken directly out of Cocoda
const catalogEnrichmentLink = computed(() => {
  if (!props.mapping || !props.mapping.uri || !props.mapping.uri.startsWith("https://coli-conc.gbv.de/api/mappings/")) {
    return null
  }
  return "https://opac.k10plus.de/DB=2.299/CMD?ACT=SRCHA&IKT=8659&TRM=" + props.mapping.uri.replace(/[\W_]+/g,"+")
})

// TODO: Add JSON data as a popover or something
// eslint-disable-next-line no-unused-vars
const json = computed(() => props.mapping && formatHighlight(props.mapping, { stringColor: "#a02d11" }))
</script>

<style scoped>
.context {
  display: flex;
  flex-wrap: wrap;
}
.context > div {
  flex: 1;
  min-width: 350px;
  padding-right: 15px;
}
.context > div > h4 {
  text-align: center;
}
.target-indexes {
  text-align: center;
}
.target-indexes a {
  padding: 0 5px;
}
.target-indexes a.selected-index {
  background: #982a10;
  color: #f3f0f0;
}
</style>
