<template>
  <ElText>我是主页</ElText>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  document.title = 'STUOJ';
});
</script>