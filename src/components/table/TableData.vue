<script lang="ts" setup generic="TData">
import type { Table } from '@tanstack/vue-table'
import { FlexRender } from '@tanstack/vue-table'
import { SortAsc, SortDesc, ArrowUpDown } from 'lucide-vue-next'

const props = defineProps<{
  table: Table<TData>
  pageSizes: number[]
}>()

function handlePageSizeChange(e: Event) {
  const target = e.target as HTMLSelectElement | null
  if (!target) return
  props.table.setPageSize(Number(target.value))
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr v-for="headerGroup in props.table.getHeaderGroups()" :key="headerGroup.id">
          <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan">
            <button
              v-if="header.column.getCanSort()"
              class="flex items-center gap-1 font-semibold"
              @click="header.column.toggleSorting()"
            >
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />

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
        <tr v-for="row in props.table.getRowModel().rows" :key="row.id">
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
          :value="props.table.getState().pagination.pageSize"
          @change="handlePageSizeChange"
        >
          <option :key="pageSize" :value="pageSize" v-for="pageSize in props.pageSizes">
            Show {{ pageSize }}
          </option>
        </select>
      </div>
      <div class="w-sm">
        <div class="join grid grid-cols-2">
          <button
            class="join-item btn btn-outline btn-sm"
            @click="() => props.table.previousPage()"
            :disabled="!props.table.getCanPreviousPage()"
          >
            Previous
          </button>
          <button
            class="join-item btn btn-outline btn-sm"
            @click="() => props.table.nextPage()"
            :disabled="!props.table.getCanNextPage()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
