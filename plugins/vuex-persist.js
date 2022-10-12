import { VuexPersistence } from 'vuex-persist'

export default ({ store }) => {
  new VuexPersistence({
    storage: window.sessionStorage,
    reducer: (state) => ({
      selectedProject: state.selectedProject,
    }),
  }).plugin(store)
}
