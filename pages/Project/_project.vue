<template>
  <div>
    <Header />
    <MainContainer>
      <ContainerImage>
        <ImageElement src="/images/sff-project.jpeg" />
      </ContainerImage>
      <ContainerProjectInformations>
        <ProjectTitle>
          <Title
            text="Soul funk factory"
            :title-class="'project-title' + id"
            :reveal="revealTitle"
            split-characters="letters"
            :font="titleFont"
            :font-color="textColor"
            font-size="4rem"
            :duration="0.5"
            :animation="3"
          />
        </ProjectTitle>
        <ContainerProjectDescription>
          <Title
            text="DESCRIPTION"
            title-class="description-title"
            :reveal="revealDescriptionTitle"
            split-characters="letters"
            :font="bodyFont"
            :font-color="textColor"
            font-size="1.2rem"
            :duration="0.5"
            :delay="0.5"
            :animation="3"
          />
          <Paragraph
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            paragraph-class="description-paragraph"
            :reveal="revealDescriptionParagraph"
            :animation="3"
            :font-color="textColor"
          />
        </ContainerProjectDescription>
      </ContainerProjectInformations>
    </MainContainer>
    <Footer />
  </div>
</template>

<script>
import Title from '../../shared/vue-lib/src/stories/components/Title/Title.vue'
import Paragraph from '../../shared/vue-lib/src/stories/components/Paragraph/Paragraph.vue'

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
    Title,
    ProjectTitle,
    ContainerProjectInformations,
    ContainerImage,
    Paragraph,
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
    this.revealTitle = this.revealDescriptionTitle = this.revealDescriptionParagraph = true
  },
}
</script>
