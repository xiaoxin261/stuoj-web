<template>
    <el-tag :color="UserRoleColor[role]" style="color: #fff; width: 50px;">
        {{ UserRoleMap[role] }}
    </el-tag>
</template>

<script setup lang="ts">
import { Role, UserRoleColor, UserRoleMap } from "@/types/User";

const props = defineProps<{ role: Role }>();
</script>