<script setup lang="ts">
import {
  deleteMedicine,
  getAllMedicines,
  storeMedicine,
  updateMedicine,
  type medicinePayload,
} from '@/services/api/admin/medicine.api'
import DashboardAdminLayout from '../layouts/DashboardAdminLayout.vue'
import { h, reactive, ref } from 'vue'
import type { ICategory, IMedicine } from '@/types/medicine'
import { onMounted } from 'vue'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
} from '@tanstack/vue-table'
import type { IUser } from '@/types/user.type'
import type { errorForm } from '@/types'
import SelectCategoryComponent from '@/components/medicine/SelectCategoryComponent.vue'
import { getAllUsers } from '@/services/api/admin/users.api'
import Swal from 'sweetalert2'
import AlertComponent from '@/components/AlertComponent.vue'
import { useAuthStore } from '@/stores/auth'
import TableData from '@/components/table/TableData.vue'
import HeaderDashboard from '@/components/HeaderDashboard.vue'
import ModalDialog from '@/components/ModalDialog.vue'

const medicines = ref<IMedicine[]>([])
function getData() {
  getAllMedicines()
    .then((res) => {
      medicines.value = res.data.data
    })
    .catch((err) => {
      console.log(err.response.data)
    })
}

const users = ref<IUser[]>()
function getUsers() {
  getAllUsers()
    .then((res) => {
      console.log(res.data)
      users.value = res.data.data
    })
    .catch((err) => {
      console.log(err.response)
    })
}

const authStore = useAuthStore()
onMounted(() => {
  getData()
  getUsers()
  authStore.checkToken()
})

const columnHelper = createColumnHelper<IMedicine>()
const columns = [
  columnHelper.group({
    header: 'Medicines',
    columns: [
      // reminder sent
      columnHelper.accessor((row) => (row.user as IUser).username, {
        id: 'user.username',
        header: () => 'Owner',
        cell: (info) => h('div', { class: 'font-medium' }, info.getValue()),
        enableSorting: true,
      }),
      // reminder sent
      columnHelper.accessor((row) => row.reminderSent, {
        id: 'reminderSent',
        header: () => 'Remindered',
        cell: (info) =>
          h(
            'div',
            { class: 'badge badge-sm font-medium' },
            info.getValue().toString().toUpperCase(),
          ),
        enableSorting: true,
      }),

      // ===== NAME =====
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: () => 'Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
      }),

      // ===== QUANTITY =====
      columnHelper.accessor((row) => row.quantity, {
        id: 'quantity',
        header: () => 'Qty',
        cell: (info) => info.getValue(),
        enableSorting: true,
      }),

      // ===== UNIT =====
      columnHelper.accessor((row) => row.unit, {
        id: 'unit',
        header: () => 'Unit',
        cell: (info) => info.getValue(),
        enableSorting: true,
      }),

      // ===== CATEGORY =====
      columnHelper.accessor((row) => (row.category as ICategory)?.name, {
        id: 'category',
        header: () => 'Category',
        cell: (info) => info.getValue(),
      }),

      // ===== EXPIRE DATE =====
      columnHelper.accessor((row) => row.expireDate, {
        id: 'expireDate',
        header: () => 'Expire',
        cell: (info) =>
          info.getValue() ? new Date(info.getValue()).toLocaleDateString('id-ID') : '-',
        enableColumnFilter: true,
      }),

      // ===== CREATED AT =====
      columnHelper.accessor((row) => row.note, {
        id: 'Note',
        header: () => 'Note',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => row.createdAt, {
        id: 'createdAt',
        header: () => 'Created',
        cell: (info) => new Date(info.getValue()).toLocaleDateString('id-ID'),
      }),

      // ===== ACTIONS =====
      columnHelper.display({
        id: 'actions',
        header: () => 'Actions',
        cell: ({ row }) => {
          const medicine = row.original

          return h('div', { class: 'flex gap-2' }, [
            h(
              'button',
              {
                class: 'btn btn-sm btn-warning',
                onClick: () => handleEdit(medicine._id),
              },
              'Edit',
            ),
            h(
              'button',
              {
                class: 'btn btn-sm btn-error',
                onClick: () => handleDelete(medicine._id),
              },
              'Delete',
            ),
          ])
        },
      }),
    ],
  }),
]

