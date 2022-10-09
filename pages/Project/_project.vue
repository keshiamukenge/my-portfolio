<template>
  <PageContainer ref="pageContainer" data-scroll>
    <MainContainer class="container-project-information">
      <ContainerImageIntroWebsite>
        <ImageIntroWebsite ref="imageIntro" :src="selectedProject.image.url" />
      </ContainerImageIntroWebsite>
      <ContainerProjectInformationsSection>
        <ContainerProjectInformationsIntroduction>
          <ProjectTitle>
            <intersect :threshold="[0.9]" @enter.once="revealTitle = true">
              <Title
                :text="selectedProject.title"
                title-class="title-project"
                :reveal="revealTitle"
                :font-color="textColor"
                font-size="4rem"
                split-characters="letters"
                :font="titleFont"
                :duration="0.5"
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
                    delay="<10%"
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
                    delay="<10%"
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
                  delay="<10%"
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
                    delay="<10%"
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
                    delay="<10%"
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
  ImageIntroWebsite,
  ContainerImageIntroWebsite,
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
    ImageIntroWebsite,
    ContainerImageIntroWebsite,
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
      projectImages: {
        websiteImage: null,
        img1: null,
        img2: null,
        img3: null,
      },
      imagesOptions: {
        width: 0,
        height: 0,
        aspect: 0,
      },
      imagesWebsite: [],
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
    }),
  },
  watch: {
    selectedProject() {
      this.webgl.imagesOptions = this.selectedProject.image
      this.webgl.imagesOptions.aspect =
        this.selectedProject.image.width / this.selectedProject.image.height
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
    } catch (e) {
      console.log(e)
    }

    this.pageContainer = this.$refs.pageContainer.$el
    this.appearCanvas()
    this.appearProjectInformations()
    this.addImageToWebgl()

    this.webgl = useWebGL()
    this.webgl.sizes = this.viewport
    this.webgl.initSecondWebgl()
    this.webgl.createProjectsPlanes({
      images: this.imagesWebsite,
    })
    this.webgl.updateSecondWebgl({
      images: this.imagesWebsite,
    })
  },
  async beforeDestroy() {
    await this.DISABLE_ACTIVE_TITLE()
    await this.webgl.updatePlaneCenteredPosition()
  },
  methods: {
    ...mapMutations(['DISABLE_ACTIVE_TITLE']),
    // INTERACTIONS
    disappearProjectInformations() {
      gsap.to(this.pageContainer, {
        duration: 0.5,
        opacity: 0,
      })
    },
    slideUpProjectInformations() {
      gsap.to('.main', {
        y: -100 + 'vh',
        duration: 0.5,
        ease: 'power2.out',
        opacity: 1,
      })
    },
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
        duration: 0.5,
      })
    },
    disappearCanvas() {
      const canvas = document.querySelector('canvas.second-webgl')
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.5,
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
      this.imagesWebsite.push(this.$refs.imageIntro.$el)
    },
  },
}
</script>
