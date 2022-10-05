<template>
  <div>
    <Loader />
    <ContainerProjects>
      <ContainerProject
        v-for="project in $store.state.projectsData"
        :key="project.id"
      >
        <NuxtLink :to="'/project/' + selectedProject.route">
          <ImageElement
            ref="images"
            :src="project.image.url"
            @click="
              () => {
                SET_SELECTED_PROJECT({ id: activeProject?.id || 0 })
                DISABLE_ACTIVE_TITLE()
              }
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
            <Pagination>{{ projects.length }}</Pagination>
          </ContainerPagination>
        </NuxtLink>
      </ContainerProject>
    </ContainerProjects>
  </div>
</template>

<script>
import gsap from 'gsap'
import { mapMutations, mapGetters } from 'vuex'
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
      if (this.$route.name === 'About') {
        gsap.to(el, {
          opacity: 0,
          duration: 0.5,
          onComplete: done,
        })
      }

      setTimeout(() => {
        done()
      }, 2200)
    },
  },
  data() {
    return {
      webgl: null,
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont,
      titleColor: colors.white,
      imagesOptions: {
        width: 0,
        height: 0,
        aspect: 0,
      },
      textures: {
        default: null,
        active: null,
        previous: null,
        next: null,
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
  watch: {
    // eslint-disable-next-line object-shorthand
    activeProject: function () {
      this.textures = {
        default: this.projects[0].image.url,
        active: this.activeProject.image.url,
        previous: this.previousProject.image.url,
        next: this.nextProject.image.url,
      }
      this.webgl.startWebglTransition({ textures: this.textures })
    },
    // eslint-disable-next-line object-shorthand
    selectedProject: function () {
      this.webgl.scaleUpPlaneCoverWindowSize()
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')

      await this.setImageOptions({ image: this.projects[0].image })

      this.textures.default = this.textures.active = this.projects[0].image.url
      this.textures.next = this.projects[1].image.url
    } catch (e) {
      console.log(e)
    }

    const canvas = document.querySelector('canvas')
    gsap.to(canvas, {
      opacity: 1,
      duration: 0.5,
    })

    this.ENABLE_ACTIVE_TITLE()

    this.webgl = useWebGL()
    this.webgl.textures = this.textures
    this.webgl.imagesOptions = this.imagesOptions
    this.webgl.sizes = this.viewport
    this.webgl.updatePlaneCenteredPosition()

    window.addEventListener('wheel', this.onWheel)

    window.addEventListener('resize', () => {
      if (this.$route.name === 'index') {
        this.webgl.updatePlaneCenteredPosition()
      }
    })
  },
  async beforeDestroy() {
    await this.disappearCanvas()
    await window.removeEventListener('wheel', this.onWheel)
  },
  methods: {
    ...mapMutations([
      'SET_SELECTED_PROJECT',
      'SET_PROJECTS_ORDER',
      'DISABLE_PREVIOUS_TITLE',
      'DISABLE_ACTIVE_TITLE',
      'ENABLE_PREVIOUS_TITLE',
      'ENABLE_ACTIVE_TITLE',
    ]),
    onWheel(event) {
      if (this.webgl.isRunning) return

      if (event.deltaY > 0) {
        this.SET_PROJECTS_ORDER({ direction: 1 })
        this.ENABLE_ACTIVE_TITLE()
        this.DISABLE_PREVIOUS_TITLE()
      } else {
        this.SET_PROJECTS_ORDER({ direction: 0 })
        this.ENABLE_ACTIVE_TITLE()
        this.DISABLE_PREVIOUS_TITLE()
      }
    },
    setImageOptions({ image }) {
      this.imagesOptions = {
        width: image.width,
        height: image.height,
        aspect: image.width / image.height,
      }
    },
    disappearCanvas() {
      if (this.$route.name !== 'About') return

      const canvas = document.querySelector('canvas')
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.5,
      })
    },
  },
}
</script>
