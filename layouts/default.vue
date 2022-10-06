<template>
  <div>
    <Header />
    <main>
      <Nuxt />
    </main>
    <Footer />
    <canvas class="main-webgl"></canvas>
    <canvas class="second-webgl"></canvas>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import { Header, Footer } from '../components/Essentials'
import useWebGL from '@/hooks/useWebGL'

export default {
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.webgl = useWebGL()
    this.webgl.initFirstWebgl()
    this.webgl.updateFirstWebgl()

    this.SET_VIEWPORT()

    window.addEventListener('resize', () => {
      this.SET_VIEWPORT()
    })
  },
  methods: {
    ...mapMutations(['SET_VIEWPORT']),
  },
}
</script>

<style>
main[data-scroll-container] {
  width: 100vw;
  max-width: 100vw;
  min-width: 100vw;
  height: fit-content;
  min-height: 100vh;
}
</style>
