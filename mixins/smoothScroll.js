import LocomotiveScroll from 'locomotive-scroll'
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      scroll: null,
      elements: [],
    }
  },
  mounted() {
    this.container = document.querySelector('main')

    this.scroll = new LocomotiveScroll({
      el: this.container,
      smooth: true,
      offset: [10, 0],
      lerp: 0.1,
    })

    this.scroll.on('scroll', ({ scroll, limit }) => {
      const progress = (scroll.y / limit.y) * 100
      this.SET_SCROLL_INSTANCE({ progress })
    })
  },
  updated() {
    this.scroll.update()
  },
  destroyed() {
    this.scroll.destroy()
  },
  methods: {
    ...mapMutations(['SET_SCROLL_INSTANCE']),
  },
}
