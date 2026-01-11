<template>
  <div class="container">
    <h1 class="title">學生列表</h1>

    <!-- 第一列：學號搜尋 -->
    <div class="toolbar">
      <label for="searchId" class="label">學號搜尋：</label>
      <input
        id="searchId"
        v-model="searchId"
        placeholder="輸入學號"
        class="input"
        @keyup.enter="searchStudent"
      />
      <button class="btn" @click="searchStudent">搜尋</button>
    </div>

    <!-- ★新增：第二列：名字搜尋 -->
    <div class="toolbar">
      <label for="searchName" class="label">名字搜尋：</label>
      <input
        id="searchName"
        v-model="searchName"
        placeholder="輸入名或姓"
        class="input"
        @keyup.enter="searchByName"
      />
      <button class="btn" @click="searchByName">搜尋</button>
    </div>
    <!-- 第三列：新增學生 -->
    <div class="toolbar">
      <router-link class="btn add-student" to="/students/new">+ 新增學生</router-link>
    </div>

    <!-- 新增：學生統計 -->
    <div class="stats">
      <p class="stats-text">學生列表共有 : {{ filteredStudents.length }} 個學生</p>
    </div>


    <table class="table">
      <thead>
      <tr>
        <th>學號</th>
        <th>名</th>
        <th>姓</th>
        <th>生日</th>
        <th>電子郵件</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="student in filteredStudents" :key="student.studentId">
        <td>{{ student.studentId }}</td>
        <td>{{ student.firstName }}</td>
        <td>{{ student.lastName }}</td>
        <td>{{ student.dateOfBirth }}</td>
        <td>{{ student.email }}</td>
        <td>
          <router-link :to="`/students/${student.studentId}/edit`" class="btn">編輯</router-link>
          <button class="btn danger" @click="remove(student.studentId)">刪除</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchStudents, deleteStudent } from '../api/students.js'

const students = ref([])
const error = ref('')
const searchId = ref('')     // 學號搜尋輸入框
const searchName = ref('')   // ★新增：名字搜尋輸入框

async function load() {
  error.value = ''
  try {
    const { data } = await fetchStudents()
    students.value = data
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

async function remove(id) {
  if (!confirm('Delete this student?')) return
  try {
    await deleteStudent(id)
    await load()
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

// 修改：同時支援學號與名字搜尋
const filteredStudents = computed(() => {
  const idQ = searchId.value.trim()
  const nameQ = searchName.value.trim().toLowerCase()
  return students.value.filter(s => {
    const matchId = idQ ? String(s.studentId).includes(idQ) : true
    const matchName = nameQ
      ? s.firstName.toLowerCase().includes(nameQ) || s.lastName.toLowerCase().includes(nameQ)
      : true
    return matchId && matchName
  })
})

// 搜尋動作（前端篩選即可）
function searchStudent() {
  console.log('搜尋學號:', searchId.value)
}
function searchByName() {
  console.log('搜尋名字:', searchName.value)
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
}

.btn.danger {
  border-color: #c33;
}

.error {
  color: #c33;
}
</style>

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
.btn.add-student {
  background-color: #404040;
  border: none;
  color: white;
}

.btn:not(.danger):not(.add-student) {
  background-color: #bfbfbf;
  border: none;
  color: #333;
}
</style>

