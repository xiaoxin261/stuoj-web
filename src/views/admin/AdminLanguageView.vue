<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { type Language, LanguageStatus, LanguageStatusButtonType, LanguageStatusMap } from '@/types/Judge';
import type { Page } from '@/types/misc';
import { updateLanguageApi } from "@/apis/language";
import { langStore } from '@/stores/language';
import { ElNotification } from "element-plus";
import { userStore } from "@/stores/user";
import { Role } from "@/types/User";

const { refreshLanguages } = langStore();
const { info } = userStore();

interface LanguageParams {
  page: number
  size: number
}

const languagePage = ref<Page<"languages", Language>>();
const languages = ref<Language[]>([]);
const params = ref<LanguageParams>({
  page: 1,
  size: 10
});

const getList = async () => {
  const refreshedLanguages = (await refreshLanguages()).value;
  languages.value = refreshedLanguages.map(lang => ({
    ...lang,
    originalSerial: lang.serial // 新增 originalSerial 字段并初始化为 serial 的值
  }));
}

onMounted(() => {
  getList();
})

const { execute: updateExecute } = updateLanguageApi();

// 使用key在更新后让表格重新渲染，否则表格不会更新
const key = ref(0);
watch(() => languages.value, () => {
  key.value++
});

const handleStatusChange = (status: number, row: Language) => {
  // 调用 API 更新语言状态
  updateExecute({
    data: { ...row, status }
  }).then(() => {
    ElNotification.success({
      title: '状态更新成功',
      type: 'success'
    });
    getList(); // 刷新语言列表
  });
};

const handleSerialChange = (row: Language) => {
  // 获取原始序号（从新增的 originalSerial 字段中读取）
  const originalSerial = row.originalSerial;

  // 检查序号是否发生变化
  if (row.serial === originalSerial) {
    return; // 如果序号未变化，则直接返回，不发送请求
  }

  // 更新序号
  updateExecute({
    data: { ...row }
  }).then(() => {
    ElNotification.success({
      title: '序号更新成功',
      type: 'success'
    });
    getList(); // 刷新语言列表以同步 originalSerial
  });
};

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
        </el-row>
        <el-divider></el-divider>
        <el-card>
          <el-table :data="languages" :key="key" style="width: 100%" stripe>
            <el-table-column label="ID" prop="id" width="80" />
            <el-table-column label="语言" prop="name" />
            <el-table-column label="序号" width="150">
              <template #default="scope">
                <el-input-number v-model="scope.row.serial" :min="1" size="small"
                  @change="handleSerialChange(scope.row)" @blur="handleSerialChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="映射ID" prop="map_id" v-if="info.role >= Role.Root" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-dropdown>
                  <el-button size="small" :type="LanguageStatusButtonType[scope.row.status as number]">
                    {{ LanguageStatusMap[scope.row.status as number] }}
                    <el-icon><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item v-for="(statusName, statusValue) in LanguageStatusMap" :key="statusValue"
                        @click="handleStatusChange(Number(statusValue), scope.row)">
                        {{ statusName }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <el-pagination v-model:current-page="params.page" v-model:page-size="params.size"
            :page-sizes="[10, 20, 50, 100]" :size="'small'" :background="true"
            layout="total, sizes, prev, pager, next, jumper" :total="languagePage?.total" @size-change="getList"
            @current-change="getList" />
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped></style>
