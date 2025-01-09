<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom
          :columns="columns"
          :tableData="userStore.tableData"
          :total="userStore.page.total"
          :viewFunc="handleView"
          :delFunc="handleDelete"
          :page-change="changePage"
          :editFunc="handleEdit"
      >
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>
      </TableCustom>
    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData" />
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData"></TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import { useUserStore } from '@/store/user';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import TableEdit from "@/components/table-edit.vue";

// Pinia store
const userStore = useUserStore();
userStore.getData();

// Query and search options
const query = reactive({
  name: '',
});

const searchOpt = ref<FormOptionList[]>([
  { type: 'input', label: '用户名：', prop: 'name' },
]);

const handleSearch = () => {
  changePage(1);
};

// Columns for the table
const columns = ref([
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'name', label: '用户名' },
  { prop: 'phone', label: '手机号' },
  { prop: 'role', label: '角色' },
  { prop: 'operator', label: '操作', width: 250 },
]);

// Page change handler
const changePage = (val: number) => {
  userStore.changePage(val);
};

// Dialog for adding/editing
const options = ref<FormOption>({
  labelWidth: '100px',
  span: 12,
  list: [
    { type: 'input', label: '用户名', prop: 'name', required: true },
    { type: 'input', label: '手机号', prop: 'phone', required: true },
    { type: 'input', label: '密码', prop: 'password', required: true },
    { type: 'input', label: '邮箱', prop: 'email', required: true },
    { type: 'input', label: '角色', prop: 'role', required: true },
  ]
});

const visible = ref(false);
const isEdit = ref(false);
const rowData = ref<User>({
  id: 0,
  name: '',
  password: '',
  email: '',
  phone: '',
  role: '',
  date: '',
});

const handleEdit = (row: User) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};

type EditedUser = {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

const updateData = (updatedData: EditedUser) => {
  rowData.value = { id: userStore.tableData.length + 1,...updatedData, date: new Date().toISOString() };
  if (isEdit.value) {
    userStore.updateUser(rowData.value);
  } else {
    userStore.addUser(rowData.value);
  }
  closeDialog();
};

// Close the dialog
const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
};

// View details dialog
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: []
});

const handleView = (row: User) => {
  viewData.value.row = { ...row };
  viewData.value.list = [
    { prop: 'id', label: '用户ID' },
    { prop: 'name', label: '用户名' },
    { prop: 'password', label: '密码' },
    { prop: 'email', label: '邮箱' },
    { prop: 'phone', label: '电话' },
    { prop: 'role', label: '角色' },
    { prop: 'date', label: '注册日期' },
  ];
  visible1.value = true;
};

// Delete user
const handleDelete = (row: User) => {
  userStore.deleteUser(row.id);
  ElMessage.success('删除成功');
};
</script>
