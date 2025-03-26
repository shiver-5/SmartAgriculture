<template>
    <div class="resource-container">
        <!-- 标题 -->
        <el-card shadow="hover">
            <h2 class="title">{{ caseName }} 课程资源</h2>

            <!-- 资源列表 -->
            <el-table :data="resources" border stripe style="width: 100%">
                <el-table-column label="资源名称" prop="name">
                    <template #default="{ row }">
                        <el-tooltip class="item" effect="dark" :content="row.name" placement="top">
                            <a :href="row.link" target="_blank" class="resource-link">{{ row.name }}</a>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="120" align="center">
                    <template #default="{ row }">
                        <el-button @click="removeResource(row)" type="danger" size="small" plain>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 上传按钮 -->
            <div class="upload-container">
                <el-upload action="#" multiple :show-file-list="false">
                    <el-button type="primary" size="default">上传资源</el-button>
                </el-upload>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useCaseStore } from '@/store/case';
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';

const caseStore = useCaseStore();
const resources = ref([
    { name: '案例报告.ppt', link: 'https://example.com/file1.ppt' },
    { name: '设计文档.docx', link: 'https://example.com/file2.docx' },
    { name: '数据表.csv', link: 'https://example.com/file3.csv' },
    { name: '产品计划.xlsx', link: 'https://example.com/file4.xlsx' }
]);

const props = defineProps<{ id: string }>();

onMounted(async () => {
    await caseStore.fetchCases();
});

const caseName = computed(() => caseStore.cases[parseInt(props.id) - 1]?.name || '未知课程');

const removeResource = (resource: { name: string }) => {
    resources.value = resources.value.filter(r => r.name !== resource.name);
    ElMessage.success('资源已删除');
};
</script>

<style scoped>
.resource-container {
    max-width: 800px;
    margin: auto;
}

.title {
    text-align: center;
    margin-bottom: 15px;
}

.resource-link {
    color: #409eff;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 250px;
}

.upload-container {
    margin-top: 20px;
    text-align: right;
}
</style>
