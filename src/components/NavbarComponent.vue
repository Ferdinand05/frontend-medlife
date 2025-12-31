<script lang="ts" setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm px-4 mx-auto md:px-6 lg:px-8">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><a>About</a></li>
          <li><a>How it works</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl text-blue-500">MedLife</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><a>About</a></li>
        <li><a>How it works</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <RouterLink to="/login" class="text-sm font-semibold">Login</RouterLink>
    </div>
  </div>
</template>
