<template>
  <div id="XisUserDock">
    <div class="user-info">
      <span style="margin-right:12px">
        <a-badge :count="alerts">
          <a-avatar
            shape="square"
            :size="collapsed ? 44 : 64"
            :style="{'color': '#f56a00', 'background-color': '#fde3cf'}"
          >
            M
          </a-avatar>
        </a-badge>
      </span>

      <div
        v-show="!!!collapsed"
        class="user-info user-bio"
      >
        <span class="user-name">{{xisStateUser.name}}</span>
        <span class="user-jobrole">{{xisStateUser.email}}</span>
      </div>
    </div>
    <hr>
    <a-button
      v-if="!!!collapsed"
      type="secondary"
      :style="{'width': '100%'}"
    >
      Account
    </a-button>
    <a-button
      v-else
      icon="user"
      type="secondary"
      :style="{'width': '96%'}"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'XisUserDock',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    alerts: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['xisStateUser']),
  }
}
</script>

<style lang="scss">
#XisUserDock {
  padding: 12px;

  .user-info {
    position: relative;
    display: flex;
    width: 100%;

    .user-bio {
      display: flex;
      flex-flow: wrap;
      font-size: .86rem;

      &>span.user-name {
        width: 100%;
        margin: 0;
        margin-top: auto;
        font-size: .86rem;
        font-weight: 800;
      }

      &>span.user-jobrole {
        width: 100%;
        margin: 0;
        margin-bottom: auto;
        font-size: .78rem;
      }
    }
  }

  .ant-avatar {
    // box-shadow: 0 0 6px #0009;

    .anticon {
      vertical-align: .2rem;
    }
  }

  &>* {
    transition: all .3s ease;
  }
}
</style>