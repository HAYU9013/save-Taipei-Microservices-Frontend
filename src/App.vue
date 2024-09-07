<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <div id="app">
    <nav>
      <div class="nav-container">
        <div class="burger-menu" @click="toggleMenu">
          &#9776; <!-- 漢堡菜單圖標 -->
        </div>
        <div :class="{ 'nav-links': true, open: isMenuOpen }">
          <router-link to="/" exact @click="toggleMenu">首頁</router-link>
          <router-link to="/activities" @click="toggleMenu">查看活動</router-link>
          <router-link to="/auto-fill-form" @click="toggleMenu">自動填表</router-link>
          <router-link to="/report" @click="toggleMenu">回報問題</router-link>
          <router-link to="/detect" @click="toggleMenu">測試</router-link>
          <router-link to="/data-detect" @click="toggleMenu">資料檢測</router-link>
          <router-link to="/vote" @click="toggleMenu">活動投票</router-link>
          <router-link to="/create-activity" @click="toggleMenu">增加活動與選項</router-link>
        </div>
      </div>
    </nav>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Avenir', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.burger-menu {
  display: none;
  font-size: 24px;
  cursor: pointer;
}

.nav-links {
  display: none;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  transition: display 0.3s ease;
}

.nav-links.open {
  display: flex;
}

.nav-links a {
  text-decoration: none;
  color: #2c3e50;
  margin: 10px 0;
  font-size: 18px;
  font-weight: 600;
  padding: 10px 0;
  transition: color 0.3s ease, border-bottom 0.3s ease;
  border-bottom: 2px solid transparent;
}

.nav-links a:hover {
  color: #0056b3;
  border-bottom: 2px solid #0056b3;
}

.router-link-exact-active {
  color: #0056b3;
  border-bottom: 2px solid #0056b3;
}

.content {
  margin-top: 80px;
  padding: 20px;
}

/* 手機螢幕樣式 */
@media (max-width: 768px) {
  .nav-container {
    justify-content: space-between;
  }
  
  .burger-menu {
    display: block;
  }

  .nav-links {
    display: none;
    flex-direction: column;
  }

  .nav-links.open {
    display: flex;
  }

  .nav-links a {
    margin: 10px 0;
  }
}
</style>
