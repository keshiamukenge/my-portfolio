import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import gsap, { Power2 } from 'gsap'
import * as dat from 'dat.gui'

import { PerspectiveCamera } from 'three'
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

		this.gui = new dat.GUI()

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

		this.initComposer()
	}

	initSecondWebgl({ images }) {
		this.scene2 = new THREE.Scene()
		
		this.camera2 = new PerspectiveCamera(70, this.sizes.width / this.sizes.height, 100, 2000)
		this.camera2.position.set(1, 1, 100)
		this.gui.add(this.camera2.position, 'z', 0, 1000, 0.01).name('cameraZ')
		// this.camera2.lookAt()

		this.renderer2 = new THREE.WebGLRenderer({
			alpha: true,
			antialias: false,
			canvas: document.querySelector('canvas.second-webgl'),
		})
		// this.renderer2.setSize(this.sizes.width, this.sizes.height)
		console.log(images)

		if(images[0] !== null) {
			this.imageParameters = images.map(image => {
				const bounds = image.getBoundingClientRect()
		
				this.geometry2 = new THREE.PlaneBufferGeometry(image.width, image.height, 8, 8)
				
				this.material2 = new THREE.MeshBasicMaterial({
					side: THREE.DoubleSide,
					map: new THREE.TextureLoader().load(image.src)
				});
				this.material2.clone();
				this.material2.uniformsNeedUpdate = true;

				
				this.plane2 = new THREE.Mesh(this.geometry2, this.material2);
				this.camera2.lookAt(this.plane2)
				
				this.scene2.add(this.plane2);
				
				return {
					image,
					mesh: this.plane2,
					top: bounds.top,
					left: bounds.left,
					width: bounds.width,
					height: bounds.height,
				};
			})
		}
	}

	// SETTERS
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

	updateSecondWebgl() {
		requestAnimationFrame(() => this.updateSecondWebgl())
			this.setProjectsPlanesPositions()
		// this.material2.uniformsNeedUpdate = true
	}

	setProjectsPlanesPositions() {
    this.imageParameters.forEach(image => {
      image.mesh.position.y = -image.top + this.sizes.height / 2 - image.height / 2;
      image.mesh.position.x = image.left - this.sizes.width / 2 + image.width / 2;
    });
  }

	// SETUP POST PROCESSING
	initComposer() {
		const renderPass = new RenderPass(this.scene, this.camera)
		this.waterEffect = waterEffect({ texture: this.waterTexture })
		const waterPass = new EffectPass(this.camera, this.waterEffect)
		waterPass.renderToScreen = true
		renderPass.renderToScreen = false
		this.composer.addPass(renderPass)
		this.composer.addPass(waterPass)
	}

	// ANIMATIONS AND TRANSITIONS
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