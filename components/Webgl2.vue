<template>
  <canvas class="second-webgl"></canvas>
</template>

<script>
import useWebGL from '@/hooks/useWebGL'

export default {
  name: 'Webgl2',
  props: {
    images: {
      default: null,
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.webgl = useWebGL()
    console.log(this.webgl)
    this.webgl.initSecondWebgl({ images: this.$props.images })

    if (this.$props.images[0] !== null) {
      this.webgl.updateSecondWebgl()
    }
  },
}
</script>
