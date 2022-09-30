import * as THREE from 'three'
import { EffectPass, EffectComposer, RenderPass } from 'postprocessing'
import gsap, { Power2 } from 'gsap'

import {
  initTexture,
  addPoint,
  updatePoints,
} from './utils/touchTexture'
import waterEffect from './utils/waterEffect'

let webgl

class WebGL {
	constructor({ viewportSize, textures, imageOptions, waterEffectOptions }) {
		this.sizes = viewportSize
		this.isRunning = false

		this.previousTexture = textures.previous
		this.selectedTexture = textures.selected
		this.defaultTexture = textures.default
		this.activeTexture = textures.active

		this.imagesOptions = imageOptions
		this.waterEffectOptions = waterEffectOptions

		this.setMousePosition({ waterEffectOptions: this.waterEffectOptions })
		
		this.initWebgl({ viewportSize, textures })
		this.update({ waterEffectOptions: this.waterEffectOptions })
	}

	// SETUP 3D SCENE
	initWebgl({ textures }) {
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
			canvas: document.querySelector('canvas'),
		})
		this.renderer.setSize(this.sizes.width, this.sizes.height)

		this.composer = new EffectComposer(this.renderer)

		// setup plane
		this.geometry = new THREE.PlaneBufferGeometry(1, 1, 62, 62)

		this.texture1 = () => {
			if (this.selectedTexture) {
				return new THREE.TextureLoader().load(this.selectedTexture)
			} else if (this.previousTexture) {
				return new THREE.TextureLoader().load(this.previousTexture)
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
					value: new THREE.TextureLoader().load(textures.selected || textures.previous || textures.default),
				},
				texture2: {
					type: 'f',
					value: new THREE.TextureLoader().load(textures.next),
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
	}

	// SETTERS
	setPlaneCenteredPosition() {
		window.addEventListener('resize', () => {
			this.setPlaneSize()

			this.camera.updateProjectionMatrix()

			this.composer.setSize(this.sizes.width, this.sizes.height)
		})
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

	update({ waterEffectOptions}) {
		requestAnimationFrame(() => this.update({ waterEffectOptions }))
		updatePoints({
			maxAge: waterEffectOptions.maxAge,
			radius: waterEffectOptions.radius,
		})
		this.material.uniformsNeedUpdate = true
		this.composer.render(this.clock.getDelta())
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

const useWebGL = ({ viewportSize, textures, imageOptions, waterEffectOptions }) => {
	return webgl || (webgl = new WebGL({ viewportSize, textures, imageOptions, waterEffectOptions }))
}

export default useWebGL