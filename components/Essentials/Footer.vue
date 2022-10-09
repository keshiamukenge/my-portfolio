<template>
  <ContainerFooter :bottom="bottom">
    <ContainerFooterLinks>
      <FooterLink
        target="_blank"
        :href="$store.state?.footerData?.links?.github?.url"
        :margin-right="20"
        >{{ $store.state?.footerData?.links?.github?.label }}</FooterLink
      >
      <FooterLink
        target="_blank"
        :href="$store.state?.footerData?.links?.linkedin?.url"
        >{{ $store.state?.footerData?.links?.linkedin?.label }}</FooterLink
      >
    </ContainerFooterLinks>
    <FooterText>{{ $store.state?.footerData?.role }}</FooterText>
  </ContainerFooter>
</template>

<script>
import {
  ContainerFooter,
  FooterLink,
  FooterText,
  ContainerFooterLinks,
} from './styledComponents'
export default {
  name: 'Footer',
  components: { ContainerFooter, FooterLink, FooterText, ContainerFooterLinks },
  props: {
    bottom: {
      type: String,
      default: '0',
    },
  },
  async mounted() {
    await this.$store.dispatch('fetchFooterData')
  },
}
</script>
