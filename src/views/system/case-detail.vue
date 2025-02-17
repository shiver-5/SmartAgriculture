<template>
    <div>
        <el-tabs v-model="activeName" class="demo-tabs" stretch type="border-card">
            <el-tab-pane label="资源" name="first">
                <Resources :id="caseId" />
            </el-tab-pane>
            <el-tab-pane label="讨论" name="second">
                <Discuss :id="caseId"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Resources from '../pages/resources.vue';
import Discuss from '../pages/discuss.vue';
import { useRoute } from 'vue-router';

const activeName = ref('first')

const route = useRoute();
const caseId = ref(route.params.id as string);

watch(
  () => route.params.id,
  (newId) => {
    console.log("Route ID changed: ", newId);
    caseId.value = newId as string;
  }
);
</script>

<style scoped></style>