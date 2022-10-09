<template>
  <ContainerPagination
    ref="webglPagination"
    class="webgl-pagination"
  ></ContainerPagination>
</template>

<script>
import { ContainerPagination } from './styledComponents'

export default {
  name: 'Pagination',
  components: {
    ContainerPagination,
  },
  props: {
    texture: {
      default: null,
      type: String,
      required: true,
    },
  },
}
</script>
