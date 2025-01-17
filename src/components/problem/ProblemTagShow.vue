<template>
    <div>
        <el-tag v-for="tag in tags" :key="tag.id" :type="tag.color" :closable="removeFlag" :size="props.size"
            @close="handleRemove(tag.id!)">{{ tag.name }}</el-tag>
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '@/types/Problem';
import { problemTagStore } from '@/stores/problemTag';
import { onMounted, ref, watchEffect } from 'vue';

const props = withDefaults(defineProps<{
    removeFlag?: boolean;
    size?: 'large' | 'default' | 'small';
    tagIds: number[];
}>(), {
    removeFlag: false,
    size: 'small',
});

const { getTagList } = problemTagStore();

const allTags = ref<Tag[]>([]);
const tags = ref<Tag[]>([]);

onMounted(async () => {
    await getTagList().then((res) => {
        allTags.value = res.value;
    });
    tags.value = allTags.value
        .filter(tag => typeof tag.id === 'number' && props.tagIds.includes(tag.id))
        .map(tag => ({ ...tag }));
});


watchEffect(() => {
    tags.value = allTags.value
        .filter(tag => typeof tag.id === 'number' && props.tagIds.includes(tag.id))
        .map(tag => ({ ...tag }));
});

const emit = defineEmits(['update:tagIds']);

const handleRemove = (id: number) => {
    const updatedTagIds = props.tagIds.filter(tagId => tagId !== id);
    emit('update:tagIds', updatedTagIds);
};

</script>

<style scoped>
.el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
}
</style>