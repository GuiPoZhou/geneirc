import Vue from 'vue'
import Vuex from 'vuex'
import entrust from "./entrust/entrust";
import app from './modules/app'
import system from './system/index'
import process from './modules/process'
import standardManagement from './modules/standardManagement'
import masterBanUi from "@/store/modules/masterBanUi";
import BeiYuan from "./modules/BeiYuan";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    entrust,
    system,
    process,
    standardManagement,
    app,
    BeiYuan,
    masterBanUi
  }
})
