import Vue from 'vue';
import axios from 'axios';

axios.defaults.baseURL =
  typeof window._ENV_ !== 'undefined'
    ? window._ENV_.API_URL
    : process.env.VUE_APP_ROOT_API;

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

if (window && window.localStorage && window.localStorage.getItem('api_token')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.getItem('api_token');
} else if (window && window.sessionStorage && window.sessionStorage.getItem('api_token')) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + window.sessionStorage.getItem('api_token');
}

export default axios;
Vue.prototype.$axios = axios;
