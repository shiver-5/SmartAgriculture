<template>
<div>
    <h1>{{ caseName }}</h1>
</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCaseStore } from '@/store/case';

const route = useRoute();
const caseStore = useCaseStore();
const caseId = ref(route.params.id as string);

onMounted(async () => {
    await caseStore.fetchCases();
});

const caseName = caseStore.cases[parseInt(caseId.value) - 1].name;
</script>

<style scoped>
</style>