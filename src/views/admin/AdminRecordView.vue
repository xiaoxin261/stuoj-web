<script setup lang="ts">
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-col :span="4">
        <strong>记录管理</strong>
      </el-col>
      <el-divider></el-divider>
      <Records :admin="true" />
    </el-main>
  </el-container>
</template>

<style scoped></style>
