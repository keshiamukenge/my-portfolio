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
            @click="SET_SELECTED_PROJECT({ id: activeProject.id || 0 })"
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
      if (this.$nuxt._route.name === 'About') {
        gsap.to(el, {
          duration: 0.5,
          opacity: 0,
          ease: Power2.easeInOut,
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
      this.SET_DISAPPEAR_TITLE()
      this.webgl.scaleUpPlaneCoverWindowSize()
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')

      await this.setImageOptions({ image: this.projects[0].image })
      await this.SET_ACTIVED_PROJECT({ id: 0 })

      this.textures.default = this.textures.active = this.projects[0].image.url
      this.textures.next = this.projects[1].image.url
    } catch (e) {
      console.log(e)
    }

    this.webgl = useWebGL({
      viewportSize: this.viewport,
      imageOptions: this.imagesOptions,
      waterEffectOptions: {
        size: 50,
        radius: 50 * 0.9,
        maxAge: 30,
      },
      textures: this.textures,
    })

    window.addEventListener('wheel', (event) => {
      if (this.webgl.isRunning) return

      if (event.deltaY > 0) {
        this.SET_PROJECTS_ORDER({ direction: 1 })
      } else {
        this.SET_PROJECTS_ORDER({ direction: 0 })
      }
    })

    window.addEventListener('resize', () => {
      this.webgl.setPlaneCenteredPosition()
    })
  },
  methods: {
    ...mapMutations([
      'SET_SELECTED_PROJECT',
      'SET_ACTIVED_PROJECT',
      'SET_PREVIOUS_ACTIVE_PROJECT',
      'SET_DISAPPEAR_TITLE',
      'SET_PROJECTS_ORDER',
    ]),

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
