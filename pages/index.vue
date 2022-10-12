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
            @click="() => SET_SELECTED_PROJECT({ id: activeProject?.id || 0 })"
          />
          <ProjectTitle>
            <Title
              :text="project.title"
              :title-class="'project-title' + project.id"
              :reveal="project.value.revealTitle"
              split-characters="words"
              :font="titleFont"
              :font-color="titleColor"
              font-size="6rem"
              :duration="0.7"
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
                split-characters="words"
                :font="bodyFont"
                :font-color="titleColor"
                font-size="4rem"
                :duration="1"
                :animation="3"
                :timeline-delay-on-reveal="1"
              />
            </Pagination>
          </ContainerPagination>
        </NuxtLink>
      </ContainerProject>
    </ContainerProjects>
  </div>
</template>

<script>
// import * as THREE from 'three'
import { gsap } from 'gsap'
import { mapMutations, mapGetters } from 'vuex'
import { Title } from '../components/TextAnimations'

import { fonts, colors } from '../theme'
import Loader from '../components/Loader'
import useWebGL from '../hooks/useWebGL'
import {
  ContainerProjects,
  ContainerProject,
  ImageElement,
  ProjectTitle,
  ContainerPagination,
  Pagination,
} from './styledComponents'
import smoothScroll from '~/mixins/smoothScroll'

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
    selectedProject: function () {
      this.DISABLE_ACTIVE_TITLE()
    },
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
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
      await this.setImageOptions({ image: this.projects[0].image })
      await this.setTextures()
    } catch (error) {
      this.SET_ERROR('Error while fetching homepage data')
    }

    this.appearCanvas()
    this.ENABLE_TITLE_ON_HOMEPAGE()

    this.webgl = useWebGL()
    this.webgl.isRunning = true

    setTimeout(() => {
      this.webgl.isRunning = false
    }, 2500)

    this.webgl.textures = this.textures
    this.webgl.initFirstWebgl()
    this.webgl.updatePlaneCenteredPosition()
    this.webgl.updateFirstWebgl()
    this.webgl.imagesOptions = this.imagesOptions

    window.addEventListener('wheel', this.onWheel)
  },
  async beforeDestroy() {
    await this.webgl.startWebglTransition({ textures: '' })
    await window.removeEventListener('wheel', this.onWheel)
  },
  destroyed() {
    this.webgl.destroy({
      renderer: this.webgl.renderer,
      scene: this.webgl.scene,
    })
  },
  methods: {
    ...mapMutations([
      'SET_SELECTED_PROJECT',
      'SET_PROJECTS_ORDER',
      'DISABLE_PREVIOUS_TITLE',
      'DISABLE_ACTIVE_TITLE',
      'ENABLE_ACTIVE_TITLE',
      'ENABLE_TITLE_ON_HOMEPAGE',
      'SET_ERROR',
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
    setTextures() {
      this.textures.default = this.projects[0].image.url
      this.textures.active =
        this.activeProject === null
          ? this.textures.default
          : this.selectedProject?.image.url || this.textures.default
    },
    setImageOptions({ image }) {
      this.imagesOptions = {
        width: image.width,
        height: image.height,
        aspect: image.width / image.height,
      }
    },
    appearCanvas() {
      const canvas = document.querySelector('canvas.main-webgl')
      gsap.to(canvas, {
        opacity: 1,
        duration: 0.5,
      })
    },
  },
}
</script>
