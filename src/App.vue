<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BurgerMenu from './components/BurgerMenu.vue'
import { ref } from 'vue'

const menuActive = ref(false)
</script>

<template>
  <BurgerMenu @toggle-menu="menuActive = !menuActive" :active="menuActive" />
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/locations">Locations</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
