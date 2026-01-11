<template>
  <div class="container">
    <h1 class="title">課程列表</h1>

    <!-- 第一列：課程號碼搜尋 -->
    <div class="toolbar">
      <label for="searchId" class="label">課程號碼搜尋：</label>
      <input
        id="searchId"
        v-model="searchId"
        placeholder="輸入課程號碼"
        class="input"
        @keyup.enter="searchCourse"
      />
      <button class="btn" @click="searchCourse">搜尋</button>
    </div>

    <!-- ★新增：第二列：課程名稱搜尋 -->
    <div class="toolbar">
      <label for="searchName" class="label">課程名稱搜尋：</label>
      <input
        id="searchName"
        v-model="searchName"
        placeholder="輸入課程名稱"
        class="input"
        @keyup.enter="searchByName"
      />
      <button class="btn" @click="searchByName">搜尋</button>
    </div>
    <!-- 第三列：新增課程 -->
    <div class="toolbar">
      <router-link class="btn add-course" to="/courses/new">+ 新增課程</router-link>
    </div>
    <!-- 新增：課程統計 -->
    <div class="stats">
      <p class="stats-text">課程列表共有 : {{ filteredCourses.length }} 門課程</p>
    </div>


    <table class="table">
      <thead>
      <tr>
        <th>課程號碼</th>
        <th>課程名稱</th>
        <th>課程描述</th>
        <th>學分數</th>
        <th>授課老師</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="course in courses" :key="course.courseId">
        <td>{{ course.courseId }}</td>
        <td>{{ course.courseName }}</td>
        <td>{{ course.courseDescription }}</td>
        <td>{{ course.credits }}</td>
        <td>{{ course.teacher?.name || '未指定' }}</td>
        <td>
          <router-link :to="`/courses/${course.courseId}/edit`" class="btn">編輯</router-link>
          <button class="btn danger" @click="remove(course.courseId)">刪除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchCourses, deleteCourse } from '../api/courses.js'

const courses = ref([])
const error = ref('')
const searchId = ref('')
const searchName = ref('')

// 添加計算屬性
const filteredCourses = computed(() => courses.value)

async function load() {
  error.value = ''
  try {
    const { data } = await fetchCourses()
    courses.value = data
    console.log(courses.value[0])
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

async function searchCourse() {
  if (!searchId.value.trim()) {
    await load()
    return
  }

  error.value = ''
  try {
    const { data } = await fetchCourses()
    courses.value = data.filter(course =>
      course.courseId.toString().includes(searchId.value.trim())
    )
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

async function searchByName() {
  if (!searchName.value.trim()) {
    await load()
    return
  }

  error.value = ''
  try {
    const { data } = await fetchCourses()
    courses.value = data.filter(course =>
      course.courseName.includes(searchName.value.trim())
    )
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

async function remove(id) {
  if (!confirm('確定要刪除這個課程嗎？')) return
  try {
    await deleteCourse(id)
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

onMounted(load)


</script>

<style scoped>
.container {
  max-width: 960px;
  margin: 24px auto;
  padding: 0 12px;
}

.title {
  margin-bottom: 12px;
}

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

/* 新增：統計樣式 */
.stats {
  margin-bottom: 12px;
}

.stats-text {
  color: #666;
  font-size: 14px;
  margin: 0;
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

.btn:not(.danger) {
  background-color: #bfbfbf;
  border: none;
  color: #333;
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

.btn.add-course {
  background-color: #333;
  border: none;
  color: white;
}
</style>