const pageSizes = [10, 20, 30, 40, 50]
const globalFilter = ref('')
const sorting = ref<SortingState>([])
const table = useVueTable<IMedicine>({
  get data() {
    return medicines.value
  },
  columns,
  state: {
    get globalFilter() {
      return globalFilter.value
    },
    get sorting() {
      return sorting.value
    },
  },

  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },

  onGlobalFilterChange: (value) => {
    globalFilter.value = value
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

const modalCreate = ref()

function handleDelete(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      deleteMedicine(id)
        .then((res) => {
          Swal.fire({
            title: 'Good job!',
            text: res.data.success,
            icon: 'success',
          })
        })
        .catch((err) => {
          Swal.fire({
            title: 'Error!',
            text: err.response.data,
            icon: 'error',
          })
        })
        .finally(() => {
          getData()
        })
    }
  })
}

const createForm = reactive({
  name: '',
  quantity: null,
  expireDate: '',
  note: '',
  unit: '',
  user: null,
})
const errorCreate = ref<errorForm>()
const selectedCategoryId = ref<string | null>(null)

function store() {
  const payload = {
    name: createForm.name,
    quantity: createForm.quantity,
    expireDate: createForm.expireDate,
    note: createForm.note,
    unit: createForm.unit,
    category: selectedCategoryId.value,
    user: createForm.user,
  }

  storeMedicine(payload)
    .then((res) => {
      console.log(res.data)

      modalCreate.value?.close()
      // swal
      Swal.fire({
        title: 'Good job!',
        text: res.data.success,
        icon: 'success',
      })
    })
    .catch((err) => {
      console.log(err.response)
      errorCreate.value = err.response.data.error
    })
    .finally(() => {
      getData()
    })
}
const errorEdit = ref<errorForm>()
const modalEdit = ref()
function handleEdit(id: string) {
  const selected = medicines.value.find((val) => val._id == id)

  editForm.name = selected?.name ?? ''
  editForm.quantity = selected?.quantity ?? null
  editForm.unit = selected?.unit ?? ''
  editForm.expireDate = selected?.expireDate ?? ''
  editForm._id = selected?._id ?? ''
  editForm.user = (selected?.user as IUser)._id
  editForm.note = selected?.note ?? ''
  selectedCategoryId.value = (selected?.category as ICategory)._id

  errorEdit.value = {}
  modalEdit.value?.showModal()
}

const editForm = reactive<medicinePayload>({
  name: '',
  quantity: null,
  expireDate: '',
  note: '',
  unit: '',
  user: '',
  category: '',
  _id: '',
})

function update() {
  const payload = {
    _id: editForm._id,
    name: editForm.name,
    quantity: editForm.quantity,
    expireDate: editForm.expireDate,
    note: editForm.note,
    unit: editForm.unit,
    category: selectedCategoryId.value,
    user: editForm.user,
  }

  updateMedicine(payload)
    .then((res) => {
      Swal.fire({
        title: 'Good job!',
        text: res.data.success,
        icon: 'success',
      })

      modalEdit.value?.close()
    })
    .catch((err) => {
      console.log(err.response)

      errorEdit.value = err.response.data.error
    })
    .finally(() => {
      getData()
    })
}
</script>

