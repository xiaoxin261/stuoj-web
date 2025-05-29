<template>
  <ElContainer class="app-container">
    <el-header class="app-header">
      <HeaderNav />
    </el-header>
    <ElMain class="main-content">
      <RouterView />
    </ElMain>
    <el-divider />
    <el-footer>
      <FooterBar />
    </el-footer>
  </ElContainer>
</template>

<script setup lang="ts">

</script>

<style>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center; /* 垂直居中 */
  overflow: hidden;
  margin: 0; /* 水平居中整个容器 */
  padding: 0;
}

.main-content {
  width: 100%; /* 确保 ElMain 的宽度为 100% */
  display: flex;
  justify-content: center; /* 水平居中 RouterView */
  align-items: center; /* 垂直居中 RouterView */
  margin: 0;
  padding: 0;
}

.app-header {
  width: 70%;
}

@media (max-width: 1200px) {
  .app-header {
    width: 100%;
  }
  .app-container {
    min-width: 1000px;
  }
}

router-view {
  width: 100%; /* 确保 RouterView 的宽度为 100% */
}

</style>