<template>
  <div ref="pageContainer">
    <Loader />
    <ContainerProjects>
      <ContainerProject
        v-for="project in $store.state.projectsData"
        :key="project.id"
      >
        <NuxtLink :to="'/project/' + $store.state.projectsData[activeId].route">
          <ImageElement
            ref="images"
            :src="project.image.url"
            @click="
              SET_SELECTED_PROJECT({ id: activeId })
              SET_DISAPPEAR_TITLE()
              webgl.scaleUpPlaneCoverWindowSize()
            "
          />
          <ProjectTitle>
            <Title
              :text="project.title"
              :title-class="'project-title' + project.id"
              :reveal="project.value.revealTitle"
              split-characters="letters"
              :font="titleFont"
              :font-color="titleColor"
              font-size="4rem"
              :duration="0.5"
              :animation="3"
              :timeline-delay-on-reveal="1"
            />
          </ProjectTitle>
          <ContainerPagination>
            <Pagination>
              <Title
                :text="`${project.id + 1}`"
                :title-class="'pagination' + project.id"
                :reveal="project.value.revealPagination"
                split-characters="letters"
                :font="bodyFont"
                :font-color="titleColor"
                font-size="1rem"
                :duration="0.5"
                :animation="2"
                :timeline-delay-on-reveal="1"
              />
            </Pagination>
            <PaginationDivided />
            <Pagination>3</Pagination>
          </ContainerPagination>
        </NuxtLink>
      </ContainerProject>
    </ContainerProjects>
  </div>
</template>

<script>
import gsap, { Power2 } from 'gsap'
import { mapMutations } from 'vuex'
import Title from '../shared/vue-lib/src/stories/components/Title/Title.vue'

import { fonts, colors } from '../theme'
import Loader from '../components/Loader'
import {
  ContainerProjects,
  ContainerProject,
  ImageElement,
  ProjectTitle,
  ContainerPagination,
  Pagination,
  PaginationDivided,
} from './styledComponents'
import smoothScroll from '@/mixins/smoothScroll'
import useWebGL from '@/hooks/useWebGL'

export default {
  name: 'Home',
  components: {
    ContainerProjects,
    ContainerProject,
    ImageElement,
    Title,
    ProjectTitle,
    ContainerPagination,
    Pagination,
    PaginationDivided,
    Loader,
  },
  mixins: [smoothScroll],
  transition: {
    leave(el, done) {
      const canvas = document.querySelector('canvas')
      if (this.$nuxt._route.name === 'About') {
        gsap.to(el, {
          duration: 0.5,
          opacity: 0,
          ease: Power2.easeInOut,
        })
        gsap.to(canvas, {
          duration: 0.5,
          opacity: 0,
          ease: Power2.easeInOut,
          onComplete: () => canvas.remove(),
        })
        setTimeout(() => {
          done()
        }, 700)
      } else {
        gsap.to(el, {
          duration: 0.5,
          opacity: 0,
          ease: Power2.easeInOut,
        })
        setTimeout(() => {
          done()
        }, 2200)
      }
    },
  },
  data() {
    return {
      webgl: null,
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont,
      titleColor: colors.white,
      pageContainer: null,
      activeId: this.$store.state.activeProject?.id
        ? this.$store.state.activeProject.id
        : 0,
      imagesOptions: {
        width: 0,
        height: 0,
        aspect: 0,
      },
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
      await this.setImageOptions({
        image:
          this.$store.state.projectsData[this.$store.state.defaultId].image,
      })
      await this.SET_ACTIVED_PROJECT({
        id: this.activeId,
      })
    } catch (e) {
      console.log(e)
    }

    this.webgl = useWebGL({
      viewportSize: this.$store.state.viewport,
      imageOptions: this.imagesOptions,
      waterEffectOptions: {
        size: 50,
        radius: 50 * 0.9,
        maxAge: 30,
      },
      textures: {
        active: this.$store.state.projectsData[this.activeId]?.image,
        previous:
          this.$store.state.projectsData[
            this.$store.state.previousActiveProject?.id
          ]?.image?.url,
        default:
          this.$store.state.projectsData[this.$store.state.defaultId]?.image
            ?.url,
        selected:
          this.$store.state.projectsData[this.$store.state.selectedProject?.id]
            ?.image?.url,
      },
    })

    this.pageContainer = this.$refs.pageContainer

    window.addEventListener('wheel', (event) => {
      if (this.$nuxt._route.name === 'index') {
        if (!this.isRunning) {
          this.SET_PREVIOUS_ACTIVE_PROJECT({
            id: this.activeId,
          })
          if (event.deltaY > 0) {
            this.setActivedProject('next')
            this.webgl.startWebglTransition()
          } else {
            this.setActivedProject('previous')
            this.startWebglTransition()
          }
        }
      }
    })

    window.addEventListener('resize', () => {
      this.webgl.setPlaneCenteredPosition()
    })
  },
  methods: {
    // STORE
    ...mapMutations([
      'SET_SELECTED_PROJECT',
      'SET_ACTIVED_PROJECT',
      'SET_PREVIOUS_ACTIVE_PROJECT',
      'SET_DISAPPEAR_TITLE',
    ]),
    setActivedProject(direction) {
      if (direction === 'next') {
        this.activeId++

        if (this.activeId > this.$store.state.projectsData.length - 1) {
          this.activeId = 0
        }
      } else {
        this.activeId === 0 ? (this.activeId = 2) : this.activeId--
      }

      this.SET_ACTIVED_PROJECT({ id: this.activeId })
    },

    // SETTERS
    setImageOptions({ image }) {
      this.imagesOptions = {
        width: image.width,
        height: image.height,
        aspect: image.width / image.height,
      }
    },
  },
}
</script>
