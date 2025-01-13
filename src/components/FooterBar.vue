<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <div class="footer">
    <div class="about">
      版权所有 &copy; 2024 - {{year}} STUOJ<br/>
      本项目采用 GPL-3.0 license 进行许可<br/>
      <a href="https://github.com/STUOJ">汕头大学疾风算法协会 STUOJ 开发组</a><br/>
    </div>
  </div>
</template>

<style scoped>
.footer {
  justify-content: center;
  width: 100%;
}

.about {
  font-size: 12px;
  color: #aaa;
  text-align: center;
}
</style>
