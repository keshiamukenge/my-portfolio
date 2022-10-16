<template>
  <PageContainer ref="pageContainer" data-scroll>
    <MainContainer class="container-project-information">
      <ContainerImageWebsiteIntro>
        <DefaultImage :src="selectedProject?.image?.colors?.url" />
      </ContainerImageWebsiteIntro>
      <ContainerProjectInformationsSection>
        <ContainerProjectInformationsIntroduction>
          <ProjectTitle>
            <intersect :threshold="[0.9]" @enter.once="revealTitle = true">
              <Title
                :text="selectedProject.title"
                title-class="title-project"
                :reveal="revealTitle"
                :font-color="textColor"
                font-size="6rem"
                split-characters="words"
                :font="titleFont"
                :duration="0.8"
                delay="0.8"
                :animation="1"
              />
            </intersect>
          </ProjectTitle>
        </ContainerProjectInformationsIntroduction>
        <ContainerProjectInformationsContent>
          <ContainerProjectDescription>
            <ContainerProjectInformations>
              <Subtitle>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.firstSection = true"
                >
                  <Title
                    :text="selectedProject.parts.date.title"
                    title-class="first-subtitle"
                    :reveal="revealProjectPart.firstSection"
                    :font-color="textColor"
                    font-size="0.8rem"
                    split-characters="words"
                    :font="bodyFont"
                    :duration="0.5"
                    :animation="3"
                    delay="0.8"
                  />
                </intersect>
              </Subtitle>
              <Informations>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.firstSection = true"
                >
                  <Paragraph
                    :text="selectedProject.parts.date.content"
                    paragraph-class="first-content"
                    :reveal="revealProjectPart.firstSection"
                    :font="bodyFont"
                    :duration="1"
                    delay="0.8"
                  />
                </intersect>
              </Informations>
            </ContainerProjectInformations>
            <ContainerProjectInformations>
              <Subtitle>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.secondSection = true"
                >
                  <Title
                    :text="selectedProject.parts.role.title"
                    title-class="second-subtitle"
                    :reveal="revealProjectPart.secondSection"
                    :font-color="textColor"
                    font-size="0.8rem"
                    split-characters="words"
                    :font="bodyFont"
                    :duration="0.5"
                    :animation="3"
                    delay="0.8"
                  />
                </intersect>
              </Subtitle>
              <Informations>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.secondSection = true"
                >
                  <Paragraph
                    :text="selectedProject.parts.role.content"
                    paragraph-class="second-content"
                    :reveal="revealProjectPart.secondSection"
                    :font="bodyFont"
                    :duration="1"
                    delay="0.8"
                  />
                </intersect>
              </Informations>
            </ContainerProjectInformations>
            <ContainerProjectInformations>
              <Subtitle>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.thirdSection = true"
                >
                  <Title
                    :text="selectedProject.parts.client.title"
                    title-class="third-subtitle"
                    :reveal="revealProjectPart.thirdSection"
                    :font-color="textColor"
                    font-size="0.8rem"
                    split-characters="words"
                    :font="bodyFont"
                    :duration="0.5"
                    :animation="3"
                    delay="0.8"
                  />
                </intersect>
              </Subtitle>
              <Informations>
                <Paragraph
                  :text="selectedProject.parts.client.content"
                  paragraph-class="third-content"
                  :reveal="revealProjectPart.thirdSection"
                  :font="bodyFont"
                  :duration="1"
                  delay="0.8"
                />
              </Informations>
            </ContainerProjectInformations>
            <ContainerProjectInformations>
              <Subtitle>
                <intersect
                  :threshold="[0.9]"
                  @enter="revealProjectPart.fourthSection = true"
                >
                  <Title
                    :text="selectedProject.parts.technologies.label"
                    title-class="fourth-subtitle"
                    :reveal="revealProjectPart.fourthSection"
                    :font-color="textColor"
                    font-size="0.8rem"
                    split-characters="words"
                    :font="bodyFont"
                    :duration="0.5"
                    :animation="3"
                    delay="0.8"
                  />
                </intersect>
              </Subtitle>
              <Informations>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.fourthSection = true"
                >
                  <Paragraph
                    :text="selectedProject.parts.technologies.content"
                    paragraph-class="fourth-content"
                    :reveal="revealProjectPart.fourthSection"
                    :font="bodyFont"
                    :duration="1"
                    delay="0.8"
                  />
                </intersect>
              </Informations>
            </ContainerProjectInformations>
            <ContainerProjectInformations grid-column="1/4">
              <Subtitle>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.fiveSection = true"
                >
                  <Title
                    :text="selectedProject.parts.description.title"
                    title-class="five-subtitle"
                    :reveal="revealProjectPart.fiveSection"
                    :font-color="textColor"
                    font-size="0.8rem"
                    split-characters="words"
                    :font="bodyFont"
                    :duration="0.5"
                    :animation="3"
                    delay="0.8"
                  />
                </intersect>
              </Subtitle>
              <Informations>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.fiveSection = true"
                >
                  <Paragraph
                    :text="selectedProject.parts.description.content"
                    paragraph-class="five-section"
                    :reveal="revealProjectPart.fiveSection"
                    :font="bodyFont"
                    :duration="1"
                    delay="0.8"
                  />
                </intersect>
              </Informations>
            </ContainerProjectInformations>
          </ContainerProjectDescription>
          <ContainerImageWebsite
            v-for="image in selectedProject.website.images"
            :key="image.id"
          >
            <ImageElement :ref="image.ref" :src="image.url" data-scroll />
          </ContainerImageWebsite>
        </ContainerProjectInformationsContent>
      </ContainerProjectInformationsSection>
      <ContainerNextProjectImage ref="imageNextProject">
        <DefaultImage :src="nextProject?.image?.colors?.url" />
      </ContainerNextProjectImage>
    </MainContainer>
  </PageContainer>
