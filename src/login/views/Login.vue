<template>
  <div id="XisLogin">
    <div class="middle-block">
      <div class="login-type-selector">
      </div>
      <div class="register-block"></div>
      <div class="login-block">
        <div class="login-form">
          <login-form
            @submit="submitLogin"
          ></login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/login/components/form.vue'
export default {
  name: 'Login',
  components: {
    LoginForm
  },
	data () {
		return {
			loading: false,
			displayError: false,
			displayBlock: false,
      showModal: false,
      showForgot: false
		}
	},
	methods: {
    submitLogin (data) {
      console.log('Dados de login');
      console.log(data);
      this.$axios.post('login', {
        email: data.email,
        password: data.password
      })
        .then(({data}) => {
          this.$axios.get('user/logged', {
							headers: {
								Authorization: 'Bearer ' + data.accessToken
							}
						})
							.then(res => {
								const loggedData = res.data;

                this.$store.commit('login/setToken', { accessToken: data.accessToken, axios: this.$axios });
                this.$router.push('Dashboard');
							})

						this.loading = false;
        });
    },
		reset() {
			this.form.password = "";
			this.showModal = false;
			this.showForgot = false;
		}
	}
}
</script>

<style lang="scss">
body {
  position: relative;
  background-color: #fafafa;

  #XisLogin {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #44444f;

    .middle-block {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      width: 70%;
      min-width: 600px;
      height: 70%;
      min-height: 400px;
      background-color: #ddd;
      border-radius: 0 24px 0 24px;
      box-shadow: 0 3px 8px #0008;
      overflow: hidden;

      .register-block {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: calc(50% + 1px);
        background-color: inherit;
        box-shadow: 0 0 14px #0001;
        border-right: 1px solid #ccc;
        z-index: 10;
      }

      .login-block {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: calc(50% + 1px);
        background-color: #fefefe;
        // box-shadow: 0 0 14px #0001;
        // border-left: 1px solid #ccc;
        z-index: 11;

        .login-form {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;

        }
      }

      .login-type-selector {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: calc(50% - 4px);
        background-color: rgb(77, 160, 243);
        box-shadow: 0 0 34px rgb(77, 160, 243);
        z-index: 12;
      }
    }
  }
}
</style>