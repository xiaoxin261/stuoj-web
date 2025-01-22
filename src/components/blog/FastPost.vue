<script setup lang="ts">
import { ref } from "vue";
import { Album } from '@/types/misc';
import TextEditor from '@/components/text/TextEditor.vue';
import router from "@/router";
import { createBlogApi } from "@/apis/blog";
import { BlogStatus } from "@/types/Blog";
import { ElNotification } from "element-plus";
import { userStore } from "@/stores/user";

const { execute: createBlogExecute } = createBlogApi();
const { id } = userStore();

const blogForm = ref({
  title: "",
  content: "",
  status: BlogStatus.Public,
})

const textEditorRef = ref<InstanceType<typeof TextEditor>>();

const onSubmit = async () => {
  await textEditorRef.value?.uploadImage().then(async () => {
    await createBlogExecute({
      data: blogForm.value
    }).then((res) => {
      ElNotification({ type: 'success', message: '发布成功' });
      router.push(`/blog/${res.value}`);
    });
  });
}

const handleDraft = () => {
  window.open(`/user/${id.value}?tab=1&blog_status=2`);
}

const handleEdit = () => {
  router.push("/blog/edit");
}

</script>

<template>
  <el-form :model="blogForm">
    <el-form-item>
      <el-input v-model="blogForm.title" placeholder="标题" clearable />
    </el-form-item>
    <el-form-item>
      <TextEditor v-model:text="blogForm.content" :min-row="5" :album="Album.blog" placeholder="分享一些有趣的事吧..."
        ref="textEditorRef" />
    </el-form-item>
    <el-form-item>
      <div style="display: flex;justify-content: space-between;width: 100%;">
        <ElButton @click="handleDraft">草稿箱</ElButton>
        <div>
          <el-button @click="handleEdit">编辑器</el-button>
          <el-button type="primary" @click="onSubmit">快速发布</el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>