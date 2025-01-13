<script setup lang="ts">

</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-col :span="4">
        <strong>统计信息</strong>
      </el-col>
      <el-divider/>
      <EmptyPage></EmptyPage>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>