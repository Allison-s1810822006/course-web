<template>
  <div class="container">
    <h1 class="title">{{ isEdit ? '編輯選課資訊' : '新增選課' }}</h1>

    <form @submit.prevent="submit">
      <label>學生</label>
      <select v-model="form.studentId" required :disabled="isEdit">
        <option value="" disabled>請選擇學生</option>
        <option v-for="student in students" :key="student.studentId" :value="student.studentId">
          {{ student.name }} ({{ student.studentId }})
        </option>
      </select>

      <label>課程</label>
      <select v-model="form.courseId" required :disabled="isEdit">
        <option value="" disabled>請選擇課程</option>
        <option v-for="course in courses" :key="course.courseId" :value="course.courseId">
          {{ course.courseName }} (學分: {{ course.credits }})
        </option>
      </select>

      <label>選課日期</label>
      <input v-model="form.enrollmentDate" type="date" required />

      <label>分數</label>
      <input v-model.number="form.grade" type="number" min="0" max="100" />

      <div class="actions">
        <button class="btn" type="submit">{{ isEdit ? '更新' : '建立' }}</button>
        <router-link class="btn" to="/enrollments">返回</router-link>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
// ✅ 修改：替換 API 匯入，移除 getEnrollment，改用 fetchEnrollmentsByStudent，updateEnrollment 不帶路徑
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createEnrollment, updateEnrollment, fetchEnrollmentsByStudent } from '@/api/enrollments' // ✅ 修改
import { fetchStudents } from '@/api/students'
import { fetchCourses } from '@/api/courses'

const route = useRoute()
const router = useRouter()

// 路由格式為 /enrollments/:studentId-:courseId/edit（已於 router 設定）
// 這裡仍能抓到 studentId 與 courseId
const studentId = route.params.studentId
const courseId = route.params.courseId
const isEdit = computed(() => !!(studentId && courseId))

const form = ref({ studentId: '', courseId: '', enrollmentDate: '', grade: 0 })
const students = ref([])
const courses = ref([])
const error = ref('')

onMounted(async () => {
  try {
    console.log('Route params:', { studentId, courseId, isEdit: isEdit.value })

    const [studentsResponse, coursesResponse] = await Promise.all([
      fetchStudents(),
      fetchCourses()
    ])

    students.value = studentsResponse.data
    courses.value = coursesResponse.data

    if (isEdit.value) {
      // ✅ 修改：後端沒有 GET /enrollments/{sid}/{cid}
      // 改用依學生查詢，再用 courseId 篩出單筆
      const { data: list } = await fetchEnrollmentsByStudent(Number(studentId)) // ✅ 修改
      const one = list.find(e => String(e.course.courseId) === String(courseId)) // ✅ 修改
      if (!one) throw new Error('找不到該筆選課紀錄')

      // 對應表單
      form.value = {
        studentId: one.student.studentId,
        courseId: one.course.courseId,
        enrollmentDate: one.enrollmentDate,
        grade: one.grade ?? 0
      }
      console.log('Form after loading:', form.value)
    } else {
      const today = new Date().toISOString().split('T')[0]
      form.value.enrollmentDate = today
    }
  } catch (e) {
    console.error('Error loading data:', e)
    error.value = e?.response?.data?.message || e.message
  }
})

async function submit() {
  error.value = ''
  try {
    // ✅ 修改：後端需要巢狀物件，不接受扁平的 { studentId, courseId, ... }
    const payload = {                                             // ✅ 修改
      student: { studentId: Number(form.value.studentId) },       // ✅ 修改
      course:  { courseId:  Number(form.value.courseId)  },       // ✅ 修改
      enrollmentDate: form.value.enrollmentDate,                  // ✅ 修改
      grade: Number(form.value.grade) || 0                        // ✅ 修改
    }                                                             // ✅ 修改

    if (isEdit.value) {
      // 修正：updateEnrollment 需傳 studentId, courseId, score
      await updateEnrollment({
        studentId: form.value.studentId,
        courseId: form.value.courseId,
        score: form.value.grade
      })
    } else {
      await createEnrollment(payload)
    }
    router.push('/enrollments')
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
