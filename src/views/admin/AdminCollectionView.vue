<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCollectionListApi, deleteCollectionApi } from '@/apis/collection'
import CollectionForm from '@/components/collection/CollectionForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const { execute } = getCollectionListApi()
const { execute: deleteExecute } = deleteCollectionApi()

const collections = ref<any[]>([])
const total = ref(0)
const params = ref({
  page: 1,
  size: 20
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

const handleDelete = (id: number) => {
  ElMessageBox.confirm('确定删除该题单吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteExecute({ id }).then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
  })
}

const dialogVisible = ref(false)

const handleCreate = () => {
  dialogVisible.value = true
}

const handleDialogClose = () => {
  dialogVisible.value = false
  handleQuery()
}

handleQuery()
</script>

<template>
  <div class="container-full">
    <el-container>
      <el-aside width="200px">
        <AdminMenu></AdminMenu>
      </el-aside>
      <el-main>
        <el-row justify="space-between">
          <el-col :span="4">
            <strong>题单管理</strong>
          </el-col>
          <el-col :span="20" style="text-align: right">
            <el-button type="primary" @click="handleCreate">创建题单</el-button>
            <el-dialog
              v-model="dialogVisible"
              title="创建题单"
              width="50%"
              @close="handleDialogClose"
            >
              <CollectionForm 
                @success="handleDialogClose" 
                @cancel="handleDialogClose" 
              />
            </el-dialog>
          </el-col>
        </el-row>
        <el-divider/>
        
        <el-table :data="collections" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="题单名称" />
          <el-table-column prop="user.name" label="创建者" />
          <el-table-column prop="create_time" label="创建时间" />
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button size="small" @click="$router.push(`/collection/${scope.row.id}?mode=edit`)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
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
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
