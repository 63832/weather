<script setup>
import wc from '@/assets/data/weatherCodes.json'
import { ref } from 'vue'
const props = defineProps(['weather'])
const weatherCodes = ref(wc)

function getText(code) {
  let wcText =
    weatherCodes.value.find((itm) => {
      return itm.code == code
    }).description ?? 'Unknown'
  return wcText
}
</script>

<template>
  <div class="weather-card">
    <p class="weather-description">{{ getText(props.weather.code) }}</p>
    <div class="weather-grid">
      <div class="weather-section">
        <h3>Temperature</h3>
        <ul>
          <li>Temp: {{ props.weather.temp.temp }}{{ props.weather.temp.temp_unit }}</li>
          <li>Humidity: {{ props.weather.temp.humidity }}{{ props.weather.temp.humidity_unit }}</li>
          <li>Apparent: {{ props.weather.temp.apparent }}{{ props.weather.temp.temp_unit }}</li>
        </ul>
      </div>
      <div class="weather-section">
        <h3>Conditions</h3>
        <ul>
          <li>
            Precipitation: {{ props.weather.precipitation.precipitation
            }}{{ props.weather.precipitation.unit }}
          </li>
          <li>Cloud coverage: {{ props.weather.cloud.coverage }}{{ props.weather.cloud.unit }}</li>
          <li>Pressure: {{ props.weather.pressure.pressure }}{{ props.weather.pressure.unit }}</li>
        </ul>
      </div>
      <div class="weather-section">
        <h3>Wind</h3>
        <ul>
          <li>Speed: {{ props.weather.wind.windspeed }}{{ props.weather.wind.unit }}</li>
          <li>Gusts: {{ props.weather.wind.windgusts }}{{ props.weather.wind.unit }}</li>
          <li>
            Direction: {{ props.weather.wind.direction }}{{ props.weather.wind.direction_unit }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.weather-description {
  font-size: 1.2rem;
  margin: 0 0 1rem;
  text-align: center;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
}

.weather-section {
  padding: 0.5rem;
}

.weather-section h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  opacity: 0.8;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.25rem 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .weather-grid {
    grid-template-columns: 1fr;
  }

  .weather-section {
    text-align: center;
  }
}
</style>
