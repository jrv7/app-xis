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
  listOrders: [],
  router
};

const mutations = {
  setSelectedMainMenu: (state, mainMenuId) => {
    sessionStorage.setItem('accessed-main-menu', mainMenuId);
  },
  storeAccessedMenu: (state, accessedMenu) => {
    sessionStorage.setItem('accessed-menu', accessedMenu.menu_url_hash);
    state.xisMenus.accessedMenu = accessedMenu.menu_url_hash;
  },
  storeMainMenus: (state, mainMenus) => {
    sessionStorage.setItem('main-menus', JSON.stringify(mainMenus));
    state.xisMenus.main = mainMenus;
  },
  setDictionary: (state, dictionary) => {
    localStorage.setItem('xis-dictionary', JSON.stringify(dictionary));
  },
  resetDictionary: () => {
    localStorage.removeItem('xis-dictionary');
  },
  setAdvancedFilters: (state, data) => {
    let findIndex = state.advancedFilters.findIndex(i => { return (i.menuHash == data.submenuId) });

    if (findIndex >= 0) {
      state.advancedFilters[findIndex].filters = JSON.stringify(data.filters);
    } else {
      state.advancedFilters.push({
        menuHash: data.submenuId,
        filters: JSON.stringify(data.filters)
      });
    }
    localStorage.setItem(('advanced-filters-' + data.submenuId), JSON.stringify(data.filters));
  },
  setListOrder: (state, data) => {
    let setOrders = null;
    setOrders = localStorage.getItem('list-orders');
    if (!setOrders) {
      setOrders = localStorage.getItem('list-orders');
    }
    if (!setOrders) {
      setOrders = localStorage.getItem('list-orders');
    }

    if (setOrders != null) {
      setOrders = JSON.parse(setOrders);
    }

    if (!state.listOrders.length) {
      if (setOrders != null) {
        state.listOrders = setOrders;
      }
    }

    let menuIndex = state.listOrders.findIndex(i => { return (i.menuHash == data.submenuId) });

    if (menuIndex >= 0) {
      let oldOrder = state.listOrders[menuIndex].order;

      let fieldOrderIndex = oldOrder.findIndex(i => { return (i.fieldId == data.fieldId) });

      if (fieldOrderIndex >= 0) {
        oldOrder[fieldOrderIndex].order = data.order;
      } else {
        if (data.order) {
          let newOrder = {
            fieldId: data.fieldId,
            order: data.order
          };

          oldOrder.push(newOrder);
        }
      }
    } else {
      if (data.order) {
        let newOrder = [
          {
            fieldId: data.fieldId,
            order: data.order
          }
        ];
        state.listOrders.push(
          {
            menuHash: data.submenuId,
            order: newOrder
          }
        );
      }
    }

    state.listOrders = state.listOrders.map(i => {
      i.order = i.order.filter(j => { return (j.order > 0) });

      return i;
    })

    localStorage.setItem('list-orders', JSON.stringify(state.listOrders));
  }
};

const getters = {
  getLastAccessedMenu: () => {
    let lastAccessedMenu = {
      mainMenu: sessionStorage.getItem("last-accessed-main-menu-hash"),
      submenu: sessionStorage.getItem("last-accessed-menu-hash"),
      routeName: sessionStorage.getItem("last-accessed-menu-name"),
      ids: sessionStorage.getItem("last-accessed-menu-ids"),
    }

    return lastAccessedMenu;
  },
  getStoredMainMenus: () => {
    let mainMenus = sessionStorage.getItem('main-menus');
    if (mainMenus != null) {
      return JSON.parse(mainMenus);
    } else {
      return [];
    }
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
      return state.xisMenus.accessedMenu;
    }
  },
  getMenuStructure: () => {
    return state.xisMenus.accessedMenu;
  },
  getDictionary: () => {
    return localStorage.getItem('xis-dictionary');
  },
  getAdvancedFilters: (state) => {
    let menuHash = state.router.history.current.params.submenuId;
    
    let findIndex = state.advancedFilters.findIndex(i => { return (i.menuHash == menuHash) });

    if (findIndex >= 0) {
      return state.advancedFilters[findIndex].filters;
    }

    let setFilters = null;
    setFilters = localStorage.getItem('advanced-filters-' + menuHash);
    if (!setFilters) {
      setFilters = localStorage.getItem('advanced-filters-' + menuHash);
    }
    if (!setFilters) {
      setFilters = localStorage.getItem('advanced-filters-' + menuHash);
    }

    return setFilters;
  },
  getListOrders: (state) => {
    let menuHash = state.router.history.current.params.submenuId;
    
    let findIndex = state.listOrders.findIndex(i => { return (i.menuHash == menuHash) });

    if (findIndex >= 0) {
      return state.listOrders[findIndex].order;
    }

    let setOrders = null;

    setOrders = localStorage.getItem('list-orders');
    if (!setOrders) {
      setOrders = localStorage.getItem('list-orders');
    }
    if (!setOrders) {
      setOrders = localStorage.getItem('list-orders');
    }

    if (setOrders != null) {
      setOrders = JSON.parse(setOrders);
      let findIndex = setOrders.findIndex(i => { return (i.menuHash == menuHash) });

      if (findIndex >= 0) {
        return setOrders[findIndex].order;
      }
    }
    
    return null;
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
