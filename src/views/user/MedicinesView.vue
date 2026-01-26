<script lang="ts" setup>
import { h, onMounted, reactive, ref } from 'vue'
import DashboardUserLayout from '../layouts/DashboardUserLayout.vue'
import {
  createMedicine,
  deleteMedicine,
  getMedicines,
  updateMedicine,
} from '@/services/api/user/medicine.api'
import type { ICategory, IMedicine } from '@/types/medicine'
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  createColumnHelper,
  type SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/vue-table'
import { ArrowUpDown, SortAsc, SortDesc } from 'lucide-vue-next'
import Swal from 'sweetalert2'
import SelectCategoryComponent from '@/components/medicine/SelectCategoryComponent.vue'
import AlertComponent from '@/components/AlertComponent.vue'
import type { errorForm } from '@/types'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()

const medicines = ref<IMedicine[]>([])
function getData() {
  getMedicines()
    .then((res) => {
      console.log(res.data)
      medicines.value = res.data.data
    })
    .catch((err) => {
      console.log(err.response)
    })
}

onMounted(() => {
  // get medicines user
  getData()

  // check token
  authStore.checkToken()
})

const columnHelper = createColumnHelper<IMedicine>()
const columns = [
  columnHelper.group({
    header: 'Medicines',
    columns: [
      // reminder sent
      columnHelper.accessor((row) => row.reminderSent, {
        id: 'reminderSent',
        header: () => 'Remindered',
        cell: (info) =>
          h('div', { class: 'badge badge-sm' }, info.getValue().toString().toUpperCase()),
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
})

// delete data with confirmation Swal
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
          console.log(res.data)
          Swal.fire({
            title: 'Deleted!',
            text: `${res.data.success}`,
            icon: 'success',
          })
        })
        .catch((err) => {
          console.log(err.response)
        })
        .finally(() => {
          getData()
        })
    }
  })
}
const modalCreate = ref<HTMLDialogElement | null>(null)
const modalEdit = ref<HTMLDialogElement | null>(null)
const selectedCategoryId = ref<string | null>(null)
const editError = ref<errorForm>()
const editForm = ref({
  _id: '',
  name: '',
  quantity: 0,
  unit: '',
  expireDate: '',
  category: null as string | null,
  note: '' as string | undefined,
})

// show data and modal
function handleEdit(id: string) {
  const medicine = medicines.value.find((val) => val._id == id)
  console.log(medicine)
  editError.value = {}
  if (!medicine) return

  editForm.value = {
    _id: medicine._id,
    name: medicine.name,
    quantity: medicine.quantity,
    unit: medicine.unit,
    note: medicine.note,
    expireDate: medicine.expireDate
      ? medicine.expireDate.slice(0, 10) // untuk input date
      : '',
    category: (medicine.category as ICategory)._id || null,
  }

  selectedCategoryId.value = editForm.value.category

  modalEdit.value?.showModal()
}

// update medicine
function update() {
  const payload = {
    _id: editForm.value._id,
    name: editForm.value.name,
    quantity: editForm.value.quantity,
    unit: editForm.value.unit,
    note: editForm.value.note,
    category: editForm.value.category,
    expireDate: editForm.value.expireDate ? new Date(editForm.value.expireDate) : null,
  }

  updateMedicine(payload)
    .then((res) => {
      console.log(res.data)
      modalEdit.value?.close()

      getData()
    })
    .catch((err) => {
      console.log(err)

      editError.value = err.response.data.error
    })
}

const createForm = reactive({
  name: '',
  unit: '',
  quantity: null,
  expireDate: '',
  note: '',
  category: '',
})

// create/store data medicine
const errorCreate = ref<errorForm>({})
function store() {
  errorCreate.value = {}
  const payload = {
    name: createForm.name,
    unit: createForm.unit,
    quantity: createForm.quantity,
    expireDate: createForm.expireDate,
    note: createForm.note,
    category: selectedCategoryId.value as string,
  }

  createMedicine(payload)
    .then((res) => {
      Swal.fire({
        title: 'Good job!',
        text: res.data.success,
        icon: 'success',
      })

      modalCreate.value?.close()
    })
    .catch((err) => {
      console.log(err.response)
      errorCreate.value = err.response.data.error
    })
    .finally(() => {
      getData()

      createForm.category = ''
      createForm.name = ''
      createForm.quantity = null
      createForm.note = ''
      createForm.expireDate = ''
    })
}
</script>

<template>
  <DashboardUserLayout>
    <section class="p-4 space-y-5">
      <div class="">
        <div>
          <h1 class="text-2xl font-semibold">Medicines User</h1>
          <p class="font-light text-lg">Manage your own medicines safely</p>
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
        <button @click="modalCreate?.showModal()" class="btn btn-success btn-sm w-full md:w-auto">
          Add new Medicine
        </button>
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
      </div>
    </section>

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
              type="text"
              class="input w-full"
              placeholder="Medicine name"
              v-model="editForm.name"
            />
            <AlertComponent v-if="editError?.name">{{ editError?.name[0] }}</AlertComponent>
          </fieldset>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">Quantity</legend>
            <input
              type="number"
              class="input w-full"
              placeholder="Qty"
              v-model="editForm.quantity"
            />
            <AlertComponent v-if="editError?.quantity">{{ editError?.quantity[0] }}</AlertComponent>
          </fieldset>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">Unit</legend>
            <input type="string" class="input w-full" placeholder="Unit" v-model="editForm.unit" />
            <p class="label">"strip","tablet","bottle","ml"</p>
            <AlertComponent v-if="editError?.unit">{{ editError?.unit[0] }}</AlertComponent>
          </fieldset>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">Expire Date</legend>
            <input
              type="date"
              class="input w-full"
              placeholder="Expire date"
              v-model="editForm.expireDate"
            />
            <AlertComponent v-if="editError?.expireDate">{{
              editError?.expireDate[0]
            }}</AlertComponent>
          </fieldset>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend">Note</legend>
            <input type="text" class="input w-full" placeholder="Note" v-model="editForm.note" />
            <AlertComponent v-if="editError?.note">{{ editError?.note[0] }}</AlertComponent>
          </fieldset>

          <!-- select category -->
          <SelectCategoryComponent v-model="selectedCategoryId" />
          <AlertComponent v-if="editError?.category">{{ editError?.category[0] }}</AlertComponent>

          <div class="mt-2 text-right">
            <button type="submit" class="btn btn-success btn-sm">Submit</button>
          </div>
        </form>
      </div>
    </dialog>

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
          <div class="mt-2 text-right">
            <button type="submit" class="btn btn-success btn-sm">Create</button>
          </div>
        </form>
      </div>
    </dialog>
  </DashboardUserLayout>
</template>
