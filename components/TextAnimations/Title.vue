<template>
  <DefaultHeading
    ref="heading"
    :class="titleClass"
    :y="characterHeight"
    :font="font"
    :font-size="fontSize"
    :font-color="fontColor"
    :font-weight="fontWeight"
    :min-width="minCharactersSpacing"
  >
    {{ text }}
  </DefaultHeading>
</template>

<script>
import { gsap } from 'gsap'

import { DefaultHeading } from './styledComponents'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Title',
  components: {
    DefaultHeading,
  },
  props: {
    text: {
      type: String,
      default: 'Heading text',
      require: true,
    },
    splitCharacters: {
      type: String,
      default: 'words',
      require: false,
    },
    animation: {
      type: Number,
      default: 1,
      require: false,
    },
    reveal: {
      type: Boolean,
      default: false,
      require: false,
    },
    duration: {
      type: Number,
      default: 1,
      require: false,
    },
    delay: {
      type: String,
      default: '<5%',
      require: false,
    },
    font: {
      type: String,
      default: "'Roboto', sans-serif",
      require: false,
    },
    fontSize: {
      type: String,
      default: '2rem',
      require: false,
    },
    fontColor: {
      type: String,
      default: 'black',
      require: false,
    },
    fontWeight: {
      type: Number,
      default: 400,
      require: false,
    },
    minCharactersSpacing: {
      type: String,
      default: '15px',
      require: false,
    },
    titleClass: {
      type: String,
      default: 'title',
      require: true,
    },
    timelineDelayOnReveal: {
      type: Number,
      default: 0,
      require: false,
    },
    timelineDelayOnHide: {
      type: Number,
      default: 0,
      require: false,
    },
  },
  data() {
    return {
      heading: null,
      characters: [],
      characterHeight: 101,
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    titleClass: function () {
      return this.$props.titleClass
    },
    // eslint-disable-next-line object-shorthand
    reveal: function () {
      if (this.$props.reveal) {
        this.revealText()
      } else {
        const selectedAnimation = this.$props.animation
        switch (selectedAnimation) {
          case 1:
            this.hideDownText()
            break
          case 2:
            this.hideUpText({ reset: false })
            break
          case 3:
            this.hideUpText({ reset: true })
            break
          default:
            this.hideDownText()
        }
      }
    },
    // eslint-disable-next-line object-shorthand
    splitCharacters: function () {
      this.splitedText()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.heading = this.$refs.heading
      this.splitedText()
    })

    setTimeout(() => {
      if (this.$props.reveal) {
        this.revealText()
      }
    }, 1000)
  },
  methods: {
    splitedText() {
      this.characters =
        this.$props.splitCharacters === 'letters'
          ? this.heading.$el.innerText.split('')
          : this.heading.$el.innerText.split(/( )/g)
      this.heading.$el.innerHTML = this.characters
        .map(
          (character, id) => `
					<div class="containerCharacter${id}">
						<span class="character${id}">${character}</span>
					</div>
					`
        )
        .join('')
    },
    revealText() {
      const title = document.querySelector(`.${this.$props.titleClass}`)

      const timeline = gsap.timeline({
        delay: this.$props.timelineDelayOnReveal,
      })

      for (let i = 0; i < title.children.length; i++) {
        timeline.to(
          title.children[i].querySelector('span'),
          {
            duration: this.$props.duration,
            y: 0,
            ease: 'power3.out',
          },
          this.$props.delay
        )
      }
    },
    hideDownText() {
      const title = document.querySelector(`.${this.$props.titleClass}`)

      this.characterHeight =
        title?.children[0].getBoundingClientRect().height + 3
      const timeline = gsap.timeline({
        delay: this.$props.timelineDelayOnHide,
      })

      for (let i = 0; i < title.children.length; i++) {
        timeline.to(
          title.children[i].querySelector('span'),
          {
            duration: this.$props.duration,
            y: this.characterHeight,
            ease: 'power3.in',
          },
          this.$props.delay
        )
      }
    },
    hideUpText({ reset }) {
      const title = document.querySelector(`.${this.$props.titleClass}`)

      this.characterHeight =
        title?.children[0].getBoundingClientRect().height + 3
      const timeline = gsap.timeline({
        delay: this.$props.timelineDelayOnHide,
      })

      for (let i = 0; i < title.children.length; i++) {
        timeline.to(
          title.children[i].querySelector('span'),
          {
            duration: this.$props.duration,
            y: -this.characterHeight,
            ease: 'power3.in',
            onComplete: () => {
              if (reset) {
                timeline.set(title.children[i].querySelector('span'), {
                  clearProps: true,
                })
              }
            },
          },
          this.$props.delay
        )
      }
    },
  },
}
</script>
