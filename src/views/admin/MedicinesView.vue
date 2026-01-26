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
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
} from '@tanstack/vue-table'
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-vue-next'
import type { IUser } from '@/types/user.type'
import type { errorForm } from '@/types'
import SelectCategoryComponent from '@/components/medicine/SelectCategoryComponent.vue'
import { getAllUsers } from '@/services/api/admin/users.api'
import Swal from 'sweetalert2'
import AlertComponent from '@/components/AlertComponent.vue'
import { useAuthStore } from '@/stores/auth'

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
        cell: (info) => info.getValue() ?? '-',
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
const table = useVueTable({
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

function handlePageSizeChange(e: Event) {
  const target = e.target as HTMLSelectElement | HTMLInputElement | null
  if (!target) return
  table.setPageSize(Number(target.value))
}

const modalCreate = ref()
function handleCreate() {
  errorCreate.value = {}
  modalCreate.value?.showModal()
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
      <div class="">
        <div>
          <h1 class="text-2xl font-semibold">Medicines</h1>
          <p class="font-light text-lg">Manage medicines safely</p>
        </div>
      </div>

      <div class="flex md:justify-between gap-3 items-center w-full flex-col md:flex-row">
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
        <div>
          <button class="btn btn-success btn-md" @click="handleCreate()">
            Create new Medicine
          </button>
        </div>
      </div>

      <!-- table data -->
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
                <button
                  v-if="header.column.getCanSort()"
                  class="flex items-center gap-1 font-semibold"
                  @click="header.column.toggleSorting()"
                >
                  <FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />

                  <!-- SORT ICON -->
                  <span class="text-sm">
                    <template v-if="header.column.getIsSorted() === 'asc'"
                      ><SortAsc :size="15" class="cursor-pointer"
                    /></template>
                    <template v-else-if="header.column.getIsSorted() === 'desc'">
                      <SortDesc :size="15" class="cursor-pointer" />
                    </template>
                    <template v-else> <ArrowUpDown :size="15" class="cursor-pointer" /> </template>
                  </span>
                </button>

                <!-- HEADER TANPA SORT -->
                <FlexRender
                  v-else
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in table.getRowModel().rows" :key="row.id">
              <td v-for="cell in row.getVisibleCells()" :key="cell.id">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-center p-3">
          <div class="w-full">
            <select
              class="input select select-xs w-28"
              :value="table.getState().pagination.pageSize"
              @change="handlePageSizeChange"
            >
              <option :key="pageSize" :value="pageSize" v-for="pageSize in pageSizes">
                Show {{ pageSize }}
              </option>
            </select>
          </div>
          <div class="w-sm">
            <div class="join grid grid-cols-2">
              <button
                class="join-item btn btn-outline btn-sm"
                @click="() => table.previousPage()"
                :disabled="!table.getCanPreviousPage()"
              >
                Previous
              </button>
              <button
                class="join-item btn btn-outline btn-sm"
                @click="() => table.nextPage()"
                :disabled="!table.getCanNextPage()"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </DashboardAdminLayout>

  <!-- modal create -->
  <dialog ref="modalCreate" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold">Create new</h3>
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
          <input
            type="number"
            v-model="createForm.quantity"
            class="input w-full"
            placeholder="Qty"
          />
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
    </div>
  </dialog>

  <!-- modal edit -->
  <dialog ref="modalEdit" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <h3 class="text-lg font-bold">Edit</h3>
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
    </div>
  </dialog>
</template>
