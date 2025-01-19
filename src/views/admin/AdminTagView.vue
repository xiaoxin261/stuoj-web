<script setup lang="ts">
import {onMounted, ref} from "vue";
import type { Tag } from '@/types/Problem';
import type { Page } from '@/types/misc';
import {deleteTagApi, getTagListApi, insertTagApi, updateTagApi} from "@/apis/tag";
import {ElNotification} from "element-plus";

interface TagParams {
  page: number
  size: number
}

const tagPage = ref<Page<"tags", Tag>>();
const tags = ref<Tag[]>([]);
const { state, execute } = getTagListApi();
const params = ref<TagParams>({
  page: 1,
  size: 10
});

const getList = async () => {
  await execute({
    params: {
      ...params.value,
    }
  });

  if (state.value) {
    tagPage.value = state.value;
    tags.value = tagPage.value.tags;
  }
}

onMounted (() => {
  getList();
})

const { execute: deleteExecute } = deleteTagApi();
const handleDelete = (id: number) => {
  deleteExecute({
    id: id
  }).then(() => {
    getList();
    ElNotification.success({
      title: '删除成功',
      type: 'success'
    });
  });
};

const formLabelWidth = '140px';
const tag = ref<Tag>({
  id: 0,
  name: '',
});

const addDialogVisible = ref(false)

const { execute: insertExecute } = insertTagApi();
const handleCreate = () => {
  addDialogVisible.value = true
  tag.value.name = ''
}

const submitAdd = () => {
  insertExecute({
    data: tag.value
  }).then(() => {
    getList();
    ElNotification.success({
      title: '创建成功',
      type: 'success'
    });
  });
  addDialogVisible.value = false
}

const editDialogVisible = ref(false)

const { execute: updateExecute } = updateTagApi();
const handleEdit = (t: Tag) => {
  editDialogVisible.value = true
  tag.value.id = t.id
  tag.value.name = t.name
}

const submitEdit = () => {
  updateExecute({
    data: tag.value
  }).then(() => {
    getList();
    ElNotification.success({
      title: '修改成功',
      type: 'success'
    });
  });
  editDialogVisible.value = false
}
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <el-row justify="space-between">
        <el-col :span="4">
          <strong>标签管理</strong>
        </el-col>
        <el-col :span="20" style="text-align: right">
          <el-button type="primary" @click="handleCreate">创建标签</el-button>
          <el-button type="danger" @click="" disabled>批量删除</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-card>
        <el-table :data="tags" style="width: 100%" stripe>
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="ID" prop="id" width="80" />
          <el-table-column label="标签" prop="name" />
          <el-table-column label="关联题目数" >
            <template #default="scope">
              ?
            </template>
          </el-table-column>
          <el-table-column label="关联博客数" >
            <template #default="scope">
              ?
            </template>
          </el-table-column>
          <el-table-column align="right" width="300">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <br/>
        <el-pagination
            v-model:current-page="params.page"
            v-model:page-size="params.size"
            :page-sizes="[10, 20, 50, 100]"
            :size="'small'"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tagPage?.total"
            @size-change="getList"
            @current-change="getList"
        />
      </el-card>
    </el-main>
  </el-container>
  <el-dialog v-model="addDialogVisible" title="创建标签" width="500">
    <el-form :model="tag">
      <el-form-item label="标签名" :label-width="formLabelWidth">
        <el-input v-model="tag.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAdd">创建</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="editDialogVisible" title="修改标签" width="500">
    <el-form :model="tag">
      <el-form-item label="ID" :label-width="formLabelWidth">
        <el-input v-model="tag.id" readonly/>
      </el-form-item>
      <el-form-item label="标签名" :label-width="formLabelWidth">
        <el-input v-model="tag.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">修改</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
