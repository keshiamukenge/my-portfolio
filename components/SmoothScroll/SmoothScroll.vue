<template>
  <Container ref="container">
    <slot></slot>
  </Container>
</template>

<script>
import { Container } from './styledComponents'

export default {
  components: {
    Container,
  },
  data() {
    return {
      current: 0,
      target: 0,
      ease: 0.1,
      container: {
        el: null,
        child: null,
        height: 0,
      },
      windowWidth: null,
    }
  },
  mounted() {
    this.container = {
      child: this.$slots.default[0]?.elm,
      height: this.$slots.default[0].elm.getBoundingClientRect().height,
    }

    window.addEventListener('resize', () => {
      document.body.style.height = `${this.container.height}px`
    })

    window.addEventListener('scroll', () => {
      this.windowWidth = window.innerWidth
      this.target = window.scrollY
    })

    this.setupAnimation()
  },
  methods: {
    lerp(start, end, time) {
      return start * (1 - time) + end * time
    },
    setTransform({ transform }) {
      this.container.child.style.transform = transform
    },
    smoothScroll() {
      this.current = this.lerp(this.current, this.target, this.ease)
      this.current = parseFloat(this.current.toFixed(1))
      this.target = window.scrollY

      this.setTransform({
        transform: `translate3d(0, ${-this.current}px, 0)`,
      })

      requestAnimationFrame(this.smoothScroll)
    },
    setupAnimation() {
      this.windowWidth = window.innerWidth

      document.body.style.height = `${this.container?.height}px`
      this.smoothScroll()
    },
  },
}
</script>
