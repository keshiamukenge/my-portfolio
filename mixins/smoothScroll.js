import LocomotiveScroll from 'locomotive-scroll'

export default {
	mounted() {
		this.container = document.querySelector('main')

		this.scroll = new LocomotiveScroll({
			el: this.container,
			smooth: true,
			offset: [20, 0],
		})
	},
	destroyed() {
		this.scroll.destroy()
	},
}