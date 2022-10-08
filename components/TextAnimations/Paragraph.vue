<template>
  <DefaultParagraph
    ref="paragraphRef"
    :class="$props.paragraphClass"
    :y="lineHeight"
    :font="font"
  >
    {{ text }}
  </DefaultParagraph>
</template>

<script>
import { gsap } from 'gsap'

import { DefaultParagraph } from './styledComponents'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Paragraph',
  components: {
    DefaultParagraph,
  },
  props: {
    paragraphClass: {
      type: String,
      default: 'text',
      require: true,
    },
    text: {
      type: String,
      default:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      require: true,
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
      default: '<15%',
      require: false,
    },
    font: {
      type: String,
      default: "'Roboto', sans-serif",
      require: false,
    },
  },
  data() {
    return {
      paragraph: null,
      paragraphWidth: 0,
      words: [],
      lines: [],
      line: [],
      lineWidth: 0,
      lineHeight: 101,
    }
  },
  watch: {
    // eslint-disable-next-line object-shorthand
    paragraphClass: function () {
      return this.$props.paragraphClass
    },
    // eslint-disable-next-line object-shorthand
    reveal: function () {
      if (this.$props.reveal) {
        this.revealText()
      } else {
        this.hideText()
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.paragraph = this.$refs.paragraphRef
      this.getParagraphWidth()
      this.getWords()
      this.splitedInLines({ wrapEl: 'span', wrapClass: 'line' })
    })
  },
  methods: {
    getParagraphWidth() {
      this.paragraphWidth = this.paragraph.$el.getBoundingClientRect().width
    },
    getWords() {
      this.words = this.paragraph.$el.innerText.split(/( )/g)
      this.paragraph.$el.innerHTML = this.words
        .map((word) => `<span>${word}</span>`)
        .join('')
    },
    splitedInLines({ wrapEl, wrapClass }) {
      this.spans = this.paragraph.$el.querySelectorAll('span')
      this.spans.forEach((span) => {
        const spanWidth = span.getBoundingClientRect().width
        if (this.lineWidth + spanWidth <= this.paragraphWidth - 4) {
          this.line.push(span)
          this.lineWidth += spanWidth
        } else {
          this.lines = [...this.lines, this.line]
          this.line = []
          this.lineWidth = 0
          this.line.push(span)
          this.lineWidth += spanWidth
        }
      })
      if (this.line.length) this.lines = [...this.lines, this.line]
      const newLines = this.lines
        .map(
          (line, id) =>
            `<div class="container-line${id}">
              <${wrapEl} class=${wrapClass + id}>
                ${line.map((span) => span.innerText).join('')}
              </${wrapEl}>
            </div>
            `
        )
        .join('')
      this.paragraph.$el.innerHTML = newLines
    },
    revealText() {
      const timeline = gsap.timeline()
      const paragraph = document.querySelector(`.${this.$props.paragraphClass}`)

      for (let i = 0; i < paragraph.children.length; i++) {
        timeline.to(
          paragraph.children[i].querySelector('span'),
          {
            duration: this.$props.duration,
            y: 0,
            ease: 'power3.out',
          },
          this.$props.delay
        )
      }
    },
    hideText() {
      const timeline = gsap.timeline()
      const paragraph = document.querySelector(`.${this.$props.paragraphClass}`)

      for (let i = 0; i < paragraph.children.length; i++) {
        timeline.to(
          paragraph.children[i].querySelector('span'),
          {
            duration: this.$props.duration,
            y: this.lineHeight,
            ease: 'power3.in',
          },
          this.$props.delay
        )
      }
    },
  },
}
</script>
