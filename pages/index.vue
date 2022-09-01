<template>
  <div ref="pageContainer">
    <Header />
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
              scaleUpPlaneCoverWindowSize()
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
    <Footer />
  </div>
</template>

<script>
import gsap, { Power2 } from 'gsap'
import { mapMutations } from 'vuex'
import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import Title from '../shared/vue-lib/src/stories/components/Title/Title.vue'

import { fonts, colors } from '../theme'
import { Header, Footer } from '../components/Essentials'
import Loader from '../components/Loader'
import {
  initTexture,
  addPoint,
  updatePoints,
  setTouchTextureValue,
} from './utils/touchTexture'
import waterEffect from './utils/waterEffect'
import {
  ContainerProjects,
  ContainerProject,
  ImageElement,
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
    Title,
    ProjectTitle,
    ContainerPagination,
    Pagination,
    PaginationDivided,
    Loader,
  },
  transition: {
    leave(el, done) {
      setTimeout(() => {
        done()
      }, 2200)
    },
  },
  data() {
    return {
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
      size: {
        width: 0,
        height: 0,
        aspect: 0,
      },
      updateSize: false,
      touchTextureOptions: {},
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

    this.SET_BODY_OVERFLOW()
    this.touchTextureOptions = setTouchTextureValue({
      size: 50,
      radius: 50 * 0.9,
      maxAge: 30,
    })
    this.pageContainer = this.$refs.pageContainer
    this.setMousePosition()
    this.initWebgl()
    this.update()

    window.addEventListener('wheel', (event) => {
      if (!this.isRunning) {
        this.SET_PREVIOUS_ACTIVE_PROJECT({
          id: this.activeId,
        })
        if (event.deltaY > 0) {
          this.setActivedProject('next')
          this.startWebglTransition()
        } else {
          this.setActivedProject('previous')
          this.startWebglTransition()
        }
      }
    })
  },
  methods: {
    // STORE
    ...mapMutations([
      'SET_SELECTED_PROJECT',
      'SET_ACTIVED_PROJECT',
      'SET_PREVIOUS_ACTIVE_PROJECT',
      'SET_DISAPPEAR_TITLE',
      'SET_BODY_OVERFLOW',
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

    // ANIMATION & TRANSITIONS
    startWebglTransition() {
      if (this.isRunning) return

      this.isRunning = true
      this.material.uniforms.texture2.value = new THREE.TextureLoader().load(
        this.$store.state.projectsData[this.activeId].image.url
      )
      gsap.to(this.material.uniforms.progress, {
        value: 1,
        duration: 2,
        ease: Power2.easeInOut,
        onComplete: () => {
          this.material.uniforms.texture1.value =
            new THREE.TextureLoader().load(
              this.$store.state.projectsData[this.activeId].image.url
            )
          this.material.uniforms.progress.value = 0
          this.isRunning = false
        },
      })
    },
    scaleUpPlaneCoverWindowSize() {
      if (this.imagesOptions.aspect > this.size.aspect) {
        gsap.to(this.plane.scale, {
          x: this.imagesOptions.aspect / this.size.aspect,
          y: 1,
          duration: 1.7,
          ease: Power2.easeInOut,
        })
      } else {
        gsap.to(this.plane.scale, {
          x: 1,
          y: this.size.aspect / this.imagesOptions.aspect,
          duration: 1.7,
          ease: Power2.easeInOut,
        })
      }
    },

    // SETUP 3D SCENE
    initWebgl() {
      this.waterTexture = initTexture()
      this.clock = new THREE.Clock()

      this.setViewportSize()

      this.camera = new THREE.OrthographicCamera(
        -0.5,
        0.5,
        0.5,
        -0.5,
        -1000,
        1000
      )
      // this.camera.position.z = 600
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

      this.previousTexture =
        this.$store.state.projectsData[
          this.$store.state.previousActiveProject?.id
        ]?.image?.url
      this.selectedTexture =
        this.$store.state.projectsData[
          this.$store.state.selectedProject?.id
        ]?.image?.url
      this.defaultTexture =
        this.$store.state.projectsData[this.$store.state.defaultId]?.image?.url

      this.texture1 = () => {
        if (this.selectedTexture) {
          return new THREE.TextureLoader().load(this.selectedTexture)
        } else if (this.previous) {
          return new THREE.TextureLoader().load(this.previous)
        } else {
          return new THREE.TextureLoader().load(this.defaultTexture)
        }
      }

      this.material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        depthTest: false,
        transparent: true,
        vertexShader: `
          varying vec2 vUv;

          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            vUv = uv;
          }
        `,
        fragmentShader: `
          uniform float progress;
		      uniform float intensity;
		      uniform float width;
		      uniform float scaleX;
		      uniform float scaleY;
		      uniform float transition;
		      uniform float radius;
		      uniform float swipe;
		      uniform sampler2D texture1;
		      uniform sampler2D texture2;
		      uniform sampler2D displacement;
		      uniform vec4 resolution;
          uniform bool distorsion;

          varying vec2 vUv;

          mat2 getRotM(float angle) {
		        float s = sin(angle);
		        float c = cos(angle);
		        return mat2(c, -s, s, c);
		      }

          const float PI = 3.1415;
		      const float angle1 = PI * 0.25;
		      const float angle2 = -PI * 0.75;

          void main()	{
			      vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
			      vec4 disp = texture2D(displacement, newUV);
			      vec2 dispVec = vec2(disp.r, disp.g);
            vec2 distortedPosition1 =  newUV + getRotM(angle1) * dispVec * intensity * progress;
			      vec4 t1 = texture2D(texture1, distortedPosition1);
			      vec2 distortedPosition2 = newUV + getRotM(angle2) * dispVec * intensity * (1.0 - progress);
			      vec4 t2 = texture2D(texture2, distortedPosition2);
			      gl_FragColor = mix(t1, t2, progress);
		      }
        `,
        uniforms: {
          uFrequency: {
            value: new THREE.Vector2(20, 5),
          },
          progress: {
            type: 'f',
            value: 0,
          },
          border: {
            type: 'f',
            value: 0,
          },
          intensity: {
            type: 'f',
            value: 1,
          },
          scaleX: {
            type: 'f',
            value: 40,
          },
          scaleY: {
            type: 'f',
            value: 40,
          },
          transition: {
            type: 'f',
            value: 40,
          },
          swipe: {
            type: 'f',
            value: 0,
          },
          width: {
            type: 'f',
            value: 0,
          },
          radius: {
            type: 'f',
            value: 0,
          },
          texture1: {
            type: 'f',
            value: this.texture1(),
          },
          texture2: {
            type: 'f',
            value: new THREE.TextureLoader().load(
              this.$store.state.projectsData[this.activeId].image.url
            ),
          },
          displacement: {
            type: 'f',
            value: new THREE.TextureLoader().load('textures/disp1.jpeg'),
          },
          resolution: {
            type: 'v4',
            value: new THREE.Vector4(0.9, 0.9, 0.9, 0.9),
          },
          distorsion: {
            type: 'bool',
            value: false,
          },
        },
      })
      this.material.uniformsNeedUpdate = true
      this.material.uniforms.texture1.matrixAutoUpdate = false

      this.plane = new THREE.Mesh(this.geometry, this.material)
      this.plane.scale.z = 1
      this.setPlaneSize()

      this.scene.add(this.plane)

      this.initComposer()
    },

    // EVENTS
    onResize() {
      window.addEventListener('resize', () => {
        this.setViewportSize()
        this.setPlaneSize()

        this.camera.updateProjectionMatrix()

        this.composer.setSize(this.size.width, this.size.height)
      })
    },

    // SETTERS
    setImageOptions({ image }) {
      this.imagesOptions = {
        width: image.width,
        height: image.height,
        aspect: image.width / image.height,
      }
    },
    setViewportSize() {
      this.size = {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight,
      }
    },
    setPlaneSize() {
      if (this.imagesOptions.aspect > this.size.aspect) {
        this.plane.scale.x = this.imagesOptions.aspect / this.size.aspect / 2.8
        this.plane.scale.y = 1 / 2.3
      } else {
        this.plane.scale.x = 1 / 2.8
        this.plane.scale.y = this.size.aspect / this.imagesOptions.aspect / 2.3
      }
    },
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
    update() {
      requestAnimationFrame(this.update)
      updatePoints({
        maxAge: this.touchTextureOptions.maxAge,
        radius: this.touchTextureOptions.radius,
      })
      this.onResize()
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
