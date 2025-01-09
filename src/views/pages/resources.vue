<template>
    <div>
        <!-- 标题 -->
        <h2>{{ caseName }} 案例资源</h2>
        <br />

        <!-- 资源列表 -->
        <el-table :data="resources" border-card>
            <el-table-column label="资源名称" prop="name">
                <template #default="{ row }">
                    <a :href="row.link" target="_blank">{{ row.name }}</a>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button @click="removeResource(row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 上传按钮 -->
        <div class="upload-button">
            <el-button type="primary" size="default">上传</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCaseStore } from '@/store/case';
import { onMounted } from 'vue';
import { ElTable, ElTableColumn, ElButton } from 'element-plus';

const caseStore = useCaseStore();

const resources = [
    { name: '案例报告.ppt', link: 'https://example.com/file1.ppt' },
    { name: '设计文档.docx', link: 'https://example.com/file2.docx' },
    { name: '数据表.csv', link: 'https://example.com/file3.csv' },
    { name: '产品计划.xlsx', link: 'https://example.com/file4.xlsx' }
];

const props = defineProps<{
    id: string;
}>();

onMounted(async () => {
    await caseStore.fetchCases();
});


const caseName = caseStore.cases[parseInt(props.id) - 1].name;

const removeResource = (resource: { name: string; link: string }) => {
    const index = resources.findIndex(r => r.name === resource.name);
    if (index !== -1) {
        resources.splice(index, 1);
    }
};
</script>

<style scoped>
.upload-button {
    margin-top: 20px;
    text-align: right;
}
</style>