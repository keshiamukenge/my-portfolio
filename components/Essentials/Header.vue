<template>
  <ContainerHeader>
    <NuxtLink
      :to="
        $store.state?.headerData?.homepage?.url
          ? $store.state.headerData.homepage.url
          : '/'
      "
    >
      <HeaderLink>{{ $store.state?.headerData?.homepage?.label }}</HeaderLink>
    </NuxtLink>
    <NuxtLink
      :to="
        $store.state?.headerData?.about?.url
          ? $store.state.headerData.about.url
          : '/'
      "
    >
      <HeaderLink>{{ $store.state?.headerData?.about?.label }}</HeaderLink>
    </NuxtLink>
  </ContainerHeader>
</template>

<script>
import { ContainerHeader, HeaderLink } from './styledComponents'

export default {
  name: 'Header',
  components: { ContainerHeader, HeaderLink },
  async mounted() {
    await this.$store.dispatch('fetchHeaderData')
  },
}
</script>
