<template>
  <div>
    <Header />
    <MainContainer>
      <ContainerImage>
        <ImageElement src="/images/sff-project.jpeg" />
      </ContainerImage>
      <ContainerProjectInformations>
        <ProjectTitle> project title </ProjectTitle>
        <ContainerProjectDescription>
          text description
        </ContainerProjectDescription>
      </ContainerProjectInformations>
    </MainContainer>
    <Footer />
  </div>
</template>

<script>
// import Title from '../../shared/vue-lib/src/stories/components/Title/Title.vue'
// import Paragraph from '../../shared/vue-lib/src/stories/components/Paragraph/Paragraph.vue'

import { colors, fonts } from '../../theme'
import { Header, Footer } from '../../components/Essentials'
import {
  MainContainer,
  ImageElement,
  ProjectTitle,
  ContainerProjectInformations,
  ContainerImage,
  ContainerProjectDescription,
} from './styledComponents'

export default {
  name: 'Project',
  components: {
    Header,
    Footer,
    MainContainer,
    ImageElement,
    ProjectTitle,
    ContainerProjectInformations,
    ContainerImage,
    ContainerProjectDescription,
  },
  data() {
    return {
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont,
      textColor: colors.white,
      revealTitle: false,
      revealDescriptionTitle: false,
      revealDescriptionParagraph: false,
    }
  },
  mounted() {
    this.revealTitle =
      this.revealDescriptionTitle =
      this.revealDescriptionParagraph =
        true
  },
}
</script>
