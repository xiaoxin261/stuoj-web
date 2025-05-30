<template>
  <div class="collection-detail">
    <ElCard class="info-card">
      <template #header>
        <div class="card-header">
          <span>{{ collection.title }}</span>
        </div>
      </template>
      <div class="info-content">
        <p>{{ collection.description }}</p>
        <p>创建者: {{ collection.user?.name }}</p>
        <p>创建时间: {{ collection.create_time }}</p>
      </div>
    </ElCard>

    <ElCard class="problems-card">
      <template #header>
        <div class="card-header">
          <span>题目列表</span>
        </div>
      </template>
      <ElTable :data="collection.problems" style="width: 100%">
        <ElTableColumn prop="id" label="ID" width="80" />
        <ElTableColumn prop="title" label="题目名称" />
        <ElTableColumn prop="difficulty" label="难度" />
      </ElTable>
    </ElCard>

    <ElCard class="collaborators-card">
      <template #header>
        <div class="card-header">
          <span>协作者</span>
        </div>
      </template>
      <div class="collaborators-list">
        <ElTag 
          v-for="user in collection.collaborator" 
          :key="user.id"
          class="collaborator-tag"
        >
          {{ user.name }}
        </ElTag>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'CollectionDetail'
})
import { ref, onMounted } from 'vue'
import { getCollectionApi } from '@/apis/collection'
import type { CollectionData } from '@/apis/collection'

const props = defineProps<{
  id: string
}>()

const collection = ref<CollectionData>({
  id: 0,
  title: '',
  description: '',
  status: 0,
  create_time: '',
  update_time: '',
  user: {
    id: 0,
    name: '',
    role: 0,
    avatar: ''
  },
  problems: [],
  collaborator: []
})

onMounted(async () => {
  const { execute } = getCollectionApi()
  await execute({ id: props.id }).then((res) => {
    if (res.value?.data) {
      collection.value = res.value.data
    }
  })
})
</script>

<style scoped>
.collection-detail {
  display: grid;
  gap: 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.info-content p {
  margin: 8px 0;
}

.collaborators-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.collaborator-tag {
  margin-right: 8px;
}
</style>
