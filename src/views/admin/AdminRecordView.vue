<script setup lang="ts">
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <div class="title">记录管理</div>
      <el-divider></el-divider>
      <Records :admin="true" />
    </el-main>
  </el-container>
</template>

<style scoped></style>
