<template>
    <Records :user-id="props.userId" :select="false" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  userId?: number;
}>(), {
  userId: 0
});

</script>