</template>

<script>
import { gsap, Power2 } from 'gsap'
import { mapGetters, mapMutations } from 'vuex'
import Intersect from 'vue-intersect'
import { Title, Paragraph } from '../../components/TextAnimations'

import { colors, fonts } from '../../theme'
import useWebGL from '../../hooks/useWebGL'
import {
  PageContainer,
  MainContainer,
  ProjectTitle,
  Subtitle,
  ContainerProjectInformationsSection,
  ContainerProjectDescription,
  Informations,
  ContainerProjectInformations,
  ContainerProjectInformationsIntroduction,
  ContainerProjectInformationsContent,
  ContainerImageWebsite,
  ImageElement,
  ContainerNextProjectImage,
  DefaultImage,
  ContainerImageWebsiteIntro,
} from './styledComponents'
import smoothScroll from '~/mixins/smoothScroll'

export default {
  name: 'Project',
  components: {
    PageContainer,
    MainContainer,
    ProjectTitle,
    ContainerProjectInformationsSection,
    ContainerProjectDescription,
    ContainerImageWebsite,
    ImageElement,
    Subtitle,
    Informations,
    ContainerProjectInformations,
    Title,
    Intersect,
    Paragraph,
    ContainerProjectInformationsIntroduction,
    ContainerProjectInformationsContent,
    ContainerNextProjectImage,
    DefaultImage,
    ContainerImageWebsiteIntro,
  },
  mixins: [smoothScroll],
  transition: {
    leave(el, done) {
      const canvas = document.querySelector('canvas.second-webgl')
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.5,
      })
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: Power2.easeInOut,
        onComplete: done,
      })
    },
  },
  data() {
    return {
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont,
      textColor: colors.white,
      revealTitle: false,
      revealProjectPart: {
        firstSection: false,
        secondSection: false,
        thirdSection: false,
        fourthSection: false,
        fiveSection: false,
      },
      pageContainer: null,
      imagesOptions: {
        width: 0,
        height: 0,
        aspect: 0,
      },
      imagesWebsite: [],
      scroll: null,
      isRunning: false,
    }
  },
  computed: {
    ...mapGetters({
      projects: 'GET_PROJECTS_DATA',
      activeProject: 'GET_ACTIVE_PROJECT',
      previousProject: 'GET_PREVIOUS_PROJECT',
      nextProject: 'GET_NEXT_PROJECT',
      selectedProject: 'GET_SELECTED_PROJECT',
      viewport: 'GET_VIEWPORT',
      scrollInstance: 'GET_SCROLL_INSTANCE',
    }),
  },
  watch: {
    selectedProject() {
      this.webgl.imagesOptions = this.selectedProject.image
      this.webgl.imagesOptions.aspect =
        this.selectedProject.image.width / this.selectedProject.image.height
    },
    '$store.state.scroll'() {
      if (this.$store.state.scroll.progress === 100) {
        document.body.style.cursor = 'progress'
        // this.nextProjectImageAnimation()
        setTimeout(() => {
          this.navigateToNextProject()
        }, 1000)
      } else {
        document.body.style.cursor = 'default'
      }
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
    } catch (e) {
      this.SET_ERROR('Error while fetching project data')
    }

    this.SET_NEXT_SELECTED_PROJECT()

    this.pageContainer = this.$refs.pageContainer.$el
    this.appearCanvas()
    this.appearProjectInformations()
    this.addImageToWebgl()

    this.webgl = useWebGL()
    this.initWebgl2()
  },
  destroyed() {
    this.webgl.destroy({
      renderer: this.webgl.renderer2,
      scene: this.webgl.scene2,
    })
  },
  methods: {
    ...mapMutations([
      'DISABLE_ACTIVE_TITLE',
      'SET_ERROR',
      'SET_SELECTED_PROJECT',
      'SET_NEXT_SELECTED_PROJECT',
    ]),
    // INTERACTIONS
    appearProjectInformations() {
      gsap.to(this.pageContainer, {
        duration: 0.3,
        opacity: 1,
      })
    },
    appearCanvas() {
      const canvas = document.querySelector('canvas.second-webgl')
      gsap.to(canvas, {
        opacity: 1,
        duration: 0.8,
      })
    },
    addImageToWebgl() {
      const refs = []
      this.selectedProject.website.images.forEach((project) => {
        refs.push(project.ref)
      })
      refs.forEach((ref) => {
        this.imagesWebsite.push(this.$refs[ref][0].$el)
      })
    },
    nextProjectImageAnimation() {
      gsap.to(this.$refs.imageNextProject.$el, {
        duration: 0.5,
        height: 50 + 'vh',
        ease: Power2.easeInOut,
      })
    },
    async initWebgl2() {
      await this.addImageToWebgl()

      this.webgl.initSecondWebgl()
      this.webgl.createProjectsPlanes({
        images: this.imagesWebsite,
      })
      this.webgl.updateSecondWebgl({
        images: this.imagesWebsite,
      })
    },
    navigateToNextProject() {
      this.$router.push({
        path: `/project/${this.nextProject.route}`,
      })
      this.SET_SELECTED_PROJECT({ id: this.nextProject.id })
    },
  },
}
</script>
