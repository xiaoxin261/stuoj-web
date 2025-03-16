<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { type Language, LanguageStatus, LanguageStatusButtonType, LanguageStatusMap } from '@/types/Judge';
import type { Page } from '@/types/misc';
import { updateLanguageApi } from "@/apis/language";
import { langStore } from '@/stores/language';
import { ElNotification } from "element-plus";
import { userStore } from "@/stores/user";
import { VueDraggable } from 'vue-draggable-plus';
import { DCaret } from "@element-plus/icons-vue";

interface LanguageItem extends Language {
  // 新增字段
  originalSerial: number; // 原始序号
  originalStatus: LanguageStatus; // 原始状态
  isSerialModified: boolean; // 序号是否被修改
  isStatusModified: boolean; // 状态是否被修改
}

const { refreshLanguages } = langStore();
const loading = ref(false);

const languages = ref<LanguageItem[]>([]);

const getList = async () => {
  loading.value = true;
  const refreshedLanguages = (await refreshLanguages()).value;
  const filteredLanguages = refreshedLanguages.slice(0, -1);
  languages.value = filteredLanguages.map(lang => ({
    ...lang,
    originalSerial: lang.serial,
    originalStatus: lang.status ?? LanguageStatus.Enabled,
    isSerialModified: false,
    isStatusModified: false,
  }));
  loading.value = false;
}

const handleDragEnd = () => {
  languages.value.forEach((lang, index) => {
    const newSerial = index + 1;
    if (lang.originalSerial !== newSerial) {
      lang.isSerialModified = true;
    } else {
      lang.isSerialModified = false;
    }
    lang.serial = newSerial;
  });
};

const handleStatusChange = (language: LanguageItem, newStatus: number) => {
  if (language.originalStatus !== newStatus) {
    language.isStatusModified = true;
  } else {
    language.isStatusModified = false;
  }
  language.status = newStatus;
};

onMounted(() => {
  getList();
})

const { execute: updateExecute } = updateLanguageApi();

// 使用key在更新后让表格重新渲染，否则表格不会更新
const key = ref(0);
watch(() => languages.value, () => {
  key.value++
});

const updateHandle = async () => {
  loading.value = true;
  for (const language of languages.value) {
    if (language.isSerialModified || language.isStatusModified) {
      await updateExecute(
        {
          data: language
        }
      ).then(() => {
        ElNotification.success({
          title: '修改成功' + language.name,
          type: 'success'
        });
      });
    }
  }
  getList();
  loading.value = false;
};


</script>

<template>
  <div class="container-full">
    <el-container>
      <el-aside width="200px">
        <AdminMenu></AdminMenu>
      </el-aside>
      <el-main v-loading="loading">
        <el-row justify="space-between">
          <el-col :span="4">
            <strong>语言管理</strong>
          </el-col>
          <el-col :span="20" style="text-align: right;">
            <el-button icon="refresh" type="info" @click="getList()">刷新</el-button>
            <el-button icon="upload" type="primary" @click="updateHandle()">更新</el-button>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <VueDraggable v-model="languages" :animation="150" handle=".handle" class="flex flex-col gap-2"
          @end="handleDragEnd" :force-fallback="true">
          <template v-for="(language, index) in languages" :key="language.id">
            <div class="language-item">
              <el-row>
                <el-col :span="1">
                  <el-button icon="DCaret" style="width: 10px;" class="handle cursor-move" text />
                </el-col>
                <el-col :span="18">
                  {{ language.name }}
                </el-col>
                <el-col :span="2">
                  <span :class="{ 'text-red': language.isSerialModified }">
                    {{ language.originalSerial }} → {{ language.serial }}
                  </span>
                </el-col>
                <el-col :span="3">
                  <el-dropdown trigger="click" @command="(value: number) => handleStatusChange(language, value)">
                    <el-button size="small" :type="LanguageStatusButtonType[language.status as number]">
                      {{ LanguageStatusMap[language.status as number] }}
                      <el-icon><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item v-for="(statusName, statusValue) in LanguageStatusMap" :key=statusValue
                          :command="Number(statusValue)">
                          {{ statusName }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <span v-if="language.isStatusModified" class="original-status text-red ml-2">
                    (原：{{ LanguageStatusMap[language.originalStatus] }})
                  </span>
                </el-col>
              </el-row>
            </div>
          </template>
        </VueDraggable>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.language-item {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}
</style>
