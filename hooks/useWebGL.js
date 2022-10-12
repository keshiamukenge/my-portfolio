import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import { gsap, Power2 } from 'gsap'

import waterEffect from './utils/waterEffect'
import { initTexture, addPoint, updatePoints } from './utils/touchTexture'

let webgl

class WebGL {
  constructor() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      aspect: window.innerWidth / window.innerHeight,
    }
    this.isRunning = true

    this.textures = {
      previous: null,
      next: null,
      active: null,
      selected: null,
      default: 'images/cam-portfolio-project.jpeg',
    }

    this.imagesOptions = {
      aspect: 1.25,
      height: 1024,
      width: 1280,
    }
    this.waterEffectOptions = {
      size: 50,
      radius: 50 * 0.9,
      maxAge: 30,
    }

    this.scrollOptions = {
      current: 0,
      target: 0,
      ease: 0.075,
    }

    this.setMousePosition({ waterEffectOptions: this.waterEffectOptions })

    setTimeout(() => {
      this.isRunning = false
    }, 2500)
  }
  // SETUP 3D SCENES

  initFirstWebgl() {
    this.waterTexture = initTexture()
    this.clock = new THREE.Clock()

    this.camera = new THREE.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      -1000,
      1000
    )

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas: document.querySelector('canvas.main-webgl'),
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)

    this.composer = new EffectComposer(this.renderer)

    // setup plane
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 62, 62)

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
          value: new THREE.TextureLoader().load(
            this.textures.active || this.textures.default
          ),
        },
        texture2: {
          type: 'f',
          value: new THREE.TextureLoader().load(this.textures.next),
        },
        displacement: {
          type: 'f',
          value: new THREE.TextureLoader().load('textures/disp2.jpeg'),
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
    this.material.uniforms.texture2.matrixAutoUpdate = false

    this.plane = new THREE.Mesh(this.geometry, this.material)
    this.plane.frustumCulled = false
    this.plane.scale.z = 1
    this.setPlaneSize()

    this.scene.add(this.plane)

    this.initComposer({ scene: this.scene, camera: this.camera })
  }

  initSecondWebgl() {
    this.scene2 = new THREE.Scene()

    this.camera2 = new THREE.OrthographicCamera(
      this.sizes.width / -2,
      this.sizes.width / 2,
      this.sizes.height / 2,
      this.sizes.height / -2,
      -1000,
      1000
    )

    this.renderer2 = new THREE.WebGL1Renderer({
      antialias: true,
      alpha: true,
      canvas: document.querySelector('canvas.second-webgl'),
    })
    this.renderer2.setSize(this.sizes.width, this.sizes.height)
    this.renderer2.setPixelRatio(window.devicePixelRatio)
    this.composer = new EffectComposer(this.renderer2)
    this.initComposer({ scene: this.scene2, camera: this.camera2 })
  }

  createProjectsPlanes({ images }) {
    if (images[0] === null) return

    this.imagesParameters = images.map((image) => {
      this.offset = new THREE.Vector2(0.0, 0.0)
      this.projectPlaneSizes = new THREE.Vector2(0, 0)

      this.geometry2 = new THREE.PlaneGeometry(1, 1, 100, 100)
      this.material2 = new THREE.ShaderMaterial({
        uniforms: {
          uvScale: {
            value: new THREE.Vector2(0.0, 0.0),
          },
          uTexture: {
            value: new THREE.TextureLoader().load(image.src),
          },
        },
        side: THREE.DoubleSide,
        fragmentShader: `
				uniform sampler2D uTexture;

				varying vec2 vUv;
				
				void main() {
					vec3 texture = texture2D(uTexture, vUv).rgb;
          gl_FragColor = vec4(texture, 1.0);
				}
				`,
        vertexShader: `
				uniform sampler2D uTexture;
				uniform vec2 uvScale;

				varying vec2 vUv;
				
				void main() {
					vUv = (uv - 0.5) * uvScale + 0.5;
					
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}
				`,
      })
      this.plane2 = new THREE.Mesh(this.geometry2, this.material2)
      this.setProjectsPlanesDimensions({ image })
      this.plane2.position.set(
        this.offset.x,
        image.getBoundingClientRect().top,
        0
      )
      this.plane2.scale.set(
        this.projectPlaneSizes.width,
        this.projectPlaneSizes.height,
        1
      )

      this.scene2.add(this.plane2)

      return {
        domEl: image,
        plane: this.plane2,
        offset: this.offset,
        sizes: this.projectPlaneSizes,
      }
    })
  }

  // SETTERS
  setProjectsPlanesDimensions({ image }) {
    const { width, height, left, top } = image.getBoundingClientRect()
    this.projectPlaneSizes.set(width, height)
    this.offset.set(
      left - window.innerWidth / 2 + width / 2,
      -top + window.innerHeight / 2 - height / 2
    )
  }

  setProjectPlanesAspect({ imageAspect, planeAspect, uvScale }) {
    if (imageAspect < planeAspect) {
      uvScale.set(imageAspect / planeAspect, 1)
    } else {
      uvScale.set(1, planeAspect / imageAspect)
    }
  }

  setPlaneSize() {
    if (this.imagesOptions.aspect > this.sizes.aspect) {
      this.plane.scale.x = this.imagesOptions.aspect / this.sizes.aspect / 2.8
      this.plane.scale.y = 1 / 2.3
    } else {
      this.plane.scale.x = 1 / 2.8
      this.plane.scale.y = this.sizes.aspect / this.imagesOptions.aspect / 2.3
    }
  }

  setMousePosition({ waterEffectOptions }) {
    window.addEventListener('mousemove', (event) => {
      this.mousePosition = {
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      }

      addPoint({
        point: this.mousePosition,
        radius: waterEffectOptions.radius,
        maxAge: waterEffectOptions.maxAge,
      })
    })
  }

  updateComposerEffect() {
    requestAnimationFrame(() => this.updateComposerEffect())

    updatePoints({
      maxAge: this.waterEffectOptions.maxAge,
      radius: this.waterEffectOptions.radius,
    })
  }

  updateFirstWebgl() {
    requestAnimationFrame(() => this.updateFirstWebgl())

    this.plane.material.uniformsNeedUpdate = true
    this.camera.updateProjectionMatrix()
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.render(this.clock.getDelta())
  }

  updateSecondWebgl({ images }) {
    requestAnimationFrame(() => this.updateSecondWebgl({ images }))

    this.imagesParameters.forEach((image) => {
      this.setProjectsPlanesDimensions({ image: image.domEl })
      const imageAspect = image.sizes.width / image.sizes.height
      const planeAspect = image.plane.scale.x / image.plane.scale.y
      const uvScale = image.plane.material.uniforms.uvScale.value
      this.setProjectPlanesAspect({ imageAspect, planeAspect, uvScale })
      image.plane.position.set(this.offset.x, this.offset.y, 0)
      // image.plane.material.uniformsNeedUpdate = true
    })
    this.camera2.updateProjectionMatrix()
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.render(this.clock.getDelta())
  }

  // SETUP POST PROCESSING
  initComposer({ scene, camera }) {
    const renderPass = new RenderPass(scene, camera)
    this.waterEffect = waterEffect({ texture: this.waterTexture })
    const waterPass = new EffectPass(camera, this.waterEffect)
    waterPass.renderToScreen = true
    renderPass.renderToScreen = false
    this.composer.addPass(renderPass)
    this.composer.addPass(waterPass)
  }

  // ANIMATIONS AND TRANSITIONS
  lerp(start, end, t) {
    return start * (1 - t) + end * t
  }

  updatePlaneCenteredPosition() {
    this.setPlaneSize()
    this.camera.updateProjectionMatrix()
    this.composer.setSize(this.sizes.width, this.sizes.height)
  }

  scaleUpPlaneCoverWindowSize() {
    if (this.imagesOptions.aspect > this.sizes.aspect) {
      gsap.to(this.plane.scale, {
        x: this.imagesOptions.aspect / this.sizes.aspect,
        y: 1,
        duration: 1.7,
        ease: Power2.easeInOut,
        onComplete: () => {
          setTimeout(() => {
            this.renderer.domElement.style.opacity = 0
            this.destroy({ renderer: this.renderer, scene: this.scene })
          }, 2000)
        },
      })
    } else {
      gsap.to(this.plane.scale, {
        x: 1,
        y: this.sizes.aspect / this.imagesOptions.aspect,
        duration: 1.7,
        ease: Power2.easeInOut,
        onComplete: () => {
          setTimeout(() => {
            this.renderer.domElement.style.opacity = 0
            this.destroy({ renderer: this.renderer, scene: this.scene })
          }, 2000)
        },
      })
    }
  }

  startWebglTransition({ textures }) {
    if (this.isRunning) return

    this.isRunning = true
    this.material.uniforms.texture2.value = new THREE.TextureLoader().load(
      textures.active
    )
    gsap.to(this.material.uniforms.progress, {
      value: 1,
      duration: 2,
      ease: Power2.easeInOut,
      onComplete: () => {
        this.material.uniforms.texture1.value = new THREE.TextureLoader().load(
          textures.active
        )
        this.material.uniforms.progress.value = 0
        this.isRunning = false
      },
    })
  }

  // DESTROY
  destroy({ renderer, scene }) {
    renderer.dispose()

    scene.traverse((object) => {
      if (!object.isMesh) return

      object.geometry.dispose()

      if (object.material.isMaterial) {
        this.cleanMaterial(object.material)
      } else {
        // an array of materials
        for (const material of object.material) this.cleanMaterial(material)
      }
    })
  }

  cleanMaterial = (material) => {
    material.dispose()

    // dispose textures
    for (const key of Object.keys(material)) {
      const value = material[key]
      if (value && typeof value === 'object' && 'minFilter' in value) {
        value.dispose()
      }
    }
  }
}

const useWebGL = () => {
  return webgl || (webgl = new WebGL())
}

export default useWebGL
