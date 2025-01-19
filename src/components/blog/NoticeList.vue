<script setup lang="ts">
import {ref} from "vue";
import {type BlogParams, BlogStatus} from "@/types/Blog";
import {OrderBy} from "@/types/misc";

const blogParams = ref<BlogParams>({
  page: 1,
  size: 5,
  status: BlogStatus.Notice.toString(),
  order_by: OrderBy.create_time,
  order: 'desc',
});
</script>

<template>
  <BlogsComp :select="false" :params="blogParams" />
</template>

<style scoped>

</style>