<template>
  <DashboardAdminLayout>
    <section class="p-4 space-y-5">
      <HeaderDashboard title="Medicines" :modal="modalCreate">
        <div class="w-full md:w-auto">
          <label class="input">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" required placeholder="Search" v-model="globalFilter" />
          </label>
        </div>
      </HeaderDashboard>

      <!-- table data -->
      <TableData :table="table" :pageSizes="pageSizes" />
    </section>
  </DashboardAdminLayout>

  <!-- modal create -->
  <ModalDialog for="Create" title="Medicine" ref="modalCreate">
    <form @submit.prevent="store()">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Name</legend>
        <input
          v-model="createForm.name"
          type="text"
          class="input w-full"
          placeholder="Medicine name"
        />
        <AlertComponent v-if="errorCreate?.name">
          {{ errorCreate.name[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Quantity</legend>
        <input type="number" v-model="createForm.quantity" class="input w-full" placeholder="Qty" />
        <AlertComponent v-if="errorCreate?.quantity">
          {{ errorCreate.quantity[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Unit</legend>
        <input type="text" class="input w-full" v-model="createForm.unit" placeholder="Unit" />
        <p class="label">"strip","tablet","bottle","ml"</p>
        <AlertComponent v-if="errorCreate?.unit">
          {{ errorCreate.unit[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Expire Date</legend>
        <input
          type="date"
          class="input w-full"
          placeholder="Expire date"
          v-model="createForm.expireDate"
        />
        <AlertComponent v-if="errorCreate?.expireDate">
          {{ errorCreate.expireDate[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Note</legend>
        <input type="text" class="input w-full" placeholder="Note" v-model="createForm.note" />
        <AlertComponent v-if="errorCreate?.note">
          {{ errorCreate.note[0] }}
        </AlertComponent>
      </fieldset>
      <!-- select category -->
      <SelectCategoryComponent v-model="selectedCategoryId" />
      <AlertComponent v-if="errorCreate?.category">
        {{ errorCreate.category[0] }}
      </AlertComponent>

      <!-- select user -->
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Select User</legend>
        <select class="select w-full" placeholder="Select user" v-model="createForm.user">
          <option v-for="(user, i) in users" :key="i" :value="user._id">
            {{ user.username }}
          </option>
        </select>
        <AlertComponent v-if="errorCreate?.user">
          {{ errorCreate.user[0] }}
        </AlertComponent>
      </fieldset>
      <div class="mt-2 text-right">
        <button type="submit" class="btn btn-success btn-sm">Create</button>
      </div>
    </form>
  </ModalDialog>

  <!-- modal edit -->
  <ModalDialog for="Edit" title="Medicine" ref="modalEdit">
    <form @submit.prevent="update()">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Name</legend>
        <input
          v-model="editForm.name"
          type="text"
          class="input w-full"
          placeholder="Medicine name"
        />
        <AlertComponent v-if="errorEdit?.name">
          {{ errorEdit.name[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Quantity</legend>
        <input type="number" v-model="editForm.quantity" class="input w-full" placeholder="Qty" />
        <AlertComponent v-if="errorEdit?.quantity">
          {{ errorEdit.quantity[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Unit</legend>
        <input type="text" class="input w-full" v-model="editForm.unit" placeholder="Unit" />
        <p class="label">"strip","tablet","bottle","ml"</p>
        <AlertComponent v-if="errorEdit?.unit">
          {{ errorEdit.unit[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Expire Date</legend>
        <input
          type="date"
          class="input w-full"
          placeholder="Expire date"
          v-model="editForm.expireDate"
        />
        <AlertComponent v-if="errorEdit?.expireDate">
          {{ errorEdit.expireDate[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Note</legend>
        <input type="text" class="input w-full" placeholder="Note" v-model="editForm.note" />
        <AlertComponent v-if="errorEdit?.note">
          {{ errorEdit.note[0] }}
        </AlertComponent>
      </fieldset>
      <!-- select category -->
      <SelectCategoryComponent v-model="selectedCategoryId" />
      <AlertComponent v-if="errorEdit?.category">
        {{ errorEdit.category[0] }}
      </AlertComponent>

      <!-- select user -->
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Select User</legend>
        <select class="select w-full" placeholder="Select user" v-model="editForm.user">
          <option v-for="(user, i) in users" :key="i" :value="user._id">
            {{ user.username }}
          </option>
        </select>
        <AlertComponent v-if="errorEdit?.user">
          {{ errorEdit.user[0] }}
        </AlertComponent>
      </fieldset>
      <div class="mt-2 text-right">
        <button type="submit" class="btn btn-info btn-sm">Update</button>
      </div>
    </form>
  </ModalDialog>
</template>
