import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchCaseData } from "@/api";
import { Case } from "@/types/case";

export const useCaseStore = defineStore("case", () => {
    const cases = ref<Case[]>([]);

    const generateId = () => {
        return Math.max(0, ...cases.value.map(item => item.id)) + 1;
    }

    const fetchCases = async () => {
        const res = await fetchCaseData();
        cases.value = res.data.list;
    }

    const addCase = (newCase: Case) => {
        console.log("addCase", newCase);
        cases.value.push({ id: generateId, ...newCase });
    }

    const editCase = (updatedCase: Case) => {
        const index = cases.value.findIndex(item => item.id === updatedCase.id);
        if (index !== -1) {
            cases.value[index] = { ...updatedCase };
        }
    };

    const deleteCase = (id: number) => {
        cases.value = cases.value.filter(item => item.id !== id);
    };

    return {
        cases,
        fetchCases,
        addCase,
        editCase,
        deleteCase,
    };
})