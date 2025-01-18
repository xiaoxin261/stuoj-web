<script setup lang="ts">
import { createBlogApi, getBlogApi, updateBlogApi } from '@/apis/blog';
import { computed, onMounted, ref } from "vue";
import { Album } from '@/types/misc';
import TextEditor from '@/components/text/TextEditor.vue';
import { BlogStatus } from '@/types/Blog';
import { useRouteParams, useRouteQuery } from '@vueuse/router';
import router from '@/router';
import { ElNotification } from 'element-plus';


const { execute: createBlogExecute } = createBlogApi();
const { execute: getBlogExecute } = getBlogApi();
const { execute: updateBlogExecute } = updateBlogApi();
const blogForm = ref({
  title: "",
  content: "",
  problem_id: 0,
  status: BlogStatus.Draft,
});

const textEditorRef = ref<InstanceType<typeof TextEditor>>();

const problem_id = computed({
  set: (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      blogForm.value.problem_id = parsedValue;
    } else {
      blogForm.value.problem_id = 0;
    }
  },
  get: () => {
    return blogForm.value.problem_id !== 0 ? blogForm.value.problem_id.toString() : "";
  }
});

const blogId = useRouteParams<string>("id");
const problem = useRouteQuery<string>("problem");

onMounted(async () => {
  if (blogId.value) {
    await getBlogExecute({
      id: parseInt(blogId.value, 10),
    }).then((res) => {
      if (res.value) {
        blogForm.value.content = res.value.content ?? "";
        blogForm.value.title = res.value.title ?? "";
        blogForm.value.status = res.value.status ?? 0;
        blogForm.value.problem_id = res.value.problem_id ?? 0;
      };
    });
  };
  if (problem.value) {
    blogForm.value.problem_id = parseInt(problem.value, 10);
  }
});

const onSubmit = async () => {
  await textEditorRef.value?.uploadImage().then(async () => {
    await createBlogExecute({
      data: {
        title: blogForm.value.title,
        content: blogForm.value.content,
        problem_id: blogForm.value.problem_id === null ? 0 : blogForm.value.problem_id,
        status: blogForm.value.status,
      }
    }).then((res) => {
      ElNotification({ type: 'success', message: '创建成功' });
      router.push(`/blog/${res.value}`);
    });
  });
};

const onEdit = async () => {
  await textEditorRef.value?.uploadImage().then(async () => {
    await updateBlogExecute({
      data: {
        id: parseInt(blogId.value, 10),
        title: blogForm.value.title,
        content: blogForm.value.content,
        problem_id: blogForm.value.problem_id === null ? 0 : blogForm.value.problem_id,
        status: blogForm.value.status,
      }
    }).then(() => {
      ElNotification({ type: 'success', message: '修改成功' });
      router.push(`/blog/${blogId.value}`)
    });
  });
};

</script>

<template>
  <div class="container-main">
    <el-card>
      <el-form :model="blogForm">
        <el-form-item label="博客标题">
          <el-input v-model="blogForm.title" placeholder="标题" clearable />
        </el-form-item>
        <el-form-item label="关联题目">
          <el-input v-model="problem_id" placeholder="关联题目ID" clearable />
        </el-form-item>
        <el-form-item>
          <TextEditor v-model:text="blogForm.content" :max-row="100" :album="Album.blog" placeholder="分享一些有趣的事吧..."
            ref="textEditorRef" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="!blogId" type="primary" @click="onSubmit">发布</el-button>
          <el-button v-else type="" @click="onEdit">修改</el-button>
          <BlogStatusSelect style="margin-left: 10px; width: 100px;" v-model:status="blogForm.status" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped></style>