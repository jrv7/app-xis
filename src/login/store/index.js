const state = {
  profile: {},
  token: null,
  allowedMenus: {
    main: [],
    sub: []
  }
};

const mutations = {
  setToken: (localState, { accessToken, axios }) => {
    sessionStorage.setItem('api_token', accessToken)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('api_token');

    axios.get('system/menus/root')
      .then( ({data}) => {
        localState.allowedMenus.main = data;
      });
  },
  signout(localState) {
    localState;
    localStorage.removeItem('api_token');
    sessionStorage.removeItem('api_token');
  }
};

export default { namespaced: true, state, mutations };
