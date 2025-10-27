<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BurgerMenu from './components/BurgerMenu.vue'
import { ref } from 'vue'

const menuActive = ref(false)
</script>

<template>
  <BurgerMenu @toggle-menu="menuActive = !menuActive" :active="menuActive" />
  <RouterView />
</template>

<style scoped></style>
