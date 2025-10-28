<script setup>
import router from '@/router'
import { onMounted, ref } from 'vue'

const location = ref({
  name: '',
  position: { lat: 0, long: 0 },
  default: false,
})

const locationsList = ref([])

onMounted(() => {
  locationsList.value = JSON.parse(localStorage.getItem('locations')) ?? []
})

function save() {
  locationsList.value.push(location.value)
  location.value = { name: '', position: { lat: 0, long: 0 }, default: false }
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

function remove(location) {
  locationsList.value = locationsList.value.filter((itm) => {
    return itm.position.lat != location.position.lat && itm.position.long != location.position.long
  })
  localStorage.setItem('locations', JSON.stringify(locationsList.value))
}

function setDefault(e) {
  locationsList.value.map((itm) => {
    itm.default = e.position.lat == itm.position.lat && e.position.long == itm.position.long
  })
  localStorage.setItem('locations', JSON.stringify(locationsList.value))

  locationsList.value.forEach((itm) => {
    if (itm.default) {
      router.push(`/forecast/${itm.name}/${itm.position.lat}/${itm.position.long}`)
    }
  })
}

function editValue(itm) {
  location.value = itm
}
function reset() {
  location.value = { name: '', position: { lat: 0, long: 0 }, default: false }
}
</script>
<template>
  <h2>Locations</h2>
  <label>
    Namn:
    <input type="text" v-model="location.name" />
  </label>
  <label>
    Lat:
    <input type="number" max="90" min="-90" step=".1" size="5" v-model="location.position.lat" />
  </label>
  <label>
    Long:
    <input type="number" max="180" min="-180" step=".1" size="5" v-model="location.position.long" />
  </label>
  <button @click="save">Save</button>
  <button @click="reset">Reset</button>
  <hr />
  <h3>List:</h3>
  <ul>
    <li
      v-for="loc in locationsList"
      :key="loc"
      :class="loc.default ? 'default' : ''"
      @click="setDefault(loc)"
    >
      {{ loc.name }}
      ({{ Math.abs(loc.position.lat).toFixed(2) }}°{{ loc.position.lat > 0 ? 'N' : 'S' }}
      {{ Math.abs(loc.position.long).toFixed(2) }}°{{ loc.position.long > 0 ? 'E' : 'W' }})
      <span class="edit" @click.stop="editValue(loc)" title="Edit location">✒️</span>
      <span class="remove" @click="remove(loc)" title="Remove location">X</span>
    </li>
  </ul>
</template>

<style scoped>
h2 {
  margin-top: calc(0.5rem + 30px);
}

label {
  display: block;
  width: 15em;
  padding-top: 1.5em;
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

span.edit,
.remove {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.2em;
}

span.edit {
  margin-right: 0;
}

.remove {
  color: red;
  font-weight: bold;
}
.default {
  font-weight: bold;
}
</style>
