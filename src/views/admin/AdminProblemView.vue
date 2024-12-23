<script setup lang="ts">
import { computed, ref } from 'vue'

interface User {
  date: string
  name: string
  address: string
}

const search = ref('')
const filterTableData = computed(() =>
    tableData.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'John',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Morgan',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Jessy',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<template>
  <el-container>
    <el-aside width="200px">
      <AdminMenu></AdminMenu>
    </el-aside>
    <el-main>
      <h1>题目管理</h1>
      <el-divider></el-divider>
      <el-card>
        <el-button type="primary" @click="createProblem">创建题目</el-button>
        <el-button type="primary" @click="importProblem">导入 FPS</el-button>
        <el-button type="primary" @click="generateProblem">AI 生成</el-button>
        <el-divider></el-divider>
        <el-table :data="filterTableData" style="width: 100%">
          <el-table-column type="selection" :selectable="selectable" width="55" />
          <el-table-column label="编号" prop="date" />
          <el-table-column label="标题" prop="name" />
          <el-table-column label="状态" prop="name" />
          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="搜索" />
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>