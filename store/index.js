const baseURL = 'http://localhost:3000/data/data.json'

export const state = {
  headerData: {},
  footerData: {},
  projectsData: [],
  defaultId: 0,
  selectedProject: {},
  activeProject: {},
  previousActiveProject: null,
  error: '',
}

export const mutations = {
  SET_HEADER_DATA(state, headerData) {
    state.headerData = headerData
  },
  SET_FOOTER_DATA(state, footerData) {
    state.footerData = footerData
  },
  SET_PROJECTS_DATA(state, projectsData) {
    state.projectsData = projectsData
  },
  SET_SELECTED_PROJECT(state, { id }) {
    state.selectedProject = state.projectsData[id]
  },
  SET_ACTIVED_PROJECT(state, { id }) {
    state.activeProject = state.projectsData[id]
    state.activeProject.value.revealTitle = true
    state.activeProject.value.revealPagination = true
  },
  SET_PREVIOUS_ACTIVE_PROJECT(state, { id }) {
    state.previousActiveProject = state.projectsData[id]
    state.previousActiveProject.value.revealTitle = false
    state.previousActiveProject.value.revealPagination = false
  },
  SET_DISAPPEAR_TITLE(state) {
    if (state?.selectedProject) {
      state.selectedProject.value.revealTitle = false
    } else {
      state.projectsData[0].value.revealTitle = false
    }
  },
  SET_REVEAL_ABOUT_FIRST_TEXT(state, { reveal }) {
    state.revealAbout.firstText = reveal
  },
  SET_BODY_OVERFLOW() {
    const path = window.location.pathname

    if (path.includes('project')) {
      document.body.style.overflowY = 'scroll'
    } else {
      document.body.style.overflowY = 'hidden'
    }
  },
  SET_SELECTED_PROJECT_WITH_ROUTER() {
    const currentPath = window.location.pathname.split('/')[2]
    const projects = state.projectsData

    projects.forEach((project) => {
      if (project.route === currentPath) {
        state.selectedProject = project
      }
    })
  },
  SET_ERROR(state, error) {
    state.error = error
  },
}

export const actions = {
  async fetchHeaderData({ commit }) {
    try {
      const data = await this.$axios.$get(baseURL)

      commit('SET_HEADER_DATA', data.essentials.header)
    } catch (e) {
      const error = 'Error while fetching header data'

      commit('SET_ERROR', error)
    }
  },
  async fetchFooterData({ commit }) {
    try {
      const data = await this.$axios.$get(baseURL)

      commit('SET_FOOTER_DATA', data.essentials.footer)
    } catch (e) {
      const error = 'Error while fetching footer data'

      commit('SET_ERROR', error)
    }
  },
  async fetchProjectsData({ commit }) {
    try {
      const data = await this.$axios.$get(baseURL)

      commit('SET_PROJECTS_DATA', data.projects)
    } catch (e) {
      const error = 'Error while fetching projects data'

      commit('SET_ERROR', error)
    }
  },
}
