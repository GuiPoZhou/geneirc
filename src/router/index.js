import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)
const microAcitveRule = `/${process.env.VUE_APP_MICRO_ACTIVERULE}`
const routes = [
    {
        path: microAcitveRule + '/',
        name: 'home',
        component: Home
    },
]
const router = new VueRouter({
    mode: 'history',
    base: process.env.NODE_ENV === "production" ? `/${process.env.VUE_APP_MICRONAME}/` : `/`,
    routes
})

export default router
