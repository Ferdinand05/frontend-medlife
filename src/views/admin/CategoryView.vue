<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DashboardAdminLayout from '../layouts/DashboardAdminLayout.vue'
import { getCategories } from '@/services/api/user/category.api'
import type { ICategory } from '@/types/medicine'
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
import { h } from 'vue'
import { SortAsc, SortDesc } from 'lucide-vue-next'

const categories = ref<ICategory[]>([])
function getData() {
  getCategories()
    .then((res) => {
      categories.value = res.data.data
    })
    .catch((res) => {
      console.log(res.response)
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
const table = useVueTable({
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

function handlePageSizeChange(e: Event) {
  const target = e.target as HTMLSelectElement | HTMLInputElement | null
  if (!target) return
  table.setPageSize(Number(target.value))
}

const modalCreate = ref()
const modalEdit = ref()

function handleEdit(id: string) {
  modalEdit.value.showModal()
  console.log(id)
}

function handleDelete(id: string) {
  console.log(id)
}
</script>

<template>
  <DashboardAdminLayout>
    <section class="p-4 space-y-5">
      <div class="">
        <div>
          <h1 class="text-2xl font-semibold">Categories</h1>
          <p class="font-light text-lg">Manage Categories</p>
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
          <button class="btn btn-success btn-md" @click="modalCreate?.showModal()">
            Create new Category
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
</template>
