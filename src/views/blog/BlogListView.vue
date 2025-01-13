<script setup lang="ts">
import { getBlogListApi, createBlogApi } from '@/apis/blog';
import { onMounted, ref } from "vue";
import { BlogStatusMap, BlogStatusColor, BlogStatus } from '@/types/Blog';
import { formatDateStr } from "@/utils/date";
import type { BlogInfo } from '@/types/Blog';
import { Album, type Page } from '@/types/misc';
import TextEditor from '@/components/text/TextEditor.vue';
import router from "@/router";

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
  <div class="container-main">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>搜索博客</strong>
            </div>
          </template>
          <el-form>
            <el-form-item>
              <el-input type="text" placeholder="博客标题" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">搜索</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>博客热榜</strong>
            </div>
          </template>
          <ul>
            <li>1. 今天天气真好</li>
            <li>2. 今天天气真好</li>
            <li>3. 今天天气真好</li>
            <li>4. 今天天气真坏</li>
            <li>5. 今天天气真好</li>
          </ul>
        </el-card>
        <el-card style="margin-bottom: 20px">
          <template #header>
            <div class="card-header">
              <strong>标签分类</strong>
            </div>
          </template>
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
          <el-tag>tag</el-tag>&nbsp;
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="card-header">
              <strong>快速发布</strong>
            </div>
          </template>
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
        </el-card>
        <el-divider></el-divider>
        <div v-for="blog in blogs" :key="blog.id">
          <router-link :to="'/blog/' + blog.id">
            <el-card class="blogCard">
              <span>
                <el-tag :color="BlogStatusColor[blog.status as BlogStatus]" style="color: #ffffff">
                  {{ BlogStatusMap[blog.status as BlogStatus] }}
                </el-tag>&nbsp;
                <b>{{ blog.title }}</b><br />
              </span>
              <br />
              <div>
                <el-icon>
                  <UserFilled />
                </el-icon>&nbsp;{{ blog.user_id }}
                <el-divider direction="vertical"></el-divider>
                <el-icon>
                  <View />
                </el-icon>&nbsp;0
                <el-divider direction="vertical"></el-divider>
                <el-icon>
                  <StarFilled />
                </el-icon>&nbsp;0
                <el-divider direction="vertical"></el-divider>
                <el-icon>
                  <Comment />
                </el-icon>&nbsp;0
                <el-divider direction="vertical"></el-divider>
                <el-icon>
                  <Share />
                </el-icon>&nbsp;0
                <el-divider direction="vertical"></el-divider>
                <el-icon>
                  <Timer />
                </el-icon>&nbsp;{{ formatDateStr(blog.create_time) }}
                <el-divider direction="vertical"></el-divider>
                <el-icon>
                  <Stopwatch />
                </el-icon>&nbsp;{{ formatDateStr(blog.update_time) }}
              </div>
              <br />
              <div>
                <el-tag>tag</el-tag>&nbsp;
                <el-tag>tag</el-tag>&nbsp;
                <el-tag>tag</el-tag>&nbsp;
                <el-tag>tag</el-tag>&nbsp;
              </div>
            </el-card>
          </router-link>
          <br />
        </div>
        <br />
        <el-pagination v-model:current-page="params.page" v-model:page-size="params.size"
                       :page-sizes="[10, 20, 50, 100]" :size="'small'" :background="true"
                       layout="total, sizes, prev, pager, next, jumper" :total="blogPage?.total" @size-change="getList"
                       @current-change="getList" />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped></style>