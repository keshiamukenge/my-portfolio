import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import gsap, { Power2 } from 'gsap'
// import * as dat from 'dat.gui'

import {
  initTexture,
  addPoint,
  updatePoints,
} from './utils/touchTexture'
import waterEffect from './utils/waterEffect'

let webgl

class WebGL {
	constructor() {
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
			aspect: window.innerWidth / window.innerHeight,
		}
		this.isRunning = false

		this.textures = {
			previous: null,
			next: null,
			active: null,
			selected: null,
			default: null
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
			ease: 0.075
		}

		// this.gui = new dat.GUI()

		this.setMousePosition({ waterEffectOptions: this.waterEffectOptions })
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
					value: new THREE.TextureLoader().load('images/cam-portfolio-project.jpeg'),
				},
				texture2: {
					type: 'f',
					value: new THREE.TextureLoader().load('images/cam-portfolio-project.jpeg'),
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
		this.plane.frustumCulled = false;
		this.plane.scale.z = 1
		this.setPlaneSize()

		this.scene.add(this.plane)

		this.initComposer({ scene: this.scene, camera: this.camera })
	}

	initSecondWebgl() {
		this.canvas2 = document.querySelector('canvas.second-webgl')
		this.container = document.querySelector('.container-project-information')
		this.sizes2 = {
			width: this.container.getBoundingClientRect().width,
			height: this.container.getBoundingClientRect().height,
			top: this.container.getBoundingClientRect().top,
			left: this.container.getBoundingClientRect().left,
			aspect: this.container.getBoundingClientRect().width / this.container.getBoundingClientRect().height,
		}
		this.scene2 = new THREE.Scene()

		const perspective = 1000
		const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI
		this.camera2 = new THREE.PerspectiveCamera(fov, this.sizes.aspect, 1, 1000)
		this.camera2.position.set(0, 0, perspective)

		this.renderer2 = new THREE.WebGL1Renderer({ antialias: true, alpha: true, canvas: this.canvas2 })
		this.renderer2.setSize(this.sizes.width, this.sizes.height)
		this.renderer2.setPixelRatio(window.devicePixelRatio)
		this.composer = new EffectComposer(this.renderer2)
		this.initComposer({ scene: this.scene2, camera: this.camera2 })
	}

	// DEBUG GUI
	addGui() {
		this.gui.add(this.camera2.position, 'z', 0, 1000, 1).name('cameraZ')
	}

	createProjectsPlanes({ images }) {
		if(images[0] === null) return

		this.imagesParameters = images.map(image => {
			this.offset = new THREE.Vector2(0.0, 0.0)
			this.projectPlaneSizes = new THREE.Vector2(0, 0)
			
			this.geometry2 = new THREE.PlaneGeometry(1, 1, 100, 100)
			this.material2 = new THREE.ShaderMaterial({
				uniforms: {
					uOffset: {
						value: new THREE.Vector2(0.0, 0.0),
					},
					uAlpha: {
						value: 1.0,
					},
					uTexture: {
						value: new THREE.TextureLoader().load(image.src),
					},
				},
				side: THREE.DoubleSide,
				fragmentShader: `
				uniform sampler2D uTexture;
				uniform float uAlpha;
				uniform vec2 uOffset;
				varying vec2 vUv;
				
				void main() {
					vec3 texture = texture2D(uTexture,vUv).rgb;
          gl_FragColor = vec4(texture, uAlpha);
				}
				`,
				vertexShader: `
				uniform sampler2D uTexture;
				uniform vec2 uOffset;
				varying vec2 vUv;
				
				#define M_PI 3.1415926535897932384626433832795
				
				vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
					position.x = position.x + (sin(uv.y * M_PI) * offset.x);
					position.y = position.y + (sin(uv.x * M_PI) * offset.y);
					return position;
				}
				
				void main() {
					vUv = uv;
					vec3 newPosition = deformationCurve(position, uv, uOffset);
					gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
				}
				`,
			})
			this.plane2 = new THREE.Mesh(this.geometry2, this.material2)
			this.setProjectsPlanesDimensions({ image })
			this.plane2.position.set(this.offset.x, image.getBoundingClientRect().top, 0)
			this.plane2.scale.set(this.projectPlaneSizes.width, this.projectPlaneSizes.height, 1)
			
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
		this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2)
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

	updateFirstWebgl() {
		requestAnimationFrame(() => this.updateFirstWebgl())
		updatePoints({
			maxAge: this.waterEffectOptions.maxAge,
			radius: this.waterEffectOptions.radius,
		})
		this.material.uniformsNeedUpdate = true
		this.composer.render(this.clock.getDelta())
	}

	updateScrollOptions({ target, lerp }) {
		this.scrollOptions.target = target
		this.scrollOptions.ease = lerp
    this.scrollOptions.current = this.lerp(
			this.scrollOptions.current,
			this.scrollOptions.target,
			this.scrollOptions.ease
		)
	}

	updateSecondWebgl({ images }) {
		requestAnimationFrame(() => this.updateSecondWebgl({ images }))

		this.imagesParameters.forEach(image => {
			this.setProjectsPlanesDimensions({ image: image.domEl })
			image.plane.position.set(this.offset.x, this.offset.y, 0)
			image.plane.scale.set(this.projectPlaneSizes.x, this.projectPlaneSizes.y, 1)
			// image.plane.material.uniforms.uOffset.value.x = this.offset.x * 0.0
			// image.plane.material.uniforms.uOffset.value.y = -(this.scrollOptions.target - this.scrollOptions.current) * 0.0003
			image.plane.material.uniformsNeedUpdate = true
		})
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
    return start * (1 - t ) + end * t;
	}

	updatePlaneCenteredPosition() {
		this.setPlaneSize()
		this.camera.updateProjectionMatrix()
		this.composer.setSize(this.sizes.width, this.sizes.height)
	}

	updatePlaneCoverWindowSize() {
		if (this.imagesOptions.aspect > this.sizes.aspect) {
			this.plane.scale.x = this.imagesOptions.aspect / this.sizes.aspect
			this.plane.scale.y = 1
		} else {
			this.plane.scale.x = 1
			this.plane.scale.y = this.sizes.aspect / this.imagesOptions.aspect
		}
	}

	updateWebgl2() {
		this.camera2.updateProjectionMatrix()
		this.composer.setSize(this.sizes.width, this.sizes.height)
	}

	scaleUpPlaneCoverWindowSize() {
		if (this.imagesOptions.aspect > this.sizes.aspect) {
			gsap.to(this.plane.scale, {
				x: this.imagesOptions.aspect / this.sizes.aspect,
				y: 1,
				duration: 1.7,
				ease: Power2.easeInOut,
			})
		} else {
			gsap.to(this.plane.scale, {
				x: 1,
				y: this.sizes.aspect / this.imagesOptions.aspect,
				duration: 1.7,
				ease: Power2.easeInOut,
			})
		}
	}

	scaleDownPlaneCenteredPosition({ viewportOptions }) {
		const aspect = 1.25
		if (viewportOptions.aspect < aspect) {
			gsap.to(this.plane.scale, {
				x: aspect / viewportOptions.aspect / 2.8,
				y: 1 / 2.3,
				duration: 1.7,
				ease: Power2.easeInOut,
			})
		} else {
			gsap.to(this.plane.scale, {
				x: 1 / 2.8,
				y: viewportOptions.aspect / aspect / 2.3,
				duration: 1.7,
				ease: Power2.easeInOut,
			})
		}
	}

	startWebglTransition({ textures }) {
		if (this.isRunning) return

		this.isRunning = true
		this.material.uniforms.texture2.value = new THREE.TextureLoader().load(textures.active)
		gsap.to(this.material.uniforms.progress, {
			value: 1,
			duration: 2,
			ease: Power2.easeInOut,
			onComplete: () => {
				this.material.uniforms.texture1.value = new THREE.TextureLoader().load(textures.active)
				this.material.uniforms.progress.value = 0
				this.isRunning = false
			},
		})
	}
}

const useWebGL = () => {
	return webgl || (webgl = new WebGL())
}

export default useWebGL