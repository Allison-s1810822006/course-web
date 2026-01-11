<template>
  <div class="container">
    <h1 class="title">老師列表</h1>

    <!-- 第一列：老師號碼搜尋 -->
    <div class="toolbar">
      <label for="searchId" class="label"> 老師號碼搜尋：</label>
      <input
        id="searchId"
        v-model="searchId"
        placeholder="輸入號碼"
        class="input"
        @keyup.enter="searchTeacher"
      />
      <button class="btn" @click="searchTeacher"> 搜尋 </button>
    </div>

    <!-- ★新增：第二列：名字搜尋 -->
    <div class="toolbar">
      <label for="searchName" class="label">老師名字搜尋：</label>
      <input
        id="searchName"
        v-model="searchName"
        placeholder="輸入姓名"
        class="input"
        @keyup.enter="searchByName"
      />
      <button class="btn" @click="searchByName">搜尋</button>
    </div>
    <!-- 第三列：新增教師 -->
    <div class="toolbar">
      <router-link class="btn add-teacher" to="/teachers/new">+ 新增老師</router-link>
    </div>

    <!-- 新增：老師統計 -->
    <div class="stats">
      <p class="stats-text">老師列表共有 : {{ filteredTeachers.length }} 個老師</p>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>老師號碼</th>
          <th>姓名</th>
          <th>年紀</th>
          <th>電子郵件</th>
          <th>操作</th> <!-- 新增這一行 -->
        </tr>
      </thead>
      <tbody>
        <!-- 每撈一筆teacherList裡面的資料就建立一個 -->
        <tr v-for="teacher in filteredTeachers" :key="teacher.teacherId">
          <td>{{ teacher.teacherId }}</td>
          <td>{{ teacher.name }}</td>
          <td>{{ teacher.age }}</td>
          <td>{{ teacher.email }}</td>
          <td>
            <router-link :to="`/teachers/${teacher.teacherId}/edit`" class="btn">編輯</router-link>
            <button class="btn danger" @click="remove(teacher.teacherId)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchTeachers, deleteTeacher } from '../api/teachers.js'

const teachers = ref([])
const error = ref('')
const searchId = ref('')
const searchName = ref('')

// 新增計算屬性來處理過濾邏輯
const filteredTeachers = computed(() => {
  let result = teachers.value

  if (searchId.value.trim()) {
    result = result.filter(teacher =>
      teacher.teacherId.toString().includes(searchId.value.trim())
    )
  }

  if (searchName.value.trim()) {
    result = result.filter(teacher =>
      teacher.name.includes(searchName.value.trim())
    )
  }

  return result
})

async function load() {
  error.value = ''
  try {
    const { data } = await fetchTeachers()
    teachers.value = data
  } catch (e) {
    error.value = e?.response?.data?.message || e.message
  }
}

// 簡化搜尋函數
function searchTeacher() {
  // 計算屬性會自動處理過濾
}

function searchByName() {
  // 計算屬性會自動處理過濾
}

async function remove(id) {
  if (!confirm('Delete this teacher?')) return
  try {
    await deleteTeacher(id)
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
.btn.add-teacher {
  background-color: #333;
  border: none;
  color: white;
}


</style>
