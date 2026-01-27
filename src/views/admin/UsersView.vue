<script setup lang="ts">
import type { IUser } from '@/types/user.type'
import { h, onMounted, reactive, ref } from 'vue'
import DashboardAdminLayout from '../layouts/DashboardAdminLayout.vue'
import { createUser, deleteUser, getAllUsers, updateUser } from '@/services/api/admin/users.api'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
} from '@tanstack/vue-table'
import type { errorFormType } from '@/types'
import AlertComponent from '@/components/AlertComponent.vue'
import Swal from 'sweetalert2'
import HeaderDashboard from '@/components/HeaderDashboard.vue'
import TableData from '@/components/table/TableData.vue'
import ModalDialog from '@/components/ModalDialog.vue'

const users = ref<IUser[]>([])
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

onMounted(() => {
  getUsers()
})

const columnHelper = createColumnHelper<IUser>()
const columns = [
  columnHelper.group({
    header: 'Users',
    columns: [
      columnHelper.accessor((row) => row.username, {
        id: 'username',
        header: () => 'Username',
        cell: (info) => h('div', {}, info.getValue()),
        enableSorting: true,
      }),
      columnHelper.accessor((row) => row.email, {
        id: 'email',
        header: () => 'Email',
        cell: (info) => h('div', { class: '' }, info.getValue()),
        enableSorting: true,
      }),
      columnHelper.accessor((row) => row.telepon, {
        id: 'telepon',
        header: () => 'Telepon',
        cell: (info) => h('div', { class: '' }, info.getValue()),
        enableSorting: true,
      }),
      columnHelper.accessor((row) => row.role, {
        id: 'role',
        header: () => 'Role',
        cell: (info) => h('div', { class: 'badge badge-sm' }, info.getValue()),
        enableSorting: true,
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
          const user = row.original

          return h('div', { class: 'flex gap-2' }, [
            h(
              'button',
              {
                class: 'btn btn-sm btn-warning',
                onClick: () => handleEdit(user._id),
              },
              'Edit',
            ),
            h(
              'button',
              {
                class: 'btn btn-sm btn-error',
                onClick: () => handleDelete(user._id),
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
const table = useVueTable<IUser>({
  get data() {
    return users.value
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
const modalEdit = ref()

const errorForm = ref<errorFormType | null>(null)
const createForm = reactive({
  username: '',
  email: '',
  telepon: '',
  role: 'user',
  password: '',
})

function store() {
  errorForm.value = null

  createUser(createForm)
    .then((res) => {
      console.log(res.data)
      getUsers()
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.success,
      })

      modalCreate.value.close()
      createForm.username = ''
      createForm.email = ''
      createForm.telepon = ''
      createForm.role = 'user'
      createForm.password = ''
    })
    .catch((err) => {
      console.log(err.response)
      errorForm.value = err.response.data.error
    })

  console.log('store', createForm)
}

const editForm = reactive({
  _id: '',
  username: '',
  email: '',
  telepon: '',
  role: 'user',
})
function handleEdit(id: string) {
  modalEdit.value.showModal()

  const user = users.value.find((u) => u._id === id)
  if (user) {
    editForm._id = user._id
    editForm.username = user.username
    editForm.email = user.email
    editForm.telepon = user.telepon ?? ''
    editForm.role = user.role
  }

  console.log(editForm)
}

function update() {
  errorForm.value = null

  updateUser(editForm)
    .then((res) => {
      console.log(res.data)
      getUsers()
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.success,
      })

      modalEdit.value.close()
    })
    .catch((err) => {
      console.log(err.response)
      errorForm.value = err.response.data.error
    })
}

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
      deleteUser(id)
        .then((res) => {
          console.log(res.data)
          getUsers()
          Swal.fire({
            title: 'Deleted!',
            text: `${res.data.success}`,
            icon: 'success',
          })
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  })
}
</script>

<template>
  <DashboardAdminLayout>
    <section class="p-4 space-y-5">
      <!-- header -->
      <HeaderDashboard title="Users" :modal="modalCreate">
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
  <ModalDialog title="User" for="Create" ref="modalCreate">
    <form class="space-y-4 mt-4">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Name</legend>
        <input
          v-model="createForm.username"
          type="text"
          class="input w-full"
          placeholder="Username"
        />
        <AlertComponent v-if="errorForm?.username">
          {{ errorForm.username[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Email</legend>
        <input v-model="createForm.email" type="email" class="input w-full" placeholder="Email" />
        <AlertComponent v-if="errorForm?.email">
          {{ errorForm.email[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Telepon</legend>
        <input
          v-model="createForm.telepon"
          type="text"
          class="input w-full"
          placeholder="Telepon"
        />
        <AlertComponent v-if="errorForm?.telepon">
          {{ errorForm.telepon[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Role</legend>
        <select v-model="createForm.role" class="select w-full">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <AlertComponent v-if="errorForm?.role">
          {{ errorForm.role[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Password</legend>
        <input
          v-model="createForm.password"
          type="password"
          class="input w-full"
          placeholder="Password"
        />
        <AlertComponent v-if="errorForm?.password">
          {{ errorForm.password[0] }}
        </AlertComponent>
      </fieldset>

      <div class="mt-3 text-right">
        <button type="button" @click.prevent="store" class="btn btn-info btn-sm">Create</button>
      </div>
    </form>
  </ModalDialog>

  <!-- modal edit -->
  <ModalDialog title="User" for="Edit" ref="modalEdit">
    <form class="space-y-4 mt-4">
      <!-- form edit user -->
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Name</legend>
        <input
          v-model="editForm.username"
          type="text"
          class="input w-full"
          placeholder="Username"
        />
        <AlertComponent v-if="errorForm?.username">
          {{ errorForm.username[0] }}
        </AlertComponent>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Email</legend>
        <input v-model="editForm.email" type="email" class="input w-full" placeholder="Email" />
        <AlertComponent v-if="errorForm?.email">
          {{ errorForm.email[0] }}
        </AlertComponent>
      </fieldset>
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Telepon</legend>
        <input v-model="editForm.telepon" type="text" class="input w-full" placeholder="Telepon" />
        <AlertComponent v-if="errorForm?.telepon">
          {{ errorForm.telepon[0] }}
        </AlertComponent>
      </fieldset>

      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Role</legend>
        <select v-model="editForm.role" class="select w-full">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <AlertComponent v-if="errorForm?.role">
          {{ errorForm.role[0] }}
        </AlertComponent>
      </fieldset>

      <div class="mt-3 text-right">
        <button type="button" @click.prevent="update" class="btn btn-info btn-sm">Update</button>
      </div>
    </form>
  </ModalDialog>
</template>
