<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import { getCurrentWeather, getForecast } from '@/services/forecastService'
import ForecastResult from '@/components/ForecastResult.vue'
import CurrentWeather from '@/components/currentWeather.vue'
import { getPosition } from '@/services/positioningService'

const location = ref({})
const info = ref({})
const currentWeather = ref({})
const currentLocation = ref({ lat: 0.0, long: 0.0, name: 'Current location' })
const props = defineProps(['name', 'lat', 'long'])

/**
 * Convert an ISO 3166-1 alpha-2 country code (e.g. "SE") to a flag emoji
 */
function countryCodeToFlag(code) {
  if (!code) return ''
  const cc = String(code).toUpperCase()
  if (cc.length !== 2) return ''
  return cc
    .split('')
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

/**
 * Reverse-geocode coordinates (lat, lon) into a country name + ISO code using Nominatim
 */
async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
      lat,
    )}&lon=${encodeURIComponent(lon)}&zoom=10&accept-language=en`
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    const countryCode = data?.address?.country_code ? data.address.country_code.toUpperCase() : null
    const country = data?.address?.country ?? null
    const placeName =
      data?.address?.city ||
      data?.address?.town ||
      data?.address?.village ||
      data?.address?.municipality ||
      data?.address?.county ||
      (data?.display_name ? String(data.display_name).split(',')[0] : null)
    return { countryCode, country, placeName }
  } catch (err) {
    console.warn('reverseGeocode failed', err)
    return null
  }
}

/**
 * Ensure that location objects always have a valid ISO alpha-2 code
 */
function ensureCountryCode(loc) {
  if (!loc) return
  if (!loc.countryCode && loc.country) {
    // Nominatim usually provides countryCode, so we just pass it through if present
    loc.countryCode = loc.countryCode || loc.countryCode
  }
}

onMounted(() => {
  getPosition()
    .then(async (pos) => {
      currentLocation.value = { name: 'Current location', ...pos.position }

      const r = await reverseGeocode(pos.position.lat, pos.position.long)
      if (r?.countryCode) currentLocation.value.countryCode = r.countryCode
      if (r?.country) currentLocation.value.country = r.country
      if (r?.placeName) currentLocation.value.name = r.placeName

      // Always ensure countryCode
      ensureCountryCode(currentLocation.value)

      if (!props.name || props.name === '') {
        if (
          typeof location.value.lat === 'undefined' ||
          (location.value.lat === pos.position.lat && location.value.long === pos.position.long) ||
          location.value.name === 'Current location'
        ) {
          location.value = { ...currentLocation.value }
          fetchForeCast(location.value)
        }
      }
    })
    .catch(() => {})
})

function fetchForeCast(loc) {
  getForecast(loc)
    .then((response) => {
      info.value = response
    })
    .catch((err) => console.log(err))

  getCurrentWeather(loc)
    .then((response) => {
      currentWeather.value = response
    })
    .catch((err) => console.log(err))
}

// Watch props / localStorage locations
watchEffect(() => {
  let locationsList = JSON.parse(localStorage.getItem('locations')) ?? []
  let tmpLocation = {}

  if (typeof props.name !== 'undefined') {
    tmpLocation = locationsList.find((loc) => loc.name.toLowerCase() === props.name.toLowerCase())

    if (tmpLocation) {
      location.value.name = tmpLocation.name
      location.value.lat = tmpLocation.position.lat
      location.value.long = tmpLocation.position.long
      location.value.country = tmpLocation.country
      location.value.countryCode = tmpLocation.countryCode

      // Always get country code from lat/long for saved locations
      reverseGeocode(location.value.lat, location.value.long).then((r) => {
        if (r?.countryCode) location.value.countryCode = r.countryCode
        if (r?.country) location.value.country = r.country
      })
    }
  } else {
    location.value = currentLocation.value
  }

  if (!tmpLocation && typeof props.lat !== 'undefined' && typeof props.long !== 'undefined') {
    location.value.name = props.name
    location.value.lat = parseFloat(props.lat)
    location.value.long = parseFloat(props.long)

    // Ensure flag works
    ensureCountryCode(location.value)
  }

  if (typeof location.value.name !== 'undefined') {
    fetchForeCast(location.value)
  }
})

// Refetch when currentLocation changes
watch(currentLocation, () => {
  if (location.value.name === currentLocation.value.name) {
    fetchForeCast(currentLocation.value)
  }
})
</script>

<template>
  <main v-if="!location.name">
    <h2>Angiven plats kan inte hittas</h2>
    <p>
      <i>{{ props.name }}</i> finns inte i listan över platser
    </p>
  </main>

  <main v-else>
    <div class="location-header">
      <h2>
        {{ location.name }}
        <span class="flag" v-if="location.countryCode">
          {{ countryCodeToFlag(location.countryCode) }}
        </span>
      </h2>

      <div
        class="country-map"
        v-if="typeof location.lat !== 'undefined' && typeof location.long !== 'undefined'"
      >
        <iframe
          :src="`https://maps.google.com/maps?q=${location.lat},${location.long}&z=6&output=embed`"
          frameborder="0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Location map"
        ></iframe>
      </div>

      <div class="coordinates">
        <p class="location">
          Lat: <span>{{ location.lat.toFixed(3) }}</span>
        </p>
        <p class="location">
          Long: <span>{{ location.long.toFixed(3) }}</span>
        </p>
      </div>
    </div>

    <div class="weather-container">
      <CurrentWeather v-if="currentWeather?.code" :weather="currentWeather" />
      <ForecastResult :forecast="info" />
    </div>
  </main>
</template>

<style scoped>
.location-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.location-header h2 {
  margin-bottom: 0.5rem;
  font-weight: bolder;
}

.coordinates {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.location {
  display: inline-flex;
  align-items: center;
  margin: 0 0.5rem;
  padding: 0.3rem 0.6rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.location span {
  font-weight: 500;
  margin-left: 0.3rem;
}

.weather-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.flag {
  margin-left: 0.5rem;
  font-size: 1.1rem;
  vertical-align: middle;
}

.country-map {
  display: flex;
  justify-content: center;
  margin: 0.6rem 0;
}

.country-map iframe {
  width: 360px;
  height: 200px;
  border: 0;
  border-radius: 6px;
}
.weather-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Wrap wind info / other details nicely on small screens */
.weather-container > * {
  flex-wrap: wrap;
}

.location {
  display: inline-flex;
  align-items: center;
  margin: 0 0.5rem;
  padding: 0.5rem 0.8rem; /* slightly more padding */
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

/* Mobile tweaks */
@media (max-width: 600px) {
  .weather-container {
    gap: 1.2rem; /* more vertical spacing */
  }

  .location {
    flex-direction: column; /* stack label + value vertically */
    align-items: flex-start;
    padding: 0.4rem 0.6rem;
    font-size: 0.95rem;
  }

  .location span {
    margin-left: 0; /* remove left margin when stacked */
    margin-top: 0.2rem;
  }

  .country-map iframe {
    width: 100%;
    height: 180px;
  }
}
@media (max-width: 600px) {
  .country-map iframe {
    width: 100%;
    height: 180px;
  }
}
</style>
