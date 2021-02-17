import Vue from 'vue'
import './config/index.js';
import '@/commons/boot.js';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '@/assets/scss/xis.scss'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue';
import router from './router';
import store from './store';
import { VTooltip, } from 'v-tooltip';
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.directive('tooltip', VTooltip)

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(Antd)

library.add(far)
library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import StructureMixins from '@/commons/mixins/structure';
Vue.mixin(StructureMixins);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
