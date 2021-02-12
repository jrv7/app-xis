<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarColor02">
      <ul class="navbar-nav mr-auto">

        <li
          v-for="menu in getMainMenus" :key="menu.menu_url_hash"
          class="nav-item"
          :class="{
            'active': (activeMainMenu == menu.menu_url_hash)
          }"
        >
          <a class="nav-link" @click.prevent="goToMainMenu(menu.menu_url_hash)">
            {{_XisT(menu.menu_title)}}
            <span v-if="activeMainMenu == menu.menu_url_hash" class="sr-only">(current)</span>
          </a>
        </li>

      </ul>
      <form class="form-inline my-2 my-lg-0">
        <!-- <input class="form-control mr-sm-2" type="text" placeholder="Search">
        <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button> -->
        <button
          class="btn btn-link my-2 my-sm-0"
          type="button"
          @click="signOut"
        >{{_XisT('Log out')}}</button>
      </form>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'XisNavbar',
  data () {
    return {
      mainMenus: [],
      activeMainMenu: null
    }
  },
  computed: {
    ...mapGetters([
      'getSelectedMainMenu'
    ]),
    getMainMenus () {
      return this.mainMenus;
    }
  },
  methods: {
    goToMainMenu (menuId) {
      if (this.activeMainMenu !== menuId) {
        this.$store.commit('setSelectedMainMenu', menuId);
  
        this.activeMainMenu = menuId;
        this.$emit('changed', menuId);
  
        this.$nextTick(() => {
          this.$router.push('/' + menuId);
        })
      }
    },
    fetchMainMenus () {
      this.$axios.get('system/menus/root')
        .then(({data}) => {
          this.mainMenus = data;
          this.$store.commit('storeMainMenus', data);
        })
    },
		signOut() {
			this.$store.commit("login/signout");
			this.$router.replace('/');
		}
  },
  mounted () {
    this.fetchMainMenus();

    if (this.$store.getters.getSelectedMainMenu) {
      this.activeMainMenu = this.$store.getters.getSelectedMainMenu;
    }
  }
}
</script>

<style lang="scss">
  .navbar-light {
    border-bottom: 1px solid #eee;
  }
</style>