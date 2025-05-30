<template>
  <ElCard>
    <ElTable :data="collections" style="width: 100%">
      <ElTableColumn prop="id" label="ID" width="80" />
      <ElTableColumn prop="title" label="题单名称" />
      <ElTableColumn prop="user.name" label="创建者" />
      <ElTableColumn prop="create_time" label="创建时间" />
      <ElTableColumn label="操作" width="180">
        <template #default="scope">
          <ElButton size="small" @click="handleView(scope.row)">查看</ElButton>
          <ElButton size="small" type="primary" @click="handleEdit(scope.row)">编辑</ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination
      class="pagination"
      v-model:current-page="params.page"
      v-model:page-size="params.size"
      :page-sizes="[10, 20, 50, 100]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleQuery"
      @current-change="handleQuery"
    />
  </ElCard>
</template>

<script setup lang="ts">
defineOptions({
  name: 'CollectionList'
})
import { ref, onMounted } from 'vue'
import { getCollectionListApi } from '@/apis/collection'
import type { CollectionListResponse } from '@/apis/collection'

const { execute } = getCollectionListApi()

const collections = ref<CollectionListResponse['collections']>([])
const total = ref(0)
const params = ref({
  page: 1,
  size: 20
})

onMounted(() => {
  handleQuery()
})

const handleQuery = async () => {
  await execute({ 
    ...params.value,
    order_by: 'create_time',
    order: 'desc' 
  }).then((res) => {
    collections.value = res.value?.collections || []
    total.value = res.value?.total || 0
  })
}

const handleView = (row: any) => {
  // TODO: 查看题单详情
}

const handleEdit = (row: any) => {
  // TODO: 编辑题单
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
