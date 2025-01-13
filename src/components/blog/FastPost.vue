<script setup lang="ts">
import { ref } from "vue";
import { Album, type Page } from '@/types/misc';
import TextEditor from '@/components/text/TextEditor.vue';
import router from "@/router";
import {createBlogApi} from "@/apis/blog";

const { execute: createBlogExecute } = createBlogApi();

const text = ref("");

const blogForm = ref({
  title: "",
  content: "",
})

const textEditorRef = ref<InstanceType<typeof TextEditor>>();

const onSubmit = async () => {
  await textEditorRef.value?.uploadImage().then(async () => {
    await createBlogExecute({
      data: {
        title: blogForm.value.title,
        content: text.value,
      }
    });
  });

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
      <TextEditor v-model:text="text" :album="Album.blog" placeholder="分享一些有趣的事吧..." ref="textEditorRef"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">快速发布</el-button>
      <el-button @click="handleEdit">编辑器</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>