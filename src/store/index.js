import Vue from 'vue'
import Vuex from 'vuex'
import loginStore from "@/login/store";
import router from '../router/index'; 

Vue.use(Vuex)

const state = {
  xisStateUser: {
    id: null,
    name: null,
    email:null,
    profile_picture: null,
    superuser: false
  },
  xisStateLanguage: (parseInt(sessionStorage.getItem('session-language')) || 1),
  xisStateDictionary: (JSON.parse(localStorage.getItem('xis-dictionary')) || []),
  xisStateMenuTree: (JSON.parse(sessionStorage.getItem('menu-tree')) || []),
  xisStateCurrentMenu: (JSON.parse(sessionStorage.getItem('current-menu')) || {}),
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
  setUserSession (state, userData) {
    if (userData) {
      console.log('Colocando os dados na sessionStore');
      sessionStorage.setItem('user-data', JSON.stringify(userData));
    }

    state.xisStateUser = JSON.parse(sessionStorage.getItem('user-data'));
  },
  setLanguage: (state, language) => {
    state.xisStateLanguage = language;
    sessionStorage.setItem('session-language', parseInt(language));
  },
  setDictionary: (state, dictionary) => {
    if (dictionary) {
      localStorage.setItem('xis-dictionary', JSON.stringify(dictionary));
      state.xisStateDictionary = dictionary;
    } else {
      let hasDictionary = localStorage.getItem('xis-dictionary');

      if (hasDictionary != null) {
        state.xisStateDictionary = JSON.parse(hasDictionary);
      }
    }
  },
  setMenuTree (state, menuTree) {
    if (menuTree) {
      sessionStorage.setItem('menu-tree', JSON.stringify(menuTree));
      state.xisStateMenuTree = menuTree;
    } else {
      let hasMenuTree = sessionStorage.getItem('menu-tree');

      if (hasMenuTree != null) {
        state.xisStateMenuTree = JSON.parse(hasMenuTree);
      }
    }
  },
  setCurrentMenus (state, menuParams) {
    if (!menuParams) {
      let currentMenu = sessionStorage.getItem("current-menu");
  
      if (currentMenu != null) {
        state.xisStateCurrentMenu = JSON.parse(currentMenu);
      }
    } else {
      console.log('Setando o novo menu acessado');
      console.log(menuParams);
      state.xisStateCurrentMenu = menuParams;
      sessionStorage.setItem("current-menu", JSON.stringify(menuParams));
    }
  },






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
  resetDictionary: () => {
    localStorage.removeItem('xis-dictionary');
    sessionStorage.removeItem('untranslatedWords');
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
  },
  storeUntranslatedWord: (state, word) => {
    let setDictionary = sessionStorage.getItem('untranslatedWords');
    let dictionary = null;

    if (setDictionary != null) {
      dictionary = JSON.parse(setDictionary);
    } else {
      dictionary = [];
    }

    if (dictionary.findIndex(i => { return (i == word) }) < 0) {
      dictionary.push(word);
    }

    sessionStorage.setItem('untranslatedWords', JSON.stringify(dictionary));
  }
};

const getters = {
  hasUserData () {
    return (sessionStorage.getItem('user-data') != null);
  },
  hasMenuTree: () => {
    return (sessionStorage.getItem('menu-tree') != null);
  },
  hasDictionary: () => {
    return (localStorage.getItem('xis-dictionary') != null);
  },
  getDictionary: () => {
    return localStorage.getItem('xis-dictionary');
  },








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
  getSelectedMenuObject: () => {
    let Menu = null;

    const mainMenus = sessionStorage.getItem('main-menus');
    const storedItem = sessionStorage.getItem('accessed-menu');
    
    if (mainMenus != null) {
      JSON.parse(mainMenus).forEach(mainM => {
        mainM.children.forEach(fatherM => {
          fatherM.children.forEach(menu => {
            if (menu.menu_url_hash == storedItem) {
              menu.fatherMenu = fatherM;
              menu.mainMenu = mainM;
              Menu = menu;
            }
          });
        });
      });

      return Menu;
    }

    return null;
  },
  getMenuStructure: () => {
    return state.xisMenus.accessedMenu;
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
  getUntranslatedWords: () => {
    return sessionStorage.getItem('untranslatedWords');
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
