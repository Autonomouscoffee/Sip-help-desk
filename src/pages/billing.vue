<template>
  <f7-page name="billing" @page:tabshow="load">
    <f7-navbar :large="false" :sliding="false">
      <f7-nav-left> </f7-nav-left>
      <f7-nav-title sliding>SipHelpDesk</f7-nav-title>
      <f7-nav-right> </f7-nav-right>
    </f7-navbar>

    <f7-block>
      <div class="row">
        <div class="col-4">
          <f7-list>
            <f7-list-input
              v-model:value="filters.machine_id"
              label="Punto"
              type="select"
              placeholder=""
              outline
            >
              <option
                v-for="machine in machines"
                :key="machine.name"
                :value="machine.id"
              >
                {{ machine.name }}
              </option>
            </f7-list-input>
          </f7-list>
        </div>
        <div class="col-4">
          <f7-list>
            <f7-list-input
              v-model:value="filters.user_dni"
              outline
              type="text"
              clear-button
              label="DNI"
            ></f7-list-input>
          </f7-list>
        </div>
        <div class="col-4">
          <f7-list class="custom-date-control">
            <f7-list-input outline label="Fecha inicio - Fecha fin">
              <template #content>
                <VueDatePicker
                  v-model="date"
                  centered
                  :teleport="true"
                  :locale="es"
                  range
                  multi-calendars
                  :start-date="filters.creation_date_start"
                  focus-start-date
                  :action-row="{
                    selectBtnLabel: 'Seleccionar',
                    cancelBtnLabel: 'Cancelar',
                    nowBtnLabel: 'Ahora',
                  }"
                />
              </template>
            </f7-list-input>
          </f7-list>
        </div>
      </div>

      <f7-button round filled @click="search">Buscar</f7-button>
    </f7-block>
    <f7-block>
      <template v-if="vendings.length > 0">
        <div
          :key="keyVendings"
          class="card data-table data-table-collapsible data-table-init"
        >
          <div class="card-header">
            <div class="data-table-title">Ventas</div>
          </div>
          <div class="card-content">
            <table class="tabla-vending">
              <thead>
                <tr>
                  <th class="label-cell">Id de venta</th>
                  <th class="label-cell">Fecha de compra</th>
                  <th class="label-cell">Punto</th>
                  <th class="label-cell">Fecha de detección de pago</th>
                  <th class="label-cell">Proveedor de pago</th>
                  <th class="label-cell">Origen</th>
                  <th class="label-cell">Estado</th>
                  <th class="label-cell">Tipo</th>
                  <th class="label-cell">Monto</th>
                  <th class="label-cell">Total de articulos</th>
                  <th class="label-cell">DNI</th>
                  <th class="label-cell">¿Canjeado?</th>
                  <th class="label-cell">Logs</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vending in vendings" :key="vending.billing_id">
                  <td class="label-cell">{{ vending.billing_id }}</td>
                  <td class="label-cell">
                    {{ formatDate(vending.creation_date) }}
                  </td>
                  <td class="label-cell punto-cell">
                    {{ vending.machine_id }}
                  </td>
                  <td class="label-cell">
                    {{
                      vending.payment_date
                        ? formatDate(vending.payment_date)
                        : 'No detectada'
                    }}
                  </td>
                  <td class="label-cell">{{ vending.payment_provider }}</td>
                  <td class="label-cell">{{ vending.source }}</td>
                  <td class="label-cell">
                    <span
                      v-if="vending.state == 'CLOSED'"
                      color="success"
                      class="vending-badge"
                    >
                      VENTA CERRADA
                    </span>
                    <span
                      v-if="vending.state == 'TIMEOUT'"
                      color="warning"
                      class="vending-badge"
                    >
                      TIMEOUT DE PAGO
                    </span>
                    <span
                      v-if="vending.state == 'PENDING'"
                      color="warning"
                      class="vending-badge"
                    >
                      SIN DETECTAR PAGO
                    </span>
                    <span
                      v-if="vending.state == 'ERROR'"
                      color="error"
                      class="vending-badge"
                    >
                      ERROR
                    </span>
                  </td>
                  <td class="label-cell">
                    <span v-if="vending.type == 'cash'"
                      >Cupón de descuento en dinero</span
                    >
                    <span v-if="vending.type == 'free'"
                      >Cupón de compra gratis</span
                    >
                    <span v-if="vending.type == 'normal'">Venta normal</span>
                    <span v-if="vending.type == 'pack'">Venta desde pack</span>
                    <span v-if="vending.type == 'partial discount'"
                      >Venta con descuento parcial</span
                    >
                    <span v-if="vending.type == 'refund'">Devolución</span>
                  </td>
                  <td class="label-cell">{{ vending.total_amount }}</td>
                  <td class="label-cell">{{ vending.total_quantity }}</td>
                  <td class="label-cell">{{ vending.user_dni }}</td>
                  <td class="label-cell">
                    {{
                      vending.source == 'pos'
                        ? 'NO APLICA'
                        : vending.consumed
                        ? 'Sí'
                        : 'No'
                    }}
                  </td>
                  <td class="label-cell">
                    <f7-button
                      small
                      round
                      @click="openLogs(vending.logs, vending.billing_id)"
                    >
                      Ver logs</f7-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
      <template v-else>
        <f7-block strong> No se encontraron ventas</f7-block>
      </template>
    </f7-block>
    <f7-popup v-model:opened="popupOpened" class="popuplog">
      <f7-page>
        <f7-navbar :title="`Logs de la venta ${vendingId}`">
          <f7-nav-right>
            <f7-link popup-close>Cerrar</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block>
          <div v-for="log in vendingLogs" :key="log.id">
            <p>
              {{ formatDate(log.created_log) }}
              - {{ log.message }}
            </p>
          </div>
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>
<script setup>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import axios from 'axios'
import { f7, useStore } from 'framework7-vue'
import { ref, watch } from 'vue'
import { es } from 'date-fns/locale'

