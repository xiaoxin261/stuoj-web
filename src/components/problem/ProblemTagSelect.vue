<template>
  <ElButton style="width: 60px;" plain @click="showDialog()">
    标签
  </ElButton>
  <ElDialog v-model="tagDialogVisible" width="80%">
    <template #header>
      <strong>选择标签</strong>
      <el-divider direction="vertical"></el-divider>
      <el-button type="danger" @click="reset()" size="small">重置</el-button>
    </template>
    <div style="text-align: center">
      <el-card>
        <ElCheckTag class="tag-select" v-for="tag in wsTags" :key="tag.data.id" v-model:checked="tag.checked" :label="tag.data.name" type="primary" >
          {{ tag.data.name }}
        </ElCheckTag>
        <template #footer>
          <el-pagination
              v-model:current-page="params.page"
              v-model:page-size="params.size"
              :page-sizes="[10, 20, 50, 100]"
              :size="'small'"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tagPage?.total"
              @size-change="getList"
              @current-change="getList"/>
        </template>
      </el-card>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel()">取消</el-button>
        <el-button type="primary" @click="handleConfirm()">确定</el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Tag } from '@/types/Problem';
import {getTagListApi} from "@/apis/tag";
import type {TagParams} from "@/types/tag";
import type {Page} from "@/types/misc";

const props = defineProps<{
  tags: Tag[];
}>();

const emit = defineEmits(['update:tags']);

interface TemTag {
  checked: boolean;
  data: Tag;
}

const tags = ref<Tag[]>(props.tags);
const tagDialogVisible = ref(false);
let wsTags = ref<TemTag[]>([]);
let savedWsTags: TemTag[] | null = null; // 用于保存wsTags状态的变量

const tagPage = ref<Page<"tags", Tag>>();
const { state, execute } = getTagListApi();
const params = ref<TagParams>({
  page: 1,
  size: 100
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
    wsTags.value = state.value.tags.map((tag: Tag) => ({
      checked: false,
      data: tag
    }));
  }
}

onMounted(async () => {
  await getList();
})

const showDialog = () => {
  tags.value = props.tags;
  if (savedWsTags === null) {
    wsTags.value = wsTags.value.map(tag => ({ ...tag, checked: false }));
    tags.value.forEach(tag => {
      const index = wsTags.value.findIndex(wsTag => wsTag.data.id === tag.id);
      if (index !== -1) {
        wsTags.value[index].checked = true;
      }
    });
    savedWsTags = JSON.parse(JSON.stringify(wsTags.value));
  }
  tagDialogVisible.value = true;
};

const handleConfirm = () => {
  tagDialogVisible.value = false;
  tags.value = wsTags.value.filter(tag => tag.checked).map(tag => tag.data);
  emit('update:tags', tags.value);
  savedWsTags = null; // 确认后清空保存的状态
};

const handleCancel = () => {
  if (savedWsTags !== null) {
    wsTags.value = JSON.parse(JSON.stringify(savedWsTags));
  }
  tagDialogVisible.value = false;
  savedWsTags = null; // 取消后清空保存的状态
};

const reset = () => {
  tags.value = [];
  wsTags.value = wsTags.value.map(tag => ({ ...tag, checked: false }));
};

const resetAndConfirm = () => {
  reset();
  handleConfirm();
};
defineExpose({
  resetAndConfirm,
});
</script>

<style scoped>
.tag-select{
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>