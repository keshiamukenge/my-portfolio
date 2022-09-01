<template>
  <PageContainer ref="pageContainer">
    <Header :before-go-about="hideText" :before-go-home="hideText" />
    <SmoothScroll>
      <MainContainer ref="projectContainer">
        <ContainerProjectInformationsSection>
          <ContainerProjectInformationsIntroduction>
            <ProjectTitle>
              <intersect :threshold="[0.9]" @enter.once="revealTitle = true">
                <Title
                  :text="$store.state.selectedProject.title"
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
              v-for="role in $store.state.selectedProject.role"
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
          <ContainerProjectDescription>
            <ContainerProjectInformations>
              <Subtitle>
                <intersect
                  :threshold="[0.9]"
                  @enter.once="revealProjectPart.firstSection = true"
                >
                  <Title
                    :text="$store.state.selectedProject.parts.date.title"
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
                    :text="$store.state.selectedProject.parts.date.content"
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
                    :text="$store.state.selectedProject.parts.client.title"
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
                  :text="$store.state.selectedProject.parts.client.content"
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
                    :text="
                      $store.state.selectedProject.parts.technologies.label
                    "
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
                    :text="
                      $store.state.selectedProject.parts.technologies.content
                    "
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
                    :text="$store.state.selectedProject.parts.description.title"
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
                    :text="
                      $store.state.selectedProject.parts.description.content
                    "
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
        </ContainerProjectInformationsSection>
      </MainContainer>
    </SmoothScroll>
    <Footer />
  </PageContainer>
</template>

<script>
import gsap, { Power2 } from 'gsap'
import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import Intersect from 'vue-intersect'
import { mapMutations } from 'vuex'
import Title from '../../shared/vue-lib/src/stories/components/Title/Title.vue'
import Paragraph from '../../shared/vue-lib/src/stories/components/Paragraph/Paragraph.vue'

import SmoothScroll from '../../components/SmoothScroll'
import { colors, fonts } from '../../theme'
import { Header, Footer } from '../../components/Essentials'
import {
  initTexture,
  addPoint,
  updatePoints,
  setTouchTextureValue,
} from '../utils/touchTexture'
import waterEffect from '../utils/waterEffect'
import {
  MainContainer,
  ProjectTitle,
  Subtitle,
  ContainerProjectInformationsSection,
  ContainerProjectDescription,
  PageContainer,
  Informations,
  ContainerProjectInformations,
  SpanElement,
  ContainerSpanElement,
  ContainerProjectInformationsIntroduction,
} from './styledComponents'

export default {
  name: 'Project',
  components: {
    Header,
    Footer,
    MainContainer,
    ProjectTitle,
    ContainerProjectInformationsSection,
    ContainerProjectDescription,
    SmoothScroll,
    PageContainer,
    Subtitle,
    Informations,
    ContainerProjectInformations,
    Title,
    Intersect,
    Paragraph,
    SpanElement,
    ContainerSpanElement,
    ContainerProjectInformationsIntroduction,
  },
  transition: {
    leave(el, done) {
      gsap.to(el, {
        duration: 0.5,
        delay: 0.8,
        opacity: 0,
        ease: Power2.easeInOut,
      })
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
      updateSize: false,
      size: {
        width: 0,
        height: 0,
      },
      planeScale: {
        x: 500,
        y: 550,
      },
      projectContainer: {
        el: null,
        height: 0,
      },
      pageContainer: null,
      touchTextureOptions: {},
    }
  },
  async mounted() {
    try {
      await this.$store.dispatch('fetchProjectsData')
    } catch (e) {
      console.log(e)
    }

    this.SET_BODY_OVERFLOW()
    this.touchTextureOptions = setTouchTextureValue({
      size: 80,
      radius: 80 * 0.9,
      maxAge: 80,
    })
    this.setMousePosition()
    this.initWebgl()
    this.update()
    this.projectContainer = {
      el: this.$refs.projectContainer.$el,
      height: this.$refs.projectContainer.$el.clientHeight,
    }

    setTimeout(() => {
      this.upContainerProjectInformations()
    }, 1000)
  },
  methods: {
    ...mapMutations(['SET_DISAPPEAR_TITLE', 'SET_BODY_OVERFLOW']),
    setMousePosition() {
      window.addEventListener('mousemove', (event) => {
        this.mousePosition = {
          x: event.clientX / window.innerWidth,
          y: event.clientY / window.innerHeight,
        }

        addPoint({
          point: this.mousePosition,
          radius: this.touchTextureOptions.radius,
          maxAge: this.touchTextureOptions.maxAge,
        })
      })
    },
    upContainerProjectInformations() {
      gsap.to(this.projectContainer.el, {
        marginTop: 73 + 'vh',
        duration: 1,
      })
    },
    hideText() {
      this.revealTitle = false
      this.revealProjectPart = {
        firstSection: false,
        secondSection: false,
        thirdSection: false,
        fourthSection: false,
      }
    },

    // SETUP 3D SCENE
    initWebgl() {
      this.waterTexture = initTexture()
      this.clock = new THREE.Clock()
      this.pageContainer = this.$refs.pageContainer.$el

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
      this.camera.position.z = 195
      this.scene = new THREE.Scene()

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
      })
      this.renderer.setSize(this.size.width, this.size.height)

      this.composer = new EffectComposer(this.renderer)

      this.pageContainer.appendChild(this.renderer.domElement)

      // setup plane
      this.geometry = new THREE.PlaneBufferGeometry(1, 1, 62, 62)
      this.texture = this.$store.state.selectedProject.id
        ? this.$store.state.selectedProject.image.url
        : this.$store.state.projectsData[this.$store.state.defaultId].image.url
      this.material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        depthTest: false,
        transparent: true,
        map: new THREE.TextureLoader().load(this.texture),
      })
      this.material.uniformsNeedUpdate = true
      this.plane = new THREE.Mesh(this.geometry, this.material)
      this.plane.scale.x = this.planeScale.x
      this.plane.scale.y = this.planeScale.y
      this.scene.add(this.plane)

      // setup post-processing
      this.initComposer()
    },
    setPlaneCoverWindowSize() {
      if (this.imagesOptions.aspect > this.size.aspect) {
        this.planeScale.coverWindow.x = this.plane.scale.x =
          this.imagesOptions.aspect / this.size.aspect
        this.planeScale.coverWindow.y = this.plane.scale.y = 1
      } else {
        this.planeScale.coverWindow.x = this.plane.scale.x = 1
        this.planeScale.coverWindow.y = this.plane.scale.y =
          this.size.aspect / this.imagesOptions.aspect
      }
    },
    updatePlaneSize() {
      this.geometry.width = this.size.width
      this.geometry.height = this.size.height
    },
    onResize() {
      window.addEventListener('resize', () => {
        this.size.width = window.innerWidth
        this.size.height = window.innerHeight

        this.camera.aspect = this.size.width / this.size.height
        this.camera.updateProjectionMatrix()

        this.composer.setSize(this.size.width, this.size.height)
        this.updatePlaneSize()
      })
    },
    update() {
      requestAnimationFrame(this.update)
      updatePoints({
        maxAge: this.touchTextureOptions.maxAge,
        radius: this.touchTextureOptions.radius,
      })
      this.onResize()
      this.updatePlaneSize()
      this.material.uniformsNeedUpdate = true
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
