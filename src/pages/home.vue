<template>
  <f7-page name="home">
    <f7-navbar :large="false" :sliding="false">
      <f7-nav-left> </f7-nav-left>
      <f7-nav-title sliding>SipHelpDesk</f7-nav-title>
      <f7-nav-right> </f7-nav-right>
    </f7-navbar>

    <f7-block>
      <f7-list>
        <f7-list-input
          v-model:value="emailOrDNI"
          outline
          type="text"
          clear-button
          label="Email/DNI"
        ></f7-list-input>
      </f7-list>
      <f7-button round filled @click="search">Buscar</f7-button>
    </f7-block>
    <f7-block>
      <template v-if="usuarios.length > 0">
        <div
          :key="keyUsuarios"
          class="card data-table data-table-collapsible data-table-init"
        >
          <div class="card-header">
            <div class="data-table-title">Usuarios encontrados</div>
          </div>
          <div class="card-content">
            <table>
              <thead>
                <tr>
                  <th class="label-cell">Nombre</th>
                  <th class="label-cell">Email</th>
                  <th class="label-cell">DNI</th>
                  <th class="label-cell">Empresa</th>
                  <th class="label-cell">Estatus</th>
                  <th class="label-cell">Fecha creación</th>
                  <th class="label-cell"></th>
                  <th class="label-cell"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="usuario in usuarios" :key="usuario.id">
                  <td class="label-cell">{{ usuario.nombre }}</td>
                  <td class="label-cell">{{ usuario.email }}</td>
                  <td class="label-cell">{{ usuario.dni }}</td>
                  <td class="label-cell">
                    <f7-list>
                      <f7-list-input
                        v-model:value="usuario.client_id"
                        label=""
                        type="select"
                        placeholder=""
                      >
                        <option
                          v-for="client in clients"
                          :key="client.name"
                          :value="client.id"
                        >
                          {{ client.name }}
                        </option>
                      </f7-list-input>
                    </f7-list>
                  </td>
                  <td class="label-cell">
                    <f7-list>
                      <f7-list-input
                        v-model:value="usuario.status"
                        label=""
                        type="select"
                        placeholder=""
                      >
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                      </f7-list-input>
                    </f7-list>
                  </td>
                  <td class="label-cell">{{ usuario.created }}</td>
                  <td class="label-cell">
                    <f7-button small @click="update(usuario)"
                      >Actualizar datos</f7-button
                    >
                  </td>
                  <td class="label-cell">
                    <f7-button small @click="password(usuario)">
                      Generar password
                    </f7-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template v-else>
        <f7-block strong> No se encontraron usuarios </f7-block>
      </template>
    </f7-block>
  </f7-page>
</template>
<script setup>
import axios from 'axios'
import { f7 } from 'framework7-vue'
import { ref, onMounted } from 'vue'
const usuarios = ref([])
const clients = ref([])
const emailOrDNI = ref('')
const keyUsuarios = ref(f7.utils.id())

const findUser = async (emailOrDni) => {
  try {
    const { data } = await axios.post(
      `https://webhooks.sipcafes.net/helpdesk/users`,
      {
        emailOrDni,
      },
      {
        headers: {
          'api-key': '0baacc2cdfc72fbe6462cc405cf50a8f2fb78',
        },
      }
    )
    usuarios.value = data.usuarios
  } catch (e) {
    console.log('ego ', e)
  }
}

const search = async () => {
  //  `https://webhooks.sipcafes.net/otp/verify`,

  if (!emailOrDNI.value.trim() || emailOrDNI.value.trim().length <= 5) {
    f7.dialog.alert('Ingrese un DNI o Email a buscar', 'Error')
    return
  }

  f7.preloader.show()

  await findUser(emailOrDNI.value.trim())

  f7.preloader.hide()
}

const update = (usuario) => {
  f7.dialog.confirm(
    '¿Confirmas la actualización de los datos del cliente?',
    'Confirmación',
    async () => {
      f7.preloader.show()
      try {
        await axios.post(
          `https://webhooks.sipcafes.net/helpdesk/users/update`,
          {
            usuario: { ...usuario },
          },
          {
            headers: {
              'api-key': '0baacc2cdfc72fbe6462cc405cf50a8f2fb78',
            },
          }
        )
        await findUser(emailOrDNI.value.trim())

        f7.dialog.alert('Datos actualizados correctamente', '')
      } catch (e) {
        console.log('ego ', e)
        f7.dialog.alert('Ocurrió un error, intente de nuevo', 'Error')
      }
      f7.preloader.hide()
    },
    async () => {
      await findUser(emailOrDNI.value.trim())
    }
  )
}

const password = (usuario) => {
  f7.dialog.confirm(
    `¿Confirmas la generación del password 123 para el usuario ${usuario.email}?`,
    'Confirmación',
    async () => {
      f7.preloader.show()
      try {
        await axios.post(
          `https://webhooks.sipcafes.net/helpdesk/users/update/password`,
          {
            usuario: { ...usuario },
          },
          {
            headers: {
              'api-key': '0baacc2cdfc72fbe6462cc405cf50a8f2fb78',
            },
          }
        )
        await findUser(emailOrDNI.value.trim())

        f7.dialog.alert(
          `El password temporal del usuario ${usuario.email} es 123, indicale que use este password y luego desde su perfil lo actualice`,
          ''
        )
      } catch (e) {
        console.log('ego ', e)
        f7.dialog.alert('Ocurrió un error, intente de nuevo', 'Error')
      }
      f7.preloader.hide()
    }
  )
}

onMounted(async () => {
  try {
    const { data } = await axios.post(
      `https://webhooks.sipcafes.net/helpdesk/clients`,
      {},
      {
        headers: {
          'api-key': '0baacc2cdfc72fbe6462cc405cf50a8f2fb78',
        },
      }
    )
    clients.value = data.clients
  } catch (e) {
    console.log('ego ', e)
  }
})
</script>
