
//筆記
CourseForm.vue vs TeacherForm.vue
1. 表單欄位差異
   Teacher (簡單欄位):
   const form = ref({ name: '', age: '', email: '' })
   Course (複雜欄位):
   const form = ref({ courseName: '', courseDescription: '', credits: '', teacher: '' })
   原因: Course 有不同的業務邏輯欄位，且 teacher 是外鍵關聯

2. 新增老師清單狀態
   Teacher 不需要:
   // 沒有額外的資料來源
   Course 必須新增:
   const teachers = ref([]) // 儲存所有老師供選擇
   原因: Course 需要關聯到 Teacher，必須提供選項讓使用者選擇

3. 載入額外資料
   Teacher 的 onMounted:
   onMounted(async () => {
   if (isEdit.value) {
   // 只載入自己的資料
   const { data } = await getTeacher(id)
   form.value = { name: data.name, age: data.age, email: data.email }
   }
   })
   Course 的 onMounted 必須增加:
   onMounted(async () => {
   try {
   // 1. 永遠都要載入老師清單 (新增時也需要)
   const { data } = await fetchTeachers()
   teachers.value = data

// 2. 編輯時載入課程資料
if (isEdit.value) {
const { data: courseData } = await getCourse(id)
form.value = {
courseName: courseData.courseName,
courseDescription: courseData.courseDescription,
credits: courseData.credits,
teacher: courseData.teacher.teacherId // 取出關聯的 teacherId
}
}
} catch (e) {
error.value = e?.response?.data?.message || e.message
}
})
原因:

無論新增或編輯都需要老師清單
編輯時需要從 courseData.teacher.teacherId 取出關聯 ID
4. 表單 HTML 結構差異
   Teacher (純文字輸入):
   <input v-model="form.name" required />
   <input v-model="form.age" required />
   <input v-model="form.email" type="email" required />
   Course 必須新增:
   <input v-model="form.courseName" required />
   <input v-model="form.courseDescription" required />
   <input v-model="form.credits" type="number" required min="1" />

<!-- 新增下拉選單 -->
<select v-model="form.teacher" required>
<option value="" disabled>請選擇老師</option>
<option v-for="t in teachers" :key="t.teacherId" :value="t.teacherId">
  {{ t.name }}
</option>
</select>
原因: Course 需要下拉選單讓使用者選擇老師，且學分數要用數字輸入

5. API 引入差異
   Teacher:
   import { getTeacher, createTeacher, updateTeacher } from '@/api/teachers'
   Course 必須新增:
   import { getCourse, createCourse, updateCourse } from '@/api/courses'
   import { fetchTeachers } from '@/api/teachers' // 額外引入
   原因: Course 需要額外引入 fetchTeachers 來取得老師清單

總結差異原因:
1. Form 組件 (CourseForm.vue vs TeacherForm.vue)
   需要增加的部分：
   // 1. 額外的狀態管理
   const teachers = ref([]) // Teacher 不需要這個

// 2. 額外的 API 引入
import { fetchTeachers } from '@/api/teachers' // Teacher 不需要這個

// 3. 載入額外資料
onMounted(async () => {
// Teacher 只載入自己的資料
// Course 需要額外載入老師清單
const { data } = await fetchTeachers()
teachers.value = data
})

// 4. 編輯時的資料處理
// Teacher: 直接賦值
form.value = { name: data.name, age: data.age, email: data.email }

// Course: 需要從關聯物件取出 ID
form.value = {
courseName: courseData.courseName,
courseDescription: courseData.courseDescription,
credits: courseData.credits,
teacher: courseData.teacher.teacherId // 關鍵差異
}