<template>
  <PageContainer data-scroll>
    <MainContainer>
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
            @mouseenter="activeWebsiteLink"
            @mouseleave="disableWebsiteLink"
          >
            <ImageWebsiteLink
              :href="selectedProject.website.url"
              target="_blank"
            >
              <ViewSiteText>
                <Title
                  text="Visit Website"
                  title-class="website-link-text"
                  :reveal="websiteImage.appearLink"
                  :font-color="textColor"
                  font-size="1rem"
                  split-characters="lines"
                  :font="bodyFont"
                  :duration="0.5"
                  :animation="1"
                />
              </ViewSiteText>
              <intersect :threshold="[0.9]" @enter.once="appearImage">
                <ImageElement
                  ref="websiteImage"
                  :src="selectedProject.website.image.url"
                />
              </intersect>
            </ImageWebsiteLink>
          </ContainerImageWebsite>
        </ContainerProjectInformationsContent>
      </ContainerProjectInformationsSection>
    </MainContainer>
  </PageContainer>
</template>

<script>
import gsap, { Power2 } from 'gsap'
import { mapGetters } from 'vuex'
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
  ViewSiteText,
  ImageElement,
  ImageWebsiteLink,
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
    ViewSiteText,
    ImageElement,
    ImageWebsiteLink,
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
      gsap.to(el, {
        duration: 0.5,
        delay: 0.8,
        opacity: 0,
        ease: Power2.easeInOut,
      })
      // gsap.to(canvas, {
      //   duration: 0.5,
      //   delay: 0.6,
      //   opacity: 0,
      //   ease: Power2.easeInOut,
      //   onComplete: () => {
      //     done()
      //   },
      // })
      setTimeout(() => {
        done()
      }, 2700)
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
      websiteImage: {
        el: null,
        appearLink: false,
      },
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
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
      console.log(this.selectedProject)
    } catch (e) {
      console.log(e)
    }

    this.websiteImage.el = this.$refs.websiteImage.$el
    console.log(useWebGL())
  },
  methods: {
    // INTERACTIONS
    activeWebsiteLink() {
      setTimeout(() => {
        this.websiteImage.appearLink = true
      }, 400)

      gsap.to(this.websiteImage.el, {
        opacity: 0.2,
        duration: 0.3,
      })
    },
    disableWebsiteLink() {
      this.websiteImage.appearLink = false
      gsap.to(this.websiteImage.el, {
        opacity: 1,
        delay: 0.5,
        duration: 0.3,
      })
    },
    appearImage() {
      gsap.to(this.websiteImage.el, {
        opacity: 1,
        duration: 0.3,
      })
    },
  },
}

// size: 80,
//       radius: 80 * 0.9,
//       maxAge: 80,
</script>
