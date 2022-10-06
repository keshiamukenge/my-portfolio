import LocomotiveScroll from 'locomotive-scroll'
import { mapMutations, mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters({
			selectedProject: 'GET_SELECTED_PROJECT'
		})
	},
	data() {
		return {
			scroll: null,
			elements: []
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
	},
	updated() {
		this.scroll.update()
	},
	destroyed() {
		this.scroll.destroy()
	},
	methods: {
		...mapMutations(['SET_SCROLL_INSTANCE']),
	}
}