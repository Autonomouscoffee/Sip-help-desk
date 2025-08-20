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

      <f7-view
        id="view-home"
        main
        tab
        tab-active
        url="/"
        :load-initial-page="false"
      ></f7-view>

      <f7-view
        id="view-billing"
        :load-initial-page="false"
        name="billing"
        tab
        url="/billing/"
      ></f7-view>
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
          <f7-login-screen-title>
            <img
              src="/icons/512x512.png"
              alt="sip"
              width="100"
              height="100"
              style="margin: 0 auto; text-align: center"
            />
            <br />
            Bienvenido
          </f7-login-screen-title>
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
            <f7-button round filled @click.prevent="login">
              Inicia sesion
            </f7-button>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { f7, f7ready, useStore } from 'framework7-vue'
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

    const isLoggedIn = useStore(store, 'isLoggedIn')

    watch(isLoggedIn, (value, old) => {
      if (!old && value) {
        f7.loginScreen.close()
      }
      if (!value && old) {
        f7.loginScreen.open('#my-login-screen')
      }
    })

    const login = async () => {
      if (!token.value) {
        f7.dialog.alert('Ingrese un token válido')
        return
      }
      try {
        const { data } = await axios.post(
          'https://webhooks.sipcafes.net/otp/verify',
          {
            token: token.value,
          },
          {
            headers: {
              'api-key': '0baacc2cdfc72fbe6462cc405cf50a8f2fb78',
            },
          }
        )
        if (data.token) {
          f7.store.dispatch('login', { isLoggedIn: true, token: data.token })
        } else {
          f7.dialog.alert('Token incorrecto')
        }
      } catch (e) {
        console.log(e)
        f7.dialog.alert('Token incorrecto')
      }
    }

    onMounted(() => {
      f7ready((f7) => {
        window.$f7 = f7
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
