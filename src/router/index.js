import { createRouter, createWebHistory } from 'vue-router'
import StudentList from '@/views/StudentList.vue'
import StudentForm from '@/views/StudentForm.vue'
import TeacherList from '@/views/TeacherList.vue'
import TeacherForm from '@/views/TeacherForm.vue'
import CourseForm from '@/views/CourseForm.vue'
import CourseList from '@/views/CourseList.vue'
import EnrollmentForm from '@/views/EnrollmentForm.vue'
import EnrollmentList from '@/views/EnrollmentList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/students' },
    { path: '/students', name: 'students', component: StudentList },
    { path: '/students/new', name: 'students-new', component: StudentForm },
    { path: '/students/:id/edit', name: 'students-edit', component: StudentForm, props: true },

    { path: '/teachers', name: 'teachers', component: TeacherList },
    { path: '/teachers/new', name: 'teachers-new', component: TeacherForm },
    { path: '/teachers/:id/edit', name: 'teachers-edit', component: TeacherForm, props: true },

    { path: '/courses', name: 'courses', component: CourseList },
    { path: '/courses/new', name: 'courses-new', component: CourseForm },
    { path: '/courses/:id/edit', name: 'courses-edit', component: CourseForm, props: true },

    { path: '/enrollments', name: 'enrollments', component: EnrollmentList },
    { path: '/enrollments/new', name: 'enrollments-new', component: EnrollmentForm },
    //修改路由，使用雙主鍵
    { path: '/enrollments/:studentId-:courseId/edit', name: 'enrollments-edit', component: EnrollmentForm, props: true },
  ],
})

export default router