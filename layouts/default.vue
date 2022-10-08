<template>
  <div>
    <Header />
    <main class="main">
      <Nuxt />
      <Footer />
    </main>
    <canvas ref="mainCanvas" class="main-webgl"></canvas>
    <canvas class="second-webgl"></canvas>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import gsap from 'gsap'

import { Header, Footer } from '../components/Essentials'
import useWebGL from '@/hooks/useWebGL'

export default {
  components: {
    Header,
    Footer,
  },
  computed: {
    ...mapGetters({
      viewport: 'GET_VIEWPORT',
    }),
  },
  watch: {
    // eslint-disable-next-line vue/no-arrow-functions-in-watch
    $route() {
      if (this.$route.name === 'About') {
        this.dissapearCanvas()
      }
    },
  },
  mounted() {
    this.webgl = useWebGL()
    this.webgl.sizes = this.viewport
    this.webgl.initFirstWebgl()
    this.webgl.updateComposerEffect()

    this.SET_VIEWPORT()

    window.addEventListener('resize', () => {
      this.SET_VIEWPORT()
      this.onResize()
    })
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      this.SET_VIEWPORT()
      this.onResize()
    })
  },
  methods: {
    ...mapMutations(['SET_VIEWPORT']),
    onResize() {
      if (this.$route.name === 'index') {
        this.webgl.updatePlaneCenteredPosition()
      }
    },
    dissapearCanvas() {
      gsap.to(this.webgl.renderer.domElement, {
        duration: 0.5,
        opacity: 0,
      })
    },
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
