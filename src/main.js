import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App.vue'
import router from './router'
import microStore from './store'
import Pagination from "@/components/Pagination";
import RightToolbar from "@/components/RightToolbar"
import { getDicts } from '@/api/system/dict/data'
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from '@/utils/ruoyi'
// 时间插件
import moment from "moment";
Vue.prototype.addDateRange = addDateRange
Vue.prototype.microStore = microStore;
Vue.prototype.getDicts = getDicts
Vue.config.productionTip = false
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.use(ElementUI);
Vue.prototype.resetForm = resetForm
import BoContainer from '@/components/Boshland/BoContainer/boContainer'
import BoMain from '@/components/Boshland/BoContainer/boMain'
import BoDialog from '@/components/Boshland/BoContainer/boDialog'
Vue.component('BoContainer', BoContainer)
Vue.component('BoMain', BoMain)
Vue.component('BoDialog', BoDialog)
Vue.prototype.handleTree = handleTree
Vue.prototype.moment = moment
Vue.prototype.$BASE_API = window.globalEnv.VUE_APP_BASE_API
let instance = null;

import MasterBanUi from '@/components/MasterBanUi/index'
Vue.use(MasterBanUi)
import PublicMethodMixin from '@/mixins/PublicMethod'
Vue.mixin(PublicMethodMixin)
import MasterbanUtil from "@/mixins/masterbanUtil";
Vue.mixin(MasterbanUtil)
import BoContainerMix from '@/mixins/boContainer'
Vue.mixin(BoContainerMix)
export async function bootstrap() {
    console.log('react app bootstraped');
}
import {
    download,
} from "@/utils/ruoyi";
Vue.prototype.download = download

/**
* @author Coder
* @date 2022/12/6
* @des 微前端子应用
*/
Vue.prototype.$EventBus = new Vue()
export async function mount(props) {
    window.KevinUtils = props.KevinUtils
    if (props.MainComponents) {
        window.MainComponents = props.MainComponents
        Vue.component('KevinRender', window.MainComponents.KevinRender)
    }
    window.commonComponents = props.commonComponents
    Vue.prototype.$mainStore = Vue.observable(props.store)
    Vue.prototype.$net = props.net
    Vue.prototype.$request = props.request
    Vue.prototype.$checkPermi = props.checkPermi
    Vue.prototype.parentRouter = props.router
    Vue.use(props.directive)
    instance = new Vue({
        router,
        store: Vue.observable(props.store),//在微应用中 对共享的store实例进行响应式设置
        render: h => h(App)
    }).$mount('#subBase')
}
/**
* @author Coder
* @date 2022/11/24
* @des 独立运行
*/
if (!window.__POWERED_BY_QIANKUN__) {
    console.log('独立运行')
    new Vue({
        el: '#subBase',
        router,
        store: microStore,
        render: (h) => h(App),
    });
}

export async function unmount() {
    instance.$destroy();
    instance = null;
}
