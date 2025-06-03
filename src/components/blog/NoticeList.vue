<script setup lang="ts">
import {ref, onMounted} from "vue";
import {type BlogParams, BlogStatus} from "@/types/Blog";
import {OrderBy} from "@/types/misc";
import { getBlogListApi } from "@/apis/blog";
import { formatDate } from "@/utils/date";
import { useRouter } from 'vue-router';
import { Clock} from '@element-plus/icons-vue';

const blogs = ref<any[]>([]);
const loading = ref(true);
const router = useRouter();

const goToNotice = (id: number) => {
  router.push(`/blog/${id}`);
};


onMounted(async () => {
  try {
    const { execute } = getBlogListApi();
    const res = await execute({ 
      params: {
        page: 1,
        size: 5,
        status: BlogStatus.Notice.toString(),
        order_by: OrderBy.create_time,
        order: 'desc'
      }
    });
    if (res.value?.blogs) {
      blogs.value = res.value.blogs;
    }
  } catch (e) {
    console.error('Failed to load notices:', e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="notice-list">
    <div class="notice-items">
      <div v-for="blog in blogs" :key="blog.id" class="notice-item" @click="goToNotice(blog.id)">
        <span class="notice-title">{{ blog.title }}</span>
        <span class="notice-time">{{ formatDate(new Date(blog.create_time)) }}</span>
      </div>
    </div>
    
    <el-empty v-if="!loading && blogs.length === 0" description="暂无公告"></el-empty>
    <el-skeleton v-if="loading" :rows="3" animated />
  </div>
</template>

<style lang="less" scoped>
.notice-list {
  .notice-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 12px;
    
    .header-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
    
    .header-icon {
      margin-left: auto;
      color: #999;
    }
    
    &:hover {
      background-color: #e9edf2;
    }
  }
  
  .notice-items {
    .notice-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;
      
      &:hover {
        background-color: #f9f9f9;
      }
      
      .notice-title {
        font-size: 14px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
      }
      
      .notice-time {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .el-empty, .el-skeleton {
    padding: 20px;
  }
}
</style>
