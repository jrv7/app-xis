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
  },
  signout(localState) {
    localState;
    localStorage.removeItem('api_token');
    localStorage.removeItem('xis-dictionary');
    sessionStorage.removeItem('api_token');
    sessionStorage.removeItem('xis-dictionary');
  }
};

export default { namespaced: true, state, mutations };
