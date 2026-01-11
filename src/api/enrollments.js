// ✅ 調整：新增方便的查詢 by student，並把 PUT/DELETE 改成無路徑、用 body 傳
import http from './http'

export function fetchEnrollments() {
  return http.get('/enrollments')
}

// ✅ 新增：依學生查所有選課
export function fetchEnrollmentsByStudent(studentId) {
  return http.get(`/enrollments/Students/${studentId}`)
}

// ✅ 新增：依課程查所有選課（若未來需要）
export function fetchEnrollmentsByCourse(courseId) {
  return http.get(`/enrollments/course/${courseId}`)
}

export function createEnrollment(data) {
  // ✅ 重點：這裡 data 要已轉為 { student:{studentId}, course:{courseId}, ... }
  return http.post('/enrollments', data)
}

export function updateEnrollment({ studentId, courseId, score }) {
  // 路徑帶 studentId, courseId，score 用 params 傳遞
  return http.put(`/enrollments/${studentId}/${courseId}?score=${score}`)
}

export function deleteEnrollment(data) {
  // ✅ 後端 @DeleteMapping 無子路徑，axios 刪除需用 { data } 包起來
  return http.delete('/enrollments', { data })
}
