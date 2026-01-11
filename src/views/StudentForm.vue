<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯學生資訊' : '新增學生' }}</h1>
    <form @submit.prevent="submit">
      <label>名字</label>
      <input v-model.trim="form.firstName" required maxlength="100" />

      <label>姓氏</label>
      <input v-model.trim="form.lastName" required maxlength="100" />

      <label>生日</label>
      <input v-model.trim="form.dateOfBirth" type="date" required />

      <label>電子郵件</label>
      <input v-model.trim="form.email" type="email" required maxlength="150" />

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <router-link class="btn" to="/students">返回</router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStudent, createStudent, updateStudent } from '@/api/students'

const route = useRoute()
const router = useRouter()
//傳入的id
const id = route.params.id
const isEdit = computed(() => !!id)
//學生資料
const form = ref({ firstName: '', lastName: '', dateOfBirth: '', email: '' })
//預設錯誤回空字串
const error = ref('')

//如果是編輯的話就撈資料
onMounted(async () => {
  if (isEdit.value) {
    try {
      const { data } = await getStudent(id)
      form.value = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        email: data.email,
      }
    } catch (e) {
      error.value = e?.response?.data?.message || e.message
    }
  }
})

async function submit() {
  //送出前先清空錯誤訊息
  error.value = ''
  try {
    if (isEdit.value) {
      console.log('update', form.value)
      await updateStudent(id, form.value)
    } else {
      await createStudent(form.value)
    }
    router.push('/students')
  } catch (e) {
    // 顯示後端驗證訊息
    if (e?.response?.data?.fields) {
      const msgs = Object.entries(e.response.data.fields).map(([k, v]) => `${k}: ${v}`)
      error.value = msgs.join(' | ')
    } else {
      error.value = e?.response?.data?.message || e.message
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 640px;
  margin: 24px auto;
  padding: 0 12px;
}

.title {
  margin-bottom: 12px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: 600;
}

input {
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  padding: 6px 10px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
}

.error {
  color: #c33;
}
.btn {
  padding: 6px 10px;
  border: none;
  background-color: #bfbfbf;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  border-radius: 6px;
}
</style>
