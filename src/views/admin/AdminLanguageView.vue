<script setup lang="ts">
import {onBeforeMount, onMounted, ref, watch} from "vue";
import {type Language, LanguageStatus, LanguageStatusColor, LanguageStatusMap} from '@/types/Judge';
import type {Page} from '@/types/misc';
import {getLanguageListApi, updateLanguageApi} from "@/apis/judge";
import {ElNotification} from "element-plus";

interface LanguageParams {
  page: number
  size: number
}

const languagePage = ref<Page<"languages", Language>>();
const languages = ref<Language[]>([]);
const { state, execute } = getLanguageListApi();
const params = ref<LanguageParams>({
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
    // languagePage.value = state.value;
    // languages.value = languagePage.value.languages;
    languages.value = state.value;
    console.log(languages.value);
  }
}

onMounted (() => {
  getList();
})

const formLabelWidth = '140px';
const language = ref<Language>({
  id: 0,
  name: '',
  serial: 0,
  mapId: 0,
  status: LanguageStatus.Enabled,
});

/*
const addDialogVisible = ref(false)

const { execute: insertExecute } = insertLanguageApi();
const handleCreate = () => {
  addDialogVisible.value = true
  language.value.name = ''
}

const submitAdd = () => {
  insertExecute({
    data: language.value
  }).then(() => {
    getList();
    ElNotification.success({
      title: '创建成功',
      type: 'success'
    });
  });
  addDialogVisible.value = false
}
*/

const editDialogVisible = ref(false)

const { execute: updateExecute } = updateLanguageApi();
const handleEdit = (t: Language) => {
  editDialogVisible.value = true
  language.value.id = t.id
  language.value.name = t.name
  language.value.serial = t.serial
  language.value.mapId = t.map_id
  language.value.status = t.status
}

const submitEdit = () => {
  updateExecute({
    data: language.value
  }).then(() => {
    getList();
    ElNotification.success({
      title: '修改成功',
      type: 'success'
    });
  });
  editDialogVisible.value = false
}

// 使用key在更新后让表格重新渲染，否则表格不会更新
const key = ref(0);
watch(() => languages.value, () => {
  key.value++
});

const options = ref<{ id: string; name: string }[]>([
  {
    id: '1',
    name: '弃用'
  },
  {
    id: '2',
    name: '停用'
  },
  {
    id: '3',
    name: '启用'
  }
]);
console.log(options)
</script>

<template>
  <div class="container-full">
    <el-container>
      <el-aside width="200px">
        <AdminMenu></AdminMenu>
      </el-aside>
      <el-main>
        <el-row justify="space-between">
          <el-col :span="4">
            <strong>语言管理</strong>
          </el-col>
          <el-col :span="20" style="text-align: right">
            <el-button type="primary" @click="handleCreate" disabled>创建语言</el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-card>
          <el-table :data="languages" :key="key" style="width: 100%" stripe>
            <el-table-column type="selection" :selectable="selectable" width="55" />
            <el-table-column label="ID" prop="id" width="80" />
            <el-table-column label="语言" prop="name" />
            <el-table-column label="序号" prop="serial" />
            <el-table-column label="映射ID" prop="map_id" />
            <el-table-column label="状态" width="80">
              <template #default="scope">
                <el-tag :color="LanguageStatusColor[scope.row.status as number] " style="color: #fff">
                  {{ LanguageStatusMap[scope.row.status as number] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="right" width="300">
              <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)" disabled>编辑</el-button>
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
              :total="languagePage?.total"
              @size-change="getList"
              @current-change="getList"
          />
        </el-card>
      </el-main>
    </el-container>
    <el-dialog v-model="addDialogVisible" title="创建语言" width="500">
      <el-form :model="language">
        <el-form-item label="语言名" :label-width="formLabelWidth">
          <el-input v-model="language.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdd">创建</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="editDialogVisible" title="修改语言" width="500">
      <el-form :model="language">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="language.id" readonly/>
        </el-form-item>
        <el-form-item label="语言名" :label-width="formLabelWidth">
          <el-input v-model="language.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="序号" :label-width="formLabelWidth">
          <el-input v-model="language.serial" autocomplete="off" />
        </el-form-item>
        <el-form-item label="映射ID" :label-width="formLabelWidth">
          <el-input v-model="language.mapId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="language.status" placeholder="请选择状态" style="width: 100%">
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>

</style>
