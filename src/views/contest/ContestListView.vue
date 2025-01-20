<script setup lang="ts">
import {ref} from "vue";

const date = ref(new Date());
</script>

<template>
  <div class="container-main">
    <el-card style="margin-bottom: 20px">
      <template #header>
        <div class="card-header">
          <strong>比赛日历</strong>
        </div>
      </template>
      <el-calendar v-model="date" />
    </el-card>
    <el-card style="margin-bottom: 20px">
      <template #header>
        <div class="card-header">
          <strong>比赛列表</strong>
        </div>
      </template>
      <EmptyPage/>
    </el-card>
  </div>
</template>

<style scoped>

</style>