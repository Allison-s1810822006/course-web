<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <nav>
      <RouterLink to="/students">學生管理</RouterLink>
      <RouterLink to="/teachers">教師管理</RouterLink>
      <RouterLink to="/courses">課程管理</RouterLink>
      <RouterLink to="/enrollments">選課管理</RouterLink>
    </nav>
  </div>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex; /* 新增 */
  justify-content: center; /* 新增 */
  align-items: center; /* 新增 */
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  font-weight: bold; /* 新增粗體 */
  text-decoration: none; /* 移除底線 */
  color: #262626; /* 新增字體顏色 */
  transition: color 0.3s ease; /* 新增過渡動畫 */
}
nav a:active {
  color: #a6a6a6; /* 點擊時的顏色 */
}

nav a:first-of-type {
  border: 0;
}
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  font-weight: bold;
  text-decoration: none;
  color: #595959;
  transition: color 0.3s ease, border-bottom 0.3s ease; /* 新增底線過渡 */
  border-bottom: 2px solid transparent; /* 初始透明底線 */
}

nav a:hover,
nav a:active {
  color: #595959; /* 修正點擊時的顏色 */
  border-bottom: 2px solid #595959; /* 新增底線效果 */
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
