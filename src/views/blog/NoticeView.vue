<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBlogApi } from '@/apis/blog'
import { formatDate } from '@/utils/date'

const route = useRoute()
const notice = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const { execute } = getBlogApi()
    const res = await execute({ id: Number(route.params.id) })
    if (res.value) {
      notice.value = res.value
    }
  } catch (e) {
    console.error('Failed to load notice:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="notice-view">
    <template v-if="loading">
      <div class="loading">加载中...</div>
    </template>
    <template v-else-if="!notice">
      <div class="empty">公告不存在</div>
    </template>
    <template v-else>
      <h1 class="title">{{ notice.title }}</h1>
      <div class="meta">
        <span class="time">发布时间: {{ formatDate(new Date(notice.create_time)) }}</span>
      </div>
      <div class="content" v-html="notice.content"></div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.notice-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .title {
    font-size: 24px;
    margin-bottom: 16px;
    color: #333;
  }

  .meta {
    margin-bottom: 20px;
    color: #999;
    font-size: 14px;
  }

  .content {
    line-height: 1.6;
  }

  .loading, .empty {
    text-align: center;
    padding: 40px 0;
    color: #666;
  }
}
</style>
