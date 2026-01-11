CourseList.vue vs TeacherList.vue
1. 關聯資料顯示
   Teacher (直接顯示):
<td>{{ teacher.name }}</td>
<td>{{ teacher.age }}</td>
<td>{{ teacher.email }}</td>
Course 必須修改:
<td>{{ course.courseName }}</td>
<td>{{ course.courseDescription }}</td>
<td>{{ course.credits }}</td>
<td>{{ course.teacher?.name || '未指定' }}</td> <!-- 關鍵差異 -->
原因: Course 的 teacher 是物件，需要用 ?.name 取得老師姓名，且要處理空值情況

2. API 引入差異
   Teacher:
   import { fetchTeachers, deleteTeacher } from '../api/teachers.js'
   Course:
   import { fetchCourses, deleteCourse } from '../api/courses.js'
   原因: 使用不同的 API 端點


總結差異原因1
Course 比 Teacher 複雜的根本原因:
關聯關係: Course 關聯到 Teacher (外鍵)
資料來源: 需要兩個 API (courses + teachers)
表單複雜度: 下拉選單 vs 純文字輸入
資料結構: 巢狀物件 vs 平面物件
顯示邏輯: 需要從關聯物件中取值
這就是為什麼不能直接複製 Teacher 的程式碼 - 關聯關係改變了整個資料處理流程。

總結差異原因2
List 組件 (CourseList.vue vs TeacherList.vue)
   關聯資料顯示差異：
<!-- Teacher: 直接顯示欄位 -->
<td>{{ teacher.name }}</td>
<td>{{ teacher.age }}</td>
<td>{{ teacher.email }}</td>

<!-- Course: 需要從關聯物件取值 -->
<td>{{ course.courseName }}</td>
<td>{{ course.courseDescription }}</td>
<td>{{ course.credits }}</td>
<td>{{ course.teacher?.name || '未指定' }}</td> <!-- 關鍵差異 -->

總結
答案：是的，差別主要就在 Vue 組件的部分。


API 層：完全可以複製，只需改端點名稱
路由層：完全可以複製，只需改路徑和組件名稱
Vue 組件層：這裡才是真正的差異所在
根本原因：Course 與 Teacher 有關聯關係（外鍵），這個複雜度體現在前端的資料處理邏輯上，而不是在 API 或路由層級。