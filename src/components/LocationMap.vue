<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="country-map" v-if="lat !== undefined && long !== undefined">
    <iframe
      :src="`https://maps.google.com/maps?q=${lat},${long}&z=6&output=embed`"
      frameborder="0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      title="Location map"
    ></iframe>
  </div>
</template>

<style scoped>
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

/* Mobile tweaks */
@media (max-width: 600px) {
  .country-map iframe {
    width: 100%;
    height: 180px;
  }
}
</style>
