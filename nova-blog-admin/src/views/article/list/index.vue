<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { getArticleList, deleteArticle } from '@/api/article'
import type { ArticleListItem } from '@/api/article'

const router = useRouter()

const loading = ref(false)
const articleList = ref<ArticleListItem[]>([])
const selectedRows = ref<number[]>([])
const searchTitle = ref('')

const queryParams = reactive<{
  pageSize: number
  pageIndex: number
}>({
  pageSize: 10,
  pageIndex: 1
})

const pagination = reactive({
  total: 0,
  pageIndex: 1,
  pageSize: 10
})

onMounted(() => {
  fetchList()
})

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getArticleList(queryParams)
    if (res.data && res.data.result) {
      articleList.value = res.data.result || []
      pagination.total = res.data.total || 0
      pagination.pageIndex = res.data.currentPage || 1
      pagination.pageSize = res.data.pageSize || 10
    } else {
      articleList.value = []
      pagination.total = 0
    }
  } catch (e) {
    console.error('获取文章列表失败:', e)
    articleList.value = []
    ;(window as any).$message.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.pageIndex = 1
  fetchList()
}

const handleReset = () => {
  queryParams.pageIndex = 1
  fetchList()
}

const handleSelectionChange = (selection: ArticleListItem[]) => {
  selectedRows.value = selection.map(item => item.id)
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确认删除该文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteArticle(id)
    ;(window as any).$message.success('删除成功')
    fetchList()
  } catch (e) {
    console.error('删除失败:', e)
  }
}

const handleEdit = (id: number) => {
  router.push({
    path: '/article/publish',
    query: { id: id.toString() }
  })
}

const handlePageChange = (page: number) => {
  queryParams.pageIndex = page
  fetchList()
}

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size
  queryParams.pageIndex = 1
  fetchList()
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return dateStr.split('T')[0]
}
</script>

<template>
  <div class="article-list-container w-full h-full bg-white rounded-lg px-4 py-4">
    <div class="search-bar mb-4">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标题">
          <el-input v-model="searchTitle" placeholder="请输入文章标题" clearable @clear="handleSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table 
        v-loading="loading" 
        :data="articleList" 
        border 
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="#" width="60" align="center" />
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="自定义路由" min-width="140" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.slug || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="120" align="center">
          <template #default="{ row }">
            {{ formatDate(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleEdit(row.id)">编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-container flex justify-end mt-4">
      <el-pagination
        v-model:current-page="pagination.pageIndex"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-list-container {
  display: flex;
  flex-direction: column;
  
  .search-bar {
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
  }
  
  .table-container {
    flex: 1;
    overflow: auto;
  }
}
</style>