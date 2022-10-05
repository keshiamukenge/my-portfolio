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
  // watch: {
  //   images() {
  //     if (this.$props.images[0] !== null) {
  //       this.webgl?.createProjectsPlanes({ images: [this.$props.images] })
  //     }
  //   },
  // },
  mounted() {
    this.webgl = useWebGL()
    this.webgl.initSecondWebgl()
    this.webgl.updateSecondWebgl()

    // if (this.$props.images[0] !== null) {
    //   this.webgl.updateSecondWebgl()
    // }
  },
}
</script>
