<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯課程資訊' : '新增課程' }}</h1>

    <form @submit.prevent="submit">
      <label>課程名稱</label>
      <input v-model="form.courseName" required maxlength="100" />

      <label>課程描述</label>
      <input v-model="form.courseDescription" required maxlength="100" />

      <label>學分數</label>
      <input v-model="form.credits" type="number" required min="1" />

      <label>老師</label>
      <!-- 保持用老師ID綁定，下方 submit 再包成物件  [既有設計，保留] -->
      <select v-model="form.teacher" required>
        <option disabled value="">請選擇老師</option>
        <option v-for="t in teachers" :key="t.teacherId" :value="t.teacherId">
          {{ t.name }}（ID: {{ t.teacherId }}）
        </option>
      </select>

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <router-link class="btn" to="/courses">返回</router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCourse, createCourse, updateCourse } from '@/api/courses'
import { fetchTeachers } from '@/api/teachers'

const route = useRoute()
const router = useRouter()

const id = route.params.id
const isEdit = computed(() => !!id)

// 表單狀態：credits 與 teacher 先用字串與 ID，送出時再轉型  [既有+註解]
const form = ref({ courseName: '', courseDescription: '', credits: '', teacher: '' })
const teachers = ref([])
const error = ref('')

onMounted(async () => {
  try {
    // 載入老師清單  [既有]
    const { data } = await fetchTeachers()
    teachers.value = data

    if (isEdit.value) {
      const { data: c } = await getCourse(id)
      // ★ 修改：編輯模式只「還原表單值」，不要在這裡包 teacher 物件或轉數字
      form.value = {
        courseName: c.courseName,
        courseDescription: c.courseDescription,
        credits: String(c.credits),                // ← [修改] 輸入框用字串
        teacher: c.teacher?.teacherId ?? ''        // ← [修改] select 用老師ID
      }
    }
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
})

async function submit() {
  error.value = ''
  try {
    // ★ 新增：送出前組 payload，修正後端期望的型別與結構
    const payload = {
      courseName: form.value.courseName,
      courseDescription: form.value.courseDescription,
      credits: Number(form.value.credits),               // ← [新增] 轉數字
      teacher: { teacherId: Number(form.value.teacher) } // ← [新增] 包成物件
    }

    if (isEdit.value) {
      await updateCourse(id, payload)   // ← [修改] 改傳 payload
    } else {
      await createCourse(payload)       // ← [修改] 改傳 payload
    }
    router.push('/courses')
  } catch (e) {
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
.title { margin-bottom: 12px; }
form { display: flex; flex-direction: column; gap: 10px; }
label { font-weight: 600; }
input { padding: 6px; border: 1px solid #ccc; border-radius: 4px; }
.actions { display: flex; gap: 8px; margin-top: 8px; }
.btn { padding: 6px 10px; border: 1px solid #999; background: #f7f7f7; cursor: pointer; text-decoration: none; color: #333; }
.error { color: #c33; }
</style>


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


