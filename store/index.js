const baseURL = 'http://localhost:3000/data/data.json'

export const state = {
  headerData: {},
  footerData: {},
  projectsData: [],
  activeId: 0,
  defaultId: 0,
  projectsOrder: {
    active: 0,
    previous: null,
    next: null,
  },
  selectedProject: {},
  activeProject: {},
  previousActiveProject: null,
  error: '',
  viewport: {
    width: 0,
    height: 0,
    aspect: 0
  },
  webglTransitionIsRunning: false,
}

export const getters = {
  GET_PROJECTS_DATA: (state) => state.projectsData,
  GET_ACTIVE_PROJECT: (state) => state.projectsOrder.active,
  GET_PREVIOUS_PROJECT: (state) => state.projectsOrder.previous,
  GET_NEXT_PROJECT: (state) => state.projectsOrder.next,
  GET_SELECTED_PROJECT: (state) => state.selectedProject,
  GET_VIEWPORT: (state) => state.viewport
}

export const mutations = {
  SET_VIEWPORT(state) {
    state.viewport.width = window.innerWidth
    state.viewport.height = window.innerHeight
    state.viewport.aspect = window.innerWidth / window.innerHeight
  },
  SET_WEBGL_TRANSITION_IS_RUNNING(state, { value }) {
    state.webglTransitionIsRunning = value
  },
  SET_PROJECTS_ORDER(state, { direction }) {
    state.projectsOrder.previous = state.projectsData[state.activeId]

      if (direction === 1) {
        if(state.activeId === state.projectsData.length - 1) {
          state.activeId = 0
          state.projectsOrder.active = state.projectsData[state.activeId]
          state.projectsOrder.next = state.projectsData[state.activeId + 1]

        } else {
          state.activeId += 1
          const nextId = state.activeId === state.projectsData.length - 1 ? 0 : state.activeId + 1
          state.projectsOrder.active = state.projectsData[state.activeId]
          state.projectsOrder.next = state.projectsData[nextId]
        }
      } else if(state.activeId === 0) {
          state.activeId = state.projectsData.length - 1
          state.projectsOrder.active = state.projectsData[state.activeId]
          state.projectsOrder.next = state.projectsData[state.activeId - 1]
        } else {
          state.activeId -= 1
          const nextId = state.activeId === 0 ? state.projectsData.length - 1 : state.activeId - 1
          state.projectsOrder.active = state.projectsData[state.activeId]
          state.projectsOrder.next = state.projectsData[nextId]
        }
  },
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
