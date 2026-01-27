<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import DashboardAdminLayout from '../layouts/DashboardAdminLayout.vue'
import { getCategories } from '@/services/api/user/category.api'
import type { ICategory } from '@/types/medicine'
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
} from '@tanstack/vue-table'
import { h } from 'vue'
import { createCategory, deleteCategory, updateCategory } from '@/services/api/admin/category.api'
import Swal from 'sweetalert2'
import AlertComponent from '@/components/AlertComponent.vue'
import HeaderDashboard from '@/components/HeaderDashboard.vue'
import TableData from '@/components/table/TableData.vue'
import ModalDialog from '@/components/ModalDialog.vue'

const categories = ref<ICategory[]>([])
function getData() {
  getCategories()
    .then((res) => {
      categories.value = res.data.data
    })
    .catch((res) => {
      console.log(res.response)
      alert('Failed to fetch categories' + res.response)
    })
}

onMounted(() => {
  getData()
})

const columnHelper = createColumnHelper<ICategory>()
const columns = [
  columnHelper.group({
    header: 'Categories',
    columns: [
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: () => 'Name',
        cell: (info) => h('div', {}, info.getValue()),
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
const table = useVueTable<ICategory>({
  get data() {
    return categories.value
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

const errorCategory = ref<{ [key: string]: string[] } | null>(null)
const categoryForm = reactive({
  _id: '',
  name: '',
})

function handleEdit(id: string) {
  console.log(id)

  const selected = categories.value.find((category) => category._id === id)
  if (selected) {
    categoryForm.name = selected.name
    categoryForm._id = selected._id
  }

  modalEdit.value.showModal()
}

function update() {
  const payload: { _id: string; name: string } = {
    _id: categoryForm?._id || '', // assign the correct id here
    name: categoryForm.name,
  }
  console.log(payload)
  updateCategory(payload)
    .then((res) => {
      Swal.fire({
        title: 'Good job!',
        text: res.data.success,
        icon: 'success',
      })

      getData()
      modalEdit.value.close()
    })
    .catch((res) => {
      console.log(res.response)
      errorCategory.value = res.response.data.error
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
      deleteCategory(id)
        .then((res) => {
          Swal.fire({
            title: 'Deleted!',
            text: res.data.success,
            icon: 'success',
          })

          getData()
        })
        .catch((res) => {
          console.log(res.response)
        })
    }
  })
}

const createForm = reactive({
  name: '',
})
function store() {
  // Implementation for creating a new category
  createCategory(createForm)
    .then((res) => {
      Swal.fire({
        title: 'Success!',
        text: res.data.success,
        icon: 'success',
      })
      getData()
      modalCreate.value.close()
      createForm.name = '' // Reset form
    })
    .catch((res) => {
      console.log(res.response)
      errorCategory.value = res.response.data.error
    })
}
</script>

<template>
  <DashboardAdminLayout>
    <section class="p-4 space-y-5">
      <!-- header -->
      <HeaderDashboard title="Categories" :modal="modalCreate">
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
      <TableData :table="table" :page-sizes="pageSizes" />
    </section>
  </DashboardAdminLayout>

  <!-- modal edit -->
  <ModalDialog ref="modalEdit" for="Edit" title="Category">
    <form @submit.prevent="update" class="space-y-4 mt-4">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Name</legend>
        <input
          v-model="categoryForm.name"
          type="text"
          class="input w-full"
          placeholder="Medicine name"
        />
        <AlertComponent v-if="errorCategory?.name">
          {{ errorCategory.name[0] }}
        </AlertComponent>
      </fieldset>
      <div class="mt-3 text-right">
        <button type="submit" class="btn btn-info btn-sm">Update</button>
      </div>
    </form>
  </ModalDialog>

  <!-- modal create -->
  <ModalDialog ref="modalCreate" for="Create" title="Category">
    <form @submit.prevent="store" class="space-y-4 mt-4">
      <fieldset class="fieldset w-full">
        <legend class="fieldset-legend">Name</legend>
        <input
          v-model="createForm.name"
          type="text"
          class="input w-full"
          placeholder="Category name"
        />
        <AlertComponent v-if="errorCategory?.name">
          {{ errorCategory.name[0] }}
        </AlertComponent>
      </fieldset>
      <div class="mt-3 text-right">
        <button type="submit" class="btn btn-success btn-sm">Create</button>
      </div>
    </form>
  </ModalDialog>
</template>
