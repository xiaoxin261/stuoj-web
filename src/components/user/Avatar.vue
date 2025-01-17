<template>
    <el-avatar :size="size" :src="props.src" @error="errorHandler">
        <img :src="empty" />
    </el-avatar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DefaultAvatar from '@/assets/images/avatar/default.png';

const props = withDefaults(defineProps<{
    size?: number
    src?: string
}>(), {
    size: 40
});

const errorHandler = () => true;
const empty = ref(DefaultAvatar);

</script>

<style></style>