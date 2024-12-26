<template>
    <div>
        <el-tag v-for="tag in props.tags" :key="tag.id" :type="tag.color">{{ tag.name }}</el-tag>
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '@/types/Problem';
import { ref, onMounted } from 'vue'

const props = defineProps<{
    tags: Tag[];
}>();
</script>

<style scoped>
.el-tag {
    margin-right: 5px;
}
</style>