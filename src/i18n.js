import { createI18n } from "vue-i18n"
import messages from "@/../locale.json"

let locale

try {
  locale = localStorage.getItem("jskos-web-locale")
  console.log(locale)
} catch (error) {
  console.warn("Error reading from locale storage. Language preference will not be saved.")
}

// Determine default locale through the user's browser
if (!locale) {
  for (const lang of navigator.languages || []) {
    if (lang.startsWith("de") || lang.startsWith("en")) {
      locale = lang.slice(0, 2)
      break
    }
  }
}

export default createI18n({
  legacy: false,
  locale: locale || "en",
  fallbackLocale: "en",
  messages,
})