dayjs.extend(utc)
dayjs.extend(timezone)

const formatDate = (time) => {
  return dayjs(time).tz('America/Buenos_Aires').format('YYYY-MM-DD HH:mm')
}

const date = ref()
const popupOpened = ref(false)
const vendingLogs = ref([])
const vendingId = ref(null)

const vendings = ref([])
const machines = ref([{ id: '', name: 'Todos los puntos' }])
const keyVendings = ref(f7.utils.id())
const filters = ref({
  machine_id: '',
  user_dni: '',
  creation_date_start: dayjs().format('YYYY-MM-DD 00:00'),
  creation_date_end: dayjs().format('YYYY-MM-DD 23:59'),
})

watch(date, (newDate) => {
  console.log('fecha ', newDate)
  if (newDate) {
    filters.value.creation_date_start = dayjs(newDate[0]).format(
      'YYYY-MM-DD HH:mm'
    )
    filters.value.creation_date_end = dayjs(newDate[1]).format(
      'YYYY-MM-DD HH:mm'
    )
  }
})

const openLogs = (logs, id) => {
  vendingLogs.value = logs
  vendingId.value = id
  popupOpened.value = true
}

const agruparPorBilling = (data) => {
  const agrupado = data.reduce((acc, item) => {
    const billingId = item.billing_id

    const match = item.message.match(
      /^\[SIPPOSFRONT\]\[([^\]]+)\]\[LOG\] \[VENDING\]\[\d+\] (.*)$/
    )

    let version = null
    let mensajeLimpio = item.message

    if (match) {
      version = match[1]
      mensajeLimpio = match[2]
    }

    if (!acc[billingId]) {
      acc[billingId] = {
        billing_id: billingId,
        machine_id:
          machines.value.find((m) => Number(m.id) === Number(item.machine_id))
            ?.name || item.machine_id,
        payment_date: item.payment_date,
        state: item.state,
        total_amount: item.total_amount,
        total_quantity: item.total_quantity,
        creation_date: item.creation_date,
        update_date: item.update_date,
        type: item.type,
        user_email: item.user_email,
        consumed: item.consumed,
        source: item.source,
        user_dni: item.user_dni,
        payment_provider: item.payment_provider,
        version_soft: version,
        logs: [],
      }
    } else if (!acc[billingId].version_soft && version) {
      acc[billingId].version_soft = version
    }

    acc[billingId].logs.push({
      id: item.id,
      message: mensajeLimpio,
      created_log: item.created_log,
    })

    return acc
  }, {})

  const resultado = Object.values(agrupado).sort(
    (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
  )

  resultado.forEach((billing) => {
    billing.logs.sort(
      (a, b) => new Date(a.created_log) - new Date(b.created_log)
    )
  })

  return resultado
}

const token = useStore('token')

const search = async () => {
  if (
    !filters.value.machine_id &&
    !filters.value.user_dni &&
    !filters.value.creation_date_start &&
    !filters.value.creation_date_end
  ) {
    f7.dialog.alert('Ingrese algun filtro para buscar', 'Error')
    return
  }

  f7.preloader.show()

  if (machines.value.length == 0) {
    await loadMachines()
  }

  await loadVendings()

  f7.preloader.hide()
}

const loadVendings = async () => {
  try {
    const { data } = await axios.post(
      `https://webhooks.sipcafes.net/helpdesk/vending`,
      {
        ...filters.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )
    vendings.value = agruparPorBilling(data.vending)

    keyVendings.value = f7.utils.id()
  } catch (e) {
    console.log('ego ', e)
  }
}

const loadMachines = async () => {
  try {
    const { data } = await axios.post(
      `https://webhooks.sipcafes.net/helpdesk/machines`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    )
    machines.value = [...data.machines, { id: '', name: 'Todos los puntos' }]
  } catch (e) {
    console.log('ego ', e)
  }
}

const load = async () => {
  await loadMachines()
}
</script>
<style lang="scss">
.popuplog {
  --f7-navbar-link-color: #fff;
}
.tabla-vending {
  td {
    font-size: 11px;
  }
  .punto-cell {
    padding: 0 !important	;
    .item-input.item-content {
      margin: 0 !important;
      padding: 0 !important;
    }
  }
  .vending-badge {
    &.color-success {
      --f7-badge-bg-color: #4cd964;
    }
    &.color-warning {
      --f7-badge-bg-color: #ffcc00;
    }
    &.color-error {
      --f7-badge-bg-color: #ff3b30;
    }
  }
}
</style>
