<script setup>
import { ref } from 'vue'

const location = ref({
  name: '',
  position: { lat: 0, long: 0 },
  default: false,
})

const locationsList = ref([
  { name: 'Mariehamn', position: { lat: 60.0, long: 20.0 }, default: false },
  { name: 'Stockholm', position: { lat: 59.32, long: 18.32 }, default: true },
  { name: 'London', position: { lat: 51.5, long: -0.1 }, default: false },
  { name: 'Cape Town', position: { lat: -34, long: 18.5 }, default: false },
])

function resetLocation() {
  location.value.name = ''
  location.value.position.lat = 0
  location.value.position.long = 0
}

function saveLocation() {
  if (!location.value.name) {
    alert('Skriv in namn för platsen!!')
    return
  }

  locationsList.value.push({
    name: location.value.name,
    position: {
      lat: location.value.position.lat,
      long: location.value.position.long,
    },
    default: false,
  })
  resetLocation()
}

function removeLocation(loc) {
  locationsList.value = locationsList.value.filter((l) => l !== loc)
}

function showLocation(loc) {
  location.value.name = loc.name
  location.value.position.lat = loc.position.lat
  location.value.position.long = loc.position.long
}
</script>

<template>
  <h2>Locations:</h2>
  <label>Namn: <input type="text" v-model="location.name" /></label>
  <label
    >lat:
    <input
      type="number"
      value="lat"
      max="90"
      min="-90"
      step=".1"
      size="5"
      v-model="location.position.lat"
  /></label>
  <label
    >Long:
    <input
      type="number"
      value="long"
      max="180"
      min="-180"
      step=".1"
      size="8"
      v-model="location.position.long"
    />
  </label>
  <button @click="saveLocation()">Save</button> <button @click="resetLocation()">Reset</button>
  <hr />
  <h3>List</h3>
  <ul>
    <li
      v-for="loc in locationsList"
      :key="loc"
      :class="loc.default ? 'default' : ''"
      @click="showLocation(loc)"
    >
      {{ loc.name }}
      ( {{ Math.abs(loc.position.lat).toFixed(2) }}°{{ loc.position.lat > 0 ? 'N' : 'S' }}
      {{ Math.abs(loc.position.long).toFixed(2) }}°{{ loc.position.long > 0 ? 'E' : 'W' }})
      <span class="remove" @click.stop="removeLocation(loc)">x</span>
    </li>
  </ul>
</template>

<style scoped>
label {
  display: block;
  width: 15em;
  padding-top: 0.5em;
}

.remove {
  color: red;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
}

li {
  display: flex;
  justify-content: space-between;
  background-color: lightgoldenrodyellow;
  padding: 0.8em 1em;
  margin-bottom: 1em;
  border-radius: 6px;
  cursor: pointer;
}

li:hover {
  background-color: lightgrey;
}

ul {
  margin: 0;
  padding: 0;
}
</style>
