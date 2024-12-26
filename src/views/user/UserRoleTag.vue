<template>
    <el-tag :color="UserRoleColor[role]" style="color: #fff">
        {{ UserRoleMap[role] }}
    </el-tag>
</template>

<script setup lang="ts">
import { ROLE, UserRoleColor, UserRoleMap } from "@/types/User";

const props = defineProps<{ role: ROLE }>();
</script>