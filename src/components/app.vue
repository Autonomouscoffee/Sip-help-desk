<template>
  <f7-app v-bind="f7params">
    <f7-views tabs class="safe-areas">
      <f7-toolbar tabbar icons bottom>
        <f7-link
          tab-link="#view-home"
          tab-link-active
          icon-md="material:person"
          text="Usuarios"
        ></f7-link>
        <f7-link
          tab-link="#view-billing"
          icon-md="material:point_of_sale"
          text="Ventas"
        ></f7-link>
      </f7-toolbar>

      <f7-view id="view-home" main tab tab-active url="/"></f7-view>

      <f7-view id="view-billing" name="billing" tab url="/billing/"></f7-view>
      <!--
      <f7-view
        id="view-settings"
        name="settings"
        tab
        url="/settings/"
      ></f7-view> -->
    </f7-views>

    <f7-login-screen id="my-login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>Login</f7-login-screen-title>
          <f7-list>
            <f7-list-input
              v-model:value="token"
              type="text"
              name="token"
              placeholder="Ingresa código de autenticación"
              label="Ingresa código de autenticación"
              outline
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button
              title="Inicia sesion"
              @click.prevent="login"
            ></f7-list-button>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script>
import { ref, onMounted, computed } from 'vue'
import { f7, f7ready } from 'framework7-vue'
import routes from '@/js/routes.js'
import store from '@/js/store'

export default {
  setup() {
    const f7params = {
      name: 'SipHelpDesk',
      theme: 'md',
      colors: {
        primary: '#191919',
      },

      navbar: {
        mdCenterTitle: true,
      },
      dialog: {
        title: 'Alerta',
        buttonOk: 'Aceptar',
        buttonCancel: 'Cancelar',
        destroyOnClose: true,
      },
      touch: {
        disableContextMenu: true,
      },
      store,
      routes,
    }

    const token = ref('')
    const isLoggedIn = computed(() => f7.store.getters.isLoggedIn)

    const login = () => {
      f7.store.dispatch('login', { isLoggedIn: true })
    }

    onMounted(() => {
      f7ready((f7) => {
        window.$f7 = f7
        console.log(isLoggedIn.value)
        if (!isLoggedIn.value) {
          f7.loginScreen.open('#my-login-screen')
        }
      })
    })

    return {
      f7params,
      token,
      login,
    }
  },
}
</script>
