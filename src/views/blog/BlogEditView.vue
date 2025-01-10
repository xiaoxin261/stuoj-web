<script setup lang="ts">
import { getBlogListApi, createBlogApi } from '@/apis/blog';
import { onMounted, ref } from "vue";
import type { BlogInfo } from '@/types/Blog';
import { Album, type Page } from '@/types/misc';
import TextEditor from '@/components/TextEditor.vue';

interface BlogParams {
  page: number
  size: number
}

const text = ref("");

const blogPage = ref<Page<"blogs", BlogInfo>>();
const blogs = ref<BlogInfo[]>([]);
const { state, execute: getBlogListExecute } = getBlogListApi();
const { execute: createBlogExecute } = createBlogApi();
const params = ref<BlogParams>({
  page: 1,
  size: 10
});

const getList = async () => {
  await getBlogListExecute({
    params: {
      ...params.value,
    }
  });

  if (state.value) {
    blogPage.value = state.value;
    blogs.value = blogPage.value.blogs;
  }
}

onMounted(() => {
  getList();
})

const blogForm = ref({
  title: "",
  content: "",
  problem_id: 0,
})

const textEditorRef = ref<InstanceType<typeof TextEditor>>();

const onSubmit = async () => {
  await textEditorRef.value?.uploadImage().then(async () => {
    await createBlogExecute({
      data: {
        title: blogForm.value.title,
        content: text.value,
        problem_id: blogForm.value.problem_id,
      }
    });
  });
}

</script>

<template>
  <div class="container-main">
    <el-card>
      <el-form :model="blogForm">
        <el-form-item label="博客标题">
          <el-input v-model="blogForm.title" placeholder="标题" clearable />
        </el-form-item>
        <el-form-item label="关联题目">
          <el-input v-model="blogForm.problem_id" placeholder="关联题目ID" clearable />
        </el-form-item>
        <el-form-item>
          <TextEditor v-model:text="text" :album="Album.blog" placeholder="分享一些有趣的事吧..." ref="textEditorRef" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped></style>