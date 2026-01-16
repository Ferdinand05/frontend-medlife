<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import DashboardUserLayout from '../layouts/DashboardUserLayout.vue'
import { changePassword, me, updateUserInfo } from '@/services/api/user/user.api'
import Swal from 'sweetalert2'
import type { errorFormSetting } from '@/types'
import AlertComponent from '@/components/AlertComponent.vue'

const user = ref<{
  _id: string
  username: string
  email: string
  telepon: string
  role: string
  createdAt: string
}>()

function getUserData() {
  me()
    .then((res) => {
      console.log(res.data)
      user.value = res.data.user
    })
    .catch((err) => {
      console.log(err.response)
    })
}

onMounted(() => {
  getUserData()
})

const userInfo = reactive({
  username: '',
  telepon: '',
})

watch(
  user,
  (val) => {
    if (!val) return

    userInfo.username = val.username
    userInfo.telepon = val.telepon
  },
  { immediate: true },
)

const errorForm = ref<errorFormSetting>()
function update() {
  const payload = {
    username: userInfo.username,
    telepon: userInfo.telepon,
  }

  updateUserInfo(payload)
    .then((res) => {
      Swal.fire({
        title: 'Good Job!',
        text: res.data.success,
        footer: 'Relog to see the changes',
        icon: 'success',
      })
    })
    .catch((err) => {
      console.log(err.response)
      errorForm.value = err.response.data.error
    })
}

const formPassword = reactive({
  oldPassword: '',
  newPassword: '',
})

const errorPassword = ref<errorFormSetting>()
function updatePassword() {
  const payload = {
    oldPassword: formPassword.oldPassword,
    newPassword: formPassword.newPassword,
  }

  changePassword(payload)
    .then((res) => {
      Swal.fire({
        title: 'Good Job!',
        text: res.data.success,
        footer: 'Relog to see the changes',
        icon: 'success',
      })
    })
    .catch((err) => {
      console.log(err.response)
      errorPassword.value = err.response.data.error
    })
}
</script>

<template>
  <DashboardUserLayout>
    <section class="p-4">
      <header>
        <h1 class="text-2xl font-semibold">User Setting</h1>
      </header>
      <main class="mt-16 p-4">
        <!-- user info -->
        <section>
          <div>
            <h2 class="font-semibold text-xl">User Info</h2>
            <p class="font-light">You can update some of your information below.</p>
          </div>
          <div class="mt-3">
            <p class="text-sm my-2 text-gray-700">
              Created at {{ new Date(user?.createdAt as string) }}
            </p>
            <div>
              <input type="text" class="input input-sm w-md" disabled :value="user?.email" />
            </div>
            <form @submit.prevent="update" class="space-y-3 mt-3">
              <div>
                <input type="text" class="input input-sm w-md" v-model="userInfo.username" />
              </div>
              <div>
                <input type="text" class="input input-sm w-md" v-model="userInfo.telepon" />
              </div>
              <div v-if="errorForm">
                <AlertComponent>
                  <ul>
                    <li v-if="errorForm?.username">{{ errorForm.username[0] }}</li>
                    <li v-if="errorForm?.telepon">{{ errorForm.telepon[0] }}</li>
                  </ul>
                </AlertComponent>
              </div>
              <div>
                <button type="submit" class="btn btn-sm btn-secondary">Update</button>
              </div>
            </form>
          </div>
        </section>

        <!-- update password -->
        <section class="mt-16 pt-6 pb-20">
          <div>
            <h2 class="font-semibold text-xl">Change Password</h2>
            <p class="font-light">Update your own password.</p>
          </div>
          <div class="mt-3 space-y-3">
            <form @submit.prevent="updatePassword" class="space-y-3">
              <div>
                <input
                  type="text"
                  class="input input-sm w-md"
                  v-model="formPassword.oldPassword"
                  placeholder="Old Password"
                />
              </div>
              <div>
                <input
                  type="text"
                  class="input input-sm w-md"
                  v-model="formPassword.newPassword"
                  placeholder="New Password"
                />
              </div>
              <div v-if="errorPassword">
                <AlertComponent>
                  <ul>
                    <li v-if="errorPassword?.oldPassword">{{ errorPassword.oldPassword[0] }}</li>
                    <li v-if="errorPassword?.newPassword">
                      {{ errorPassword.newPassword[0] }}
                    </li>
                    <li v-else>{{ errorPassword }}</li>
                  </ul>
                </AlertComponent>
              </div>
              <div>
                <button type="submit" class="btn btn-sm btn-secondary">Change Password</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </section>
  </DashboardUserLayout>
</template>
