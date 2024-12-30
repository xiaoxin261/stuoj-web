<template>
    <div>
        <el-tag v-for="tag in props.tags" :key="tag.id" :type="tag.color" :closable="removeFlag" :size="props.size" @close="handleRemove(tag.id)">{{ tag.name }}</el-tag>
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '@/types/Problem';

const props = withDefaults(defineProps<{
    removeFlag?:boolean;
    size?: 'large' | 'default' | 'small';
    tags: Tag[];
}>(),{
    removeFlag:false,
    size:'small',
});

const emit = defineEmits(['update:tags']);

const handleRemove = (id: number) => {
    emit('update:tags', props.tags.filter(tag => tag.id !== id));
}

</script>

<style scoped>
.el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
}
</style>