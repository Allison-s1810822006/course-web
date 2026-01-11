<template>
  <div class="container">
    <h1 class="title">選課列表</h1>

    <!-- 第一列：學生學號搜尋 -->
    <div class="toolbar">
      <label for="searchStudentId" class="label">學生學號搜尋：</label>
      <input
        id="searchStudentId"
        v-model="searchStudentId"
        placeholder="輸入號碼"
        class="input"
        @keyup.enter="searchStudent"
      />
      <button class="btn" @click="searchStudent">搜尋</button>
    </div>

    <!-- ★新增：第二列：課程號碼搜尋 -->
    <div class="toolbar">
      <label for="searchCourseId" class="label">課程號碼搜尋：</label>
      <input
        id="searchCourseId"
        v-model="searchCourseId"
        placeholder="輸入號碼"
        class="input"
        @keyup.enter="searchCourse"
      />
      <button class="btn" @click="searchCourse">搜尋</button>
    </div>
    <!-- 第三列：新增選課課程 -->
    <div class="toolbar">
      <router-link class="btn add-enrollment" to="/enrollments/new">+ 新增選課</router-link>
    </div>
    <!-- 新增：選課課程統計 -->
    <div class="stats">
      <p class="stats-text">選課列表共有 : {{ filteredEnrollments.length }} 門選課</p>
    </div>

    <table class="table">
      <thead>
      <tr>
        <th>學生學號</th>
        <th>課程號碼</th>
        <th>選課日期</th>
        <th>分數</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="enrollment in enrollments" :key="`${enrollment.student.studentId}-${enrollment.course.courseId}`">
        <td>{{ enrollment.student.studentId }}</td>
        <td>{{ enrollment.course.courseId }}</td>
        <td>{{ enrollment.enrollmentDate }}</td>
        <td>{{ enrollment.grade }}</td>

        <td>
          <router-link
            :to="`/enrollments/${enrollment.student.studentId}-${enrollment.course.courseId}/edit`"
            class="btn"
          >
            編輯
          </router-link>
          <button
            class="btn danger"
            @click="remove(enrollment.student.studentId, enrollment.course.courseId)"
          >
            刪除
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchEnrollments, deleteEnrollment } from '@/api/enrollments'

const enrollments = ref([])
const error = ref('')
const searchStudentId = ref('')
const searchCourseId = ref('')

const filteredEnrollments = computed(() => {
  let filtered = enrollments.value

  if (searchStudentId.value.trim()) {
    filtered = filtered.filter(enrollment =>
      enrollment.student.studentId.toString().includes(searchStudentId.value.trim())
    )
  }

  if (searchCourseId.value.trim()) {
    filtered = filtered.filter(enrollment =>
      enrollment.course.courseId.toString().includes(searchCourseId.value.trim())
    )
  }

  return filtered
})

async function load() {
  error.value = ''
  try {
    const { data } = await fetchEnrollments()
    enrollments.value = data
    console.log(enrollments.value)
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

function clearSearch() {
  searchStudentId.value = ''
  searchCourseId.value = ''
}

async function remove(studentId, courseId) {
  if (!confirm('確定要刪除這筆選課記錄嗎？')) return
  try {
    await deleteEnrollment({
      student: { studentId: Number(studentId) },
      course: { courseId: Number(courseId) }
    })
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

onMounted(load)
</script>

<style scoped>
/* 標籤與輸入框間距 */
.label {
  margin-right: 6px;
}

.input {
  padding: 6px 10px;
  margin-right: 6px;
  border: 1px solid #999;
  border-radius: 4px; /* 新增圓角 */
}

/* 統計樣式 */
.stats {
  margin-bottom: 12px;
}

.stats-text {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.container {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 12px;
}

.title {
  margin-bottom: 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.btn {
  padding: 6px 10px;
  margin-right: 6px;
  border: 1px solid #999;
  background: #f7f7f7;
  cursor: pointer;
  text-decoration: none;
  color: #333;
  border-radius: 6px; /* 新增圓角 */
}

.btn.danger {
  background-color: #c94f4f;
  border: none;
  color: white;
}

.error {
  color: #c33;
}

/* 新增表格標題樣式 */
.table thead th {
  background-color: #e8e8e8;
}

/* 新增斑馬紋樣式 */
.table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.table tbody tr:hover {
  background-color: #f0f0f0;
}

.btn:not(.danger) {
  background-color: #bfbfbf;
  border: none;
  color: #333;
}

.btn.add-enrollment {
  background-color: #333;
  border: none;
  color: white;
}
</style>


