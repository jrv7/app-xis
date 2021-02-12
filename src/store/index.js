import Vue from 'vue'
import Vuex from 'vuex'
import loginStore from "@/login/store";
import router from '../router/index'; 

Vue.use(Vuex)

const state = {
  xisMenus: {
    main: [],
    subs: [],
    accessedMenu: null
  },
  dictionaryMounted: false,
  advancedFilters: [],
  router
};

const mutations = {
  setSelectedMainMenu: (state, mainMenuId) => {
    sessionStorage.setItem('accessed-main-menu', mainMenuId);
  },
  storeAccessedMenu: (state, accessedMenu) => {
    sessionStorage.setItem('accessed-menu', accessedMenu.menu_url_hash);
    state.accessedMenu = accessedMenu.menu_url_hash;
  },
  storeMainMenus: (state, mainMenus) => {
    state.xisMenus.main = mainMenus;
  },
  setDictionary: (state, dictionary) => {
    localStorage.setItem('xis-dictionary', JSON.stringify(dictionary));
  },
  setAdvancedFilters: (state, data) => {
    sessionStorage.setItem(('advanced-filters-' + data.submenuId), JSON.stringify(data.filters));
  }
};

const getters = {
  getStoredMainMenus: () => {
    return state.xisMenus.main;
  },
  getSelectedMainMenu: () => {
    const storedItem = sessionStorage.getItem('accessed-main-menu');

    if (storedItem !== null) {
      return storedItem;
    } else {
      return null;
    }
  },
  getSelectedMenu: () => {
    const storedItem = sessionStorage.getItem('accessed-menu');

    if (storedItem !== null) {
      return storedItem;
    } else {
      return state.accessedMenu;
    }
  },
  getDictionary: () => {
    return localStorage.getItem('xis-dictionary');
  },
  getAdvancedFilters: (state) => {
    let menuHash = state.router.history.current.params.submenuId;
    return sessionStorage.getItem('advanced-filters-' + menuHash);
  }
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
  modules: {
    login: loginStore
  }
})
