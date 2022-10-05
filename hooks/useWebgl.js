import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import gsap, { Power2, Power4 } from 'gsap'
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

		this.scrollOptions = {
			current: 0,
			target: 0,
			ease: 0.75
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

	initSecondWebgl() {
		this.offset = new THREE.Vector2(0.0, 0.0)
		this.scene2 = new THREE.Scene()
		this.canvas2 = document.querySelector('canvas.second-webgl')
		this.sizes2 = {
			width: this.canvas2.getBoundingClientRect().width,
			height: this.canvas2.getBoundingClientRect().height,
		}
		
		this.camera2 = new PerspectiveCamera(70,  this.sizes2.width / this.sizes2.height, 100, 2000)
		this.camera2.position.z = 600;
		this.camera2.fov = 2 * Math.atan((this.sizes2.height / 2) / 600 ) * (180 / Math.PI);
		this.camera2.updateProjectionMatrix()

		this.renderer2 = new THREE.WebGLRenderer({
			alpha: true,
			antialias: false,
			canvas: this.canvas2,
		})
		this.renderer2.setPixelRatio(Math.min(window.devicePixelRatio,2))
		this.renderer2.setSize( this.sizes2.width, this.sizes2.height );

	}

	// DEBUG GUI
	addGui() {
		this.gui.add(this.camera2.position, 'z', 0, 1000, 1).name('cameraZ')
	}

	createProjectsPlanes({ images }) {
		if(images[0] === null) return

		this.material2 = new THREE.ShaderMaterial({
			uniforms: {
				Mouse: {
					value: this.mousePosition,
				},
				uOffset: {
					value: new THREE.Vector2(0.0, 0.0),
				},
				uAlpha: {
					value: 1,
				},
				uTexture: {
					value: null,
				},
			},
			side: THREE.DoubleSide,
			fragmentShader: `
				uniform sampler2D uTexture;
				uniform vec2 uOffset;
        uniform float uAlpha;

        varying vec2 vUv;
        
				void main() {
          vec3 texture = texture2D(uTexture,vUv).rgb;
          gl_FragColor = vec4(texture, uAlpha);
        }
			`,
			vertexShader: `
				uniform vec2 uOffset;

        varying vec2 vUv;

        float PI = 3.1415926535897932384626433832795;

        vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
          position.x = position.x + (sin(uv.y * PI) * offset.x);
          position.y = position.y + (sin(uv.x * PI) * offset.y);
          return position;
        }

        void main() {
          vUv =  uv + (uOffset * 0.003);
          vec3 newPosition = position;
          newPosition = deformationCurve(position, uv, uOffset);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
			`,
		})

		this.materials2 = []

		this.imageParameters = images.map(image => {
			const bounds = image.getBoundingClientRect()
	
			this.geometry2 = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 16, 16)
			const texture = new THREE.TextureLoader().load(image.src)
			texture.needsUpdate = true;

			const material = this.material2.clone();
			material.uniforms.uTexture.value = new THREE.TextureLoader().load(image.src);
			material.uniforms.uTexture.value.needsUpdate = true;
			material.uniformsNeedUpdate = true
			this.materials2.push(material)
			// this.material2.clone();
			// this.material2.map.needsUpdate = true
			
			this.plane2 = new THREE.Mesh(this.geometry2, material)
			// this.setOffset({
			// 	width: bounds.width,
			// 	left: bounds.left,
			// 	top: bounds.top,
			// 	height: bounds.height,
			// })
			// this.plane2.position.set(this.offset.x, this.offset.y, 0)
			// this.camera2.lookAt(this.plane3)
			
			this.scene2.add(this.plane2)

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

	setProjectPlanesPositions({ plane, image }) {
		plane.position.y = -image.top + this.sizes2.height / 2 - image.height / 2
		plane.position.x = image.left - this.sizes2.width / 2 + image.width / 2
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

	setOffset({ width, left, top, height }) {
		this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2); 
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

		// window.addEventListener('wheel', (event) => {
		// 	this.imageParameters.forEach(image => {
		// 		this.updatePlaneDeformationCurve({
		// 			deltaY: event.deltaY,
		// 			uOffset: image.mesh.material.uniforms.uOffset.value,
		// 			imageSize: image
		// 		})
		// 		image.mesh.material.uniformsNeedUpdate = true
		// 	})
		// })

		this.renderer2.render(this.scene2, this.camera2)
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
	lerp(start, end, t) {
		return start * (1 - t) + end * t
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

	updatePlaneDeformationCurve({ uOffset, deltaY, imageSize }) {
		deltaY *= 0.003;
		gsap.to(uOffset, {
			y: deltaY.map(
					-1,
						1,
						-imageSize.height / 2,
						imageSize.height / 2
					),
					ease: Power4.easeOut,
		})
	}
}

const useWebGL = () => {
	return webgl || (webgl = new WebGL())
}

export default useWebGL