<template>
  <PageContainer ref="pageContainer" data-scroll>
    <MainContainer class="container-project-information">
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
          <ContainerSpanElement
            v-for="role in selectedProject.role"
            :key="role.id"
          >
            <SpanElement>
              <Title
                :text="role.label"
                title-class="first-role"
                :reveal="revealTitle"
                :font-color="textColor"
                font-size="0.8rem"
                split-characters="words"
                :font="bodyFont"
                :duration="0.5"
                :animation="3"
              />
            </SpanElement>
          </ContainerSpanElement>
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
                    :text="selectedProject.parts.client.title"
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
                <Paragraph
                  :text="selectedProject.parts.client.content"
                  paragraph-class="second-content"
                  :reveal="revealProjectPart.secondSection"
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
                  @enter="revealProjectPart.thirdSection = true"
                >
                  <Title
                    :text="selectedProject.parts.technologies.label"
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
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.thirdSection = true"
                >
                  <Paragraph
                    :text="selectedProject.parts.technologies.content"
                    paragraph-class="third-content"
                    :reveal="revealProjectPart.thirdSection"
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
                  @enter.once="revealProjectPart.fourthSection = true"
                >
                  <Title
                    :text="selectedProject.parts.description.title"
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
                    :text="selectedProject.parts.description.content"
                    paragraph-class="fourth-section"
                    :reveal="revealProjectPart.fourthSection"
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
import gsap from 'gsap'
import { mapGetters, mapMutations } from 'vuex'
import Intersect from 'vue-intersect'
import Title from '../../shared/vue-lib/src/stories/components/Title/Title.vue'
import Paragraph from '../../shared/vue-lib/src/stories/components/Paragraph/Paragraph.vue'

import { colors, fonts } from '../../theme'
import {
  PageContainer,
  MainContainer,
  ProjectTitle,
  Subtitle,
  ContainerProjectInformationsSection,
  ContainerProjectDescription,
  Informations,
  ContainerProjectInformations,
  SpanElement,
  ContainerSpanElement,
  ContainerProjectInformationsIntroduction,
  ContainerProjectInformationsContent,
  ContainerImageWebsite,
  ImageElement,
} from './styledComponents'
import smoothScroll from '@/mixins/smoothScroll'
import useWebGL from '@/hooks/useWebGL'

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
    SpanElement,
    ContainerSpanElement,
    ContainerProjectInformationsIntroduction,
    ContainerProjectInformationsContent,
  },
  mixins: [smoothScroll],
  transition: {
    leave(el, done) {
      setTimeout(() => {
        done()
      }, 500)
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
      this.imagesOptions = this.selectedProject.image
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
    } catch (e) {
      console.log(e)
    }

    this.pageContainer = this.$refs.pageContainer.$el
    this.appearProjectInformations()
    this.addImageToWebgl()

    // First webgl scene
    this.webgl = useWebGL()
    this.webgl.imagesOptions.width = this.selectedProject.image.width
    this.webgl.imagesOptions.height = this.selectedProject.image.height
    this.webgl.imagesOptions.aspect =
      this.selectedProject.image.width / this.selectedProject.image.height
    this.webgl.sizes = this.viewport

    // Second webgl scene
    this.webgl.initSecondWebgl()
    this.webgl.createProjectsPlanes({
      images: this.imagesWebsite,
    })
    this.webgl.updateSecondWebgl({
      images: this.imagesWebsite,
    })

    window.addEventListener('resize', () => {
      this.webgl.updatePlaneCoverWindowSize()
      this.webgl.updateWebgl2()
    })
  },
  async beforeDestroy() {
    if (this.$route.name === 'index') {
      this.webgl.scaleDownPlaneCenteredPosition({
        viewportOptions: this.viewport,
      })
    }
    this.DISABLE_ACTIVE_TITLE()
    await this.disappearProjectInformations()
    await this.disappearCanvas()
  },
  methods: {
    ...mapMutations(['DISABLE_ACTIVE_TITLE']),
    resizePlane() {
      const { setPlaneCenteredPosition } = useWebGL()
      setPlaneCenteredPosition()
    },
    // INTERACTIONS
    disappearProjectInformations() {
      gsap.to(this.pageContainer, {
        duration: 0.3,
        opacity: 0,
      })
    },
    appearProjectInformations() {
      gsap.to(this.pageContainer, {
        duration: 0.3,
        opacity: 1,
      })
    },
    appearImage() {
      gsap.to(this.websiteImage.el, {
        opacity: 0,
        duration: 0.3,
      })
    },
    disappearCanvas() {
      if (this.$route.name !== 'About') return
      const canvas = document.querySelector('canvas')
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.3,
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
      console.log(this.imagesWebsite)
    },
  },
}
</script>
