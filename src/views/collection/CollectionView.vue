<template>
  <div class="collection-view">
    <template v-if="!id">
      <CollectionList 
        @view="handleView"
        @edit="handleEdit"
        @create="handleCreate"
      />
    </template>
    <template v-else-if="mode === 'view'">
      <CollectionDetail :id="id" />
      <ElButton @click="handleBack">返回列表</ElButton>
    </template>
    <template v-else>
      <CollectionForm 
        :id="mode === 'edit' ? parseInt(id) : undefined"
        @success="handleSuccess"
        @cancel="handleBack"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const id = ref(route.params.id as string)
const mode = ref(route.query.mode as string || 'view')

const handleView = (id: number) => {
  router.push({ 
    name: 'collection', 
    params: { id },
    query: { mode: 'view' }
  })
}

const handleEdit = (id: number) => {
  router.push({ 
    name: 'collection', 
    params: { id },
    query: { mode: 'edit' }
  })
}

const handleCreate = () => {
  router.push({ 
    name: 'collection', 
    params: { id: 'create' },
    query: { mode: 'create' }
  })
}

const handleBack = () => {
  router.push({ name: 'collection' })
}

const handleSuccess = () => {
  handleBack()
}
</script>

<style scoped>
.collection-view {
  padding: 20px;
}
</style>
