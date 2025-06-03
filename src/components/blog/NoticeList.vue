<script setup lang="ts">
import { ref, onMounted } from "vue";
import { type BlogParams, BlogStatus } from "@/types/Blog";
import { OrderBy } from "@/types/misc";
import { getBlogListApi } from "@/apis/blog";
import { formatDate } from "@/utils/date";
import { useRouter } from 'vue-router';

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
        <div class="flex-container"><el-icon :size="12">
            <Timer />
          </el-icon> <span class="notice-time">{{ formatDate(new Date(blog.create_time)) }}</span></div>
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
    padding: 0.75rem 1rem;
    cursor: pointer;
    background-color: #f5f7fa;
    border-radius: 0.25rem;
    margin-bottom: 0.75rem;

    .header-title {
      font-size: 1rem;
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
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-bottom: 1px solid #f0f0f0;

      &:hover {
        background-color: #f9f9f9;
      }

      .notice-title {
        font-size: 0.875rem;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%;
      }

      .flex-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .notice-time {
        font-size: 0.75rem;
        color: #999;
      }
    }
  }

  .el-empty,
  .el-skeleton {
    padding: 1.25rem;
  }
}
</style>
