<template>
  <div>
    <TableSearch :options="searchOpt" :query="query" :search="handleSearch" />
    <div class="container">
      <el-button type="warning" :icon="CirclePlusFilled" @click="handleAdd">新增</el-button>
      <div style="height:10px"></div>
      <div class="card-container">
        <el-card v-for="item in filteredData" :key="item.id" class="case-card"
                 style="max-width: 480px; margin-bottom: 20px;" @click="handleViewDetail(item.id)">
          <template #header>
            <div class="card-header">
              <span>{{ item.name }}</span>
            </div>
          </template>
          <div class="card-content">
            <p><strong>主题：</strong>{{ item.theme }}</p>
            <p><strong>类型：</strong>{{ item.typ }}</p>
            <p><strong>关键词：</strong>{{ item.keyword.join(', ') }}</p>
          </div>
          <template #footer>
            <div class="card-footer">
              <el-button type="primary" size="small" @click="handleEdit(item)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(item.id)">删除</el-button>
            </div>
          </template>
        </el-card>
      </div>
    </div>
    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <div>
        <el-form :model="formData" label-width="100px">
          <el-form-item label="案例名称">
            <el-input v-model="formData.name" placeholder="请输入案例名称"></el-input>
          </el-form-item>
          <el-form-item label="案例类型">
            <el-input v-model="formData.typ" placeholder="请输入案例类型"></el-input>
          </el-form-item>
          <el-form-item label="案例主题">
            <el-input v-model="formData.theme" placeholder="请输入案例主题"></el-input>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="formData.keyword" placeholder="请输入关键词（用逗号分隔）"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <el-button type="primary" @click="saveData">{{ isEdit ? '保存' : '新增' }}</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData"></TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-case-cards">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { useCaseStore } from '@/store/case';  // Import your Pinia store
import TableSearch from '@/components/table-search.vue';
import TableDetail from '@/components/table-detail.vue';
import type { Case } from '@/types/case';
import router from '@/router';

// 查询相关
const query = reactive({
  name: '',
  typ: '',
  theme: '',
  keyword: '',
});

const searchOpt = ref([
  { type: 'input', label: '案例名称：', prop: 'name' },
  { type: 'input', label: '案例类型：', prop: 'typ' },
  { type: 'input', label: '案例主题：', prop: 'theme' },
  { type: 'input', label: '关键词：', prop: 'keyword' },
]);

const handleSearch = () => {
  page.index = 1; // 每次搜索重置页码
};

// 数据相关
const page = reactive({
  index: 1,
  size: 10,
  total: 0,
});

// Use the store
const caseStore = useCaseStore();
const tableData = computed(() => caseStore.cases);

// Fetch data when the component is mounted
onMounted(async () => {
  await caseStore.fetchCases();
});

// 过滤后的数据
const filteredData = computed(() => {
  return tableData.value.filter(item => {
    return (
        (!query.name || item.name.includes(query.name)) &&
        (!query.typ || item.typ.includes(query.typ)) &&
        (!query.theme || item.theme.includes(query.theme)) &&
        (!query.keyword || item.keyword.some(kw => kw.includes(query.keyword)))
    );
  });
});

// 分页改变时重新获取数据
const changePage = (val: number) => {
  page.index = val;
  caseStore.fetchCases();  // Trigger a fetch when the page changes
};

// 新增/编辑弹窗
const visible = ref(false);
const isEdit = ref(false);
const formData = reactive({
  id: 0,
  name: '',
  typ: '',
  theme: '',
  keyword: '',
});

const handleAdd = () => {
  // Reset form data for adding new case
  formData.name = '';
  formData.typ = '';
  formData.theme = '';
  formData.keyword = '';
  isEdit.value = false;
  visible.value = true;
};

const handleEdit = (row: Case) => {
  formData.id = row.id;
  formData.name = row.name;
  formData.typ = row.typ;
  formData.theme = row.theme;
  formData.keyword = row.keyword.join(', '); // Convert array to comma-separated string
  isEdit.value = true;
  visible.value = true;
};

const closeDialog = () => {
  visible.value = false;
};

const saveData = () => {
  // Check if any field is empty before saving
  if (!formData.name || !formData.typ || !formData.theme || !formData.keyword) {
    ElMessage.error('所有字段不能为空');
    return;
  }

  const newCase = {
    ...formData,
    keyword: formData.keyword.split(',').map(kw => kw.trim()), // Convert back to array
  };

  if (isEdit.value) {
    caseStore.editCase(newCase as Case);
    ElMessage.success('案例已更新');
  } else {
    caseStore.addCase(newCase as Case);
    ElMessage.success('新增成功');
  }

  closeDialog();
};

const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: [],
});

// 删除功能
const handleDelete = (id: number) => {
  caseStore.deleteCase(id);
  ElMessage({
    message: '删除成功',
    type: 'success',
  });
};

// 查看详情
const handleViewDetail = (id: number) => {
  router.push({ name: 'system-case-detail', params: { id: id.toString() } });
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.case-card {
  flex: 1 1 calc(33.333% - 20px);
  max-width: calc(33.333% - 20px);
  min-width: 280px;
}

.card-content p {
  margin: 5px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
}
</style>
