<script setup lang="ts">

</script>

<template>
  <div class="container-full">
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>控制面板</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
<!--          <el-button type="primary" @click="handleCreate">创建用户</el-button>-->
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <EmptyPage></EmptyPage>
    </el-main>
  </el-container>
  </div>
</template>

<style scoped>

</style>
