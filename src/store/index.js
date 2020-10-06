import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mdname: '',//md文件名称
    value:'',//blog界面搜索框的值
  },
  mutations: {
    setMdname(state, val) {
      state.mdname = val
    },
    setValue(state,val) {
      state.value = val
    },
    setValueAgain(state) {
      state.value = ''
    },
  },
  actions: {
  },
  modules: {
  }
})
