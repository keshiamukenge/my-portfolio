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
    this.webgl.initSecondWebgl()
  },
}
</script>
