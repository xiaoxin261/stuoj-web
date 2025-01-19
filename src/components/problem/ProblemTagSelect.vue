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
        <ElCheckTag class="tag-select" v-for="tag in wsTags" :key="tag.data.id" v-model:checked="tag.checked"
          :label="tag.data.name" type="primary">
          {{ tag.data.name }}
        </ElCheckTag>
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
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import type { Tag } from '@/types/Problem';
import type { TagParams } from "@/types/tag";
import type { Page } from "@/types/misc";
import { problemTagStore } from '@/stores/problemTag';

const props = defineProps<{
  tagIds: number[];
}>();

const { getTagList } = problemTagStore();

const emit = defineEmits(['update:tagIds']);

interface TemTag {
  checked: boolean;
  data: Tag;
}

const tags = computed(() => {
  // 过滤掉 tagIds 中的 undefined 值
  const validTagIds = props.tagIds.filter((id): id is number => typeof id === 'number');

  // 过滤掉 wsTags 中 data.id 为 undefined 的项
  return wsTags.value
    .filter(tag => typeof tag.data.id === 'number' && validTagIds.includes(tag.data.id))
    .map(tag => tag.data) || [];
});

const tagDialogVisible = ref(false);
let wsTags = ref<TemTag[]>([]);
let savedWsTags: TemTag[] | null = null; // 用于保存wsTags状态的变量

const tagPage = ref<Page<"tags", Tag>>();
const params = ref<TagParams>({
  page: 1,
  size: 100
});

const getList = async () => {
  await getTagList().then((res) => {
    wsTags.value = res.value.map((tag) => {
      const checked = tags.value.some((t) => t.id === tag.id);
      return { checked, data: tag };
    });
  });
}

onBeforeMount(async () => {
  await getList();
})

const showDialog = () => {
  if (savedWsTags === null) {
    wsTags.value = wsTags.value.map(tag => ({ ...tag, checked: false }));

    // 检查 tags.value 是否为空数组
    if (tags.value.length > 0) {
      tags.value.forEach(tag => {
        const index = wsTags.value.findIndex(wsTag => wsTag.data.id === tag.id);
        if (index !== -1) {
          wsTags.value[index].checked = true;
        }
      });
    }

    savedWsTags = JSON.parse(JSON.stringify(wsTags.value));
  }
  tagDialogVisible.value = true;
};

const handleConfirm = () => {
  tagDialogVisible.value = false;
  const selectedTagIds = wsTags.value.filter(tag => tag.checked).map(tag => tag.data.id);
  emit('update:tagIds', selectedTagIds);
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
  emit('update:tagIds', []);
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
.tag-select {
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>