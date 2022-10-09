<template>
  <ContainerHeader>
    <NuxtLink
      :to="
        $store.state?.headerData?.homepage?.url
          ? $store.state.headerData.homepage.url
          : '/'
      "
    >
      <HeaderLink @click="beforeGoHome">{{
        $store.state?.headerData?.homepage?.label
      }}</HeaderLink>
    </NuxtLink>
    <NuxtLink
      :to="
        $store.state?.headerData?.about?.url
          ? $store.state.headerData.about.url
          : '/'
      "
    >
      <HeaderLink @click="beforeGoAbout">{{
        $store.state?.headerData?.about?.label
      }}</HeaderLink>
    </NuxtLink>
  </ContainerHeader>
</template>

<script>
import { ContainerHeader, HeaderLink } from './styledComponents'

export default {
  name: 'Header',
  components: { ContainerHeader, HeaderLink },
  props: {
    beforeGoHome: {
      type: Function,
      required: false,
      default: () => {},
    },
    beforeGoAbout: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  async mounted() {
    await this.$store.dispatch('fetchHeaderData')
  },
  methods: {},
}
</script>
