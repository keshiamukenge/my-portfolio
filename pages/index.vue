<template>
  <div>
    <Header />
    <ContainerProjects>
      <SwitchButton top="13%" @click="setActivedProject('previous')"
        >Previous</SwitchButton
      >
      <NuxtLink :to="'/project/' + activeId">
        <ContainerProject
          v-for="project in $store.state.projectsData"
          :key="project.id"
          @click="
            SET_SELECTED_PROJECT({ id: activeId })
            switchProject()
          "
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
      <SwitchButton top="87%" @click="setActivedProject('next')"
        >Next</SwitchButton
      >
    </ContainerProjects>
    <Footer />
  </div>
</template>

<script>
import gsap from 'gsap'
import { mapMutations } from 'vuex'
import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import Title from '../shared/vue-lib/src/stories/components/Title/Title.vue'

import { fonts, colors } from '../theme'
import { Header, Footer } from '../components/Essentials'
import { initTexture, addPoint, updatePoints } from './utils/touchTexture'
import waterEffect from './utils/waterEffect'
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
  data() {
    return {
      titleFont: fonts.titleFont,
      bodyFont: fonts.bodyFont,
      titleColor: colors.white,
      imagesSizes: {
        width: 0,
        height: 0,
      },
      activeId: 0,
      size: {
        width: 0,
        height: 0,
      },
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    activeId: function () {
      this.material.uniforms.uTexture.value = new THREE.TextureLoader().load(
        this.$store.state.activeProject.image.url
      )
    },
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
    } catch (e) {
      console.log(e)
    }

    this.imagesSizes.width = this.$refs.images[0].$el.clientWidth
    this.imagesSizes.height = this.$refs.images[0].$el.clientHeight

    this.setMousePosition()

    this.setCanvas()
    this.initWebgl()
    this.update()
  },
  methods: {
    ...mapMutations([
      'SET_SELECTED_PROJECT',
      'SET_ACTIVED_PROJECT',
      'SET_PREVIOUS_ACTIVE_PROJECT',
    ]),
    setMousePosition() {
      window.addEventListener('mousemove', (event) => {
        this.mousePosition = {
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
        }

        addPoint({ point: this.mousePosition })
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

    switchProject() {
      gsap.to(this.material, {
        opacity: 0,
        duration: 3,
      })
    },

    // SETUP 3D SCENE
    setCanvas() {
      this.canvas = document.createElement('canvas')
      document.body.appendChild(this.canvas)
      this.canvas.style.width = window.innerWidth
      this.canvas.style.height = window.innerHeight
    },
    initWebgl() {
      this.waterTexture = initTexture()
      this.clock = new THREE.Clock()

      this.size = {
        width: window.innerWidth,
        height: window.innerHeight,
      }
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.size.width / this.size.height,
        0.1,
        1000
      )
      this.camera.position.z = 600
      this.scene = new THREE.Scene()

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
      })
      this.renderer.setSize(this.size.width, this.size.height)

      this.composer = new EffectComposer(this.renderer)

      document.body.appendChild(this.renderer.domElement)

      // setup plane
      this.geometry = new THREE.PlaneBufferGeometry(
        this.imagesSizes.width,
        this.imagesSizes.height,
        50,
        50
      )
      this.material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        depthTest: false,
        transparent: true,
        vertexShader: `
        varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: `
          uniform sampler2D uTexture;

          varying vec2 vUv;

          void main() {
            vec3 texture = texture2D(uTexture, vUv).rgb;
            gl_FragColor = vec4(texture, 1.0);
          }`,
        uniforms: {
          uTexture: {
            value: new THREE.TextureLoader().load(
              this.$store.state.projectsData[this.activeId].image.url
            ),
          },
        },
      })
      this.material.uniformsNeedUpdate = true
      this.plane = new THREE.Mesh(this.geometry, this.material)
      this.scene.add(this.plane)

      // setup post-processing
      this.initComposer()
    },
    onResize() {
      window.addEventListener('resize', () => {
        this.size.width = window.innerWidth
        this.size.height = window.innerHeight

        this.camera.aspect = this.size.width / this.size.height
        this.camera.updateProjectionMatrix()

        this.composer.setSize(this.size.width, this.size.height)
        this.geometry.width = this.imagesSizes.width
        this.geometry.height = this.imagesSizes.height
      })
    },
    update() {
      requestAnimationFrame(this.update)
      updatePoints()
      this.onResize()
      this.composer.render(this.clock.getDelta())
    },

    // SETUP POST PROCESSING
    initComposer() {
      const renderPass = new RenderPass(this.scene, this.camera)
      this.waterEffect = waterEffect({ texture: this.waterTexture })
      const waterPass = new EffectPass(this.camera, this.waterEffect)
      waterPass.renderToScreen = true
      renderPass.renderToScreen = false
      this.composer.addPass(renderPass)
      this.composer.addPass(waterPass)
    },
  },
}
</script>
