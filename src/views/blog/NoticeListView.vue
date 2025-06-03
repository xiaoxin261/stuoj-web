<script setup lang="ts">
import { ref } from 'vue'
import { BlogStatus } from '@/types/Blog'
import { OrderBy } from '@/types/misc'

const blogParams = ref({
  page: 1,
  size: 20,
  status: BlogStatus.Notice.toString(),
  order_by: OrderBy.create_time,
  order: 'desc'
})
</script>

<template>
  <div class="notice-list-view">
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <h2>公告列表</h2>
        </div>
      </template>

      <BlogsComp 
        :select="false"
        :params="blogParams"
      />
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.notice-list-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
