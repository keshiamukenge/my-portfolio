<template>
  <div>
    <Header />
    <ContainerProjects>
      <SwitchButton
        top="13%"
        @click="
          setActivedProject('previous')
          switchProject()
        "
        >Previous</SwitchButton
      >
      <NuxtLink :to="'/project/' + activeId">
        <ContainerProject
          v-for="project in $store.state.projectsData"
          :key="project.id"
          @click="SET_SELECTED_PROJECT({ id: activeId })"
        >
          <ImageElement ref="images" :src="project.image.url" />
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
                :animation="3"
                :timeline-delay-on-reveal="1"
              />
            </Pagination>
            <PaginationDivided />
            <Pagination>3</Pagination>
          </ContainerPagination>
        </ContainerProject>
      </NuxtLink>
      <SwitchButton
        top="87%"
        @click="
          setActivedProject('next')
          switchProject()
        "
        >Next</SwitchButton
      >
    </ContainerProjects>
    <Footer />
  </div>
</template>

<script>
import gsap from 'gsap'
import { mapMutations } from 'vuex'
import Title from '../shared/vue-lib/src/stories/components/Title/Title.vue'

import { fonts, colors } from '../theme'
import { Header, Footer } from '../components/Essentials'
import {
  ContainerProjects,
  ContainerProject,
  ImageElement,
  SwitchButton,
  ProjectTitle,
  ContainerPagination,
  Pagination,
  PaginationDivided,
} from './styledComponents'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    ContainerProjects,
    ContainerProject,
    ImageElement,
    SwitchButton,
    Title,
    ProjectTitle,
    ContainerPagination,
    Pagination,
    PaginationDivided,
  },
  transition: {
    leave(el, done) {
      gsap.to(this.images[1].$el, {
        width: 100 + 'vw',
        height: 50 + '%',
        x: 0,
        duration: 1,
        onComplete: done,
      })
    },
    enter(el, done) {
      console.log('enter')
      setTimeout(done, 1000)
    },
  },
  data() {
    return {
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont,
      titleColor: colors.white,
      images: [],
      activeId: 0,
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
    } catch (e) {
      console.log(e)
    }

    this.images = this.$refs.images
    this.images[this.activeId].$el.style.opacity = 1
  },
  methods: {
    ...mapMutations([
      'SET_SELECTED_PROJECT',
      'SET_ACTIVED_PROJECT',
      'SET_PREVIOUS_ACTIVE_PROJECT',
    ]),
    switchProject() {
      gsap.to(this.images[this.$store.state.previousActiveProject.id].$el, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          gsap.to(this.images[this.activeId].$el, {
            opacity: 1,
            duration: 0.6,
          })
        },
      })
    },
    setActivedProject(direction) {
      this.SET_PREVIOUS_ACTIVE_PROJECT({
        id: this.activeId,
      })

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
  },
}
</script>
