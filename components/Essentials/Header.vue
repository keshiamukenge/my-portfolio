<template>
  <ContainerHeader>
    <NuxtLink :to="headerData?.homepage?.url ? headerData.homepage.url : '/'">
      <HeaderLink opacity="1!important" @click="beforeGoHome">{{
        headerData?.homepage?.label
      }}</HeaderLink>
    </NuxtLink>
    <ContainerRightLinks>
      <NuxtLink :to="headerData?.works?.url ? headerData.works.url : '/'">
        <HeaderLink :margin-right="10" @click="beforeGoAbout">
          {{ headerData?.works?.label }},
        </HeaderLink>
      </NuxtLink>
      <NuxtLink :to="headerData?.about?.url ? headerData?.about.url : '/'">
        <HeaderLink @click="beforeGoAbout">{{
          headerData?.about?.label
        }}</HeaderLink>
      </NuxtLink>
    </ContainerRightLinks>
  </ContainerHeader>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  ContainerHeader,
  HeaderLink,
  ContainerRightLinks,
} from './styledComponents'

export default {
  name: 'Header',
  components: {
    ContainerHeader,
    HeaderLink,
    ContainerRightLinks,
  },
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
  computed: {
    ...mapGetters({
      headerData: 'GET_HEADER_DATA',
    }),
  },
  async mounted() {
    await this.$store.dispatch('fetchHeaderData')
    console.log(this.headerData)
  },
}
</script>
