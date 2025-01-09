import {defineStore} from "pinia";
import {ref, reactive} from "vue";
import {fetchUserData} from "@/api";
import {User} from "@/types/user"

export const useUserStore = defineStore("user", () => {
    const tableData = ref<User[]>([]);
    const page = reactive({
        index: 1,
        size: 10,
        total: 0,
    })

    const getData = async () => {
        const res = await fetchUserData();
        tableData.value = res.data.list;
        page.total = res.data.pageTotal;
    }

    const changePage = async (val: number) => {
        page.index = val;
        await getData();
    }

    const addUser = (newUser: User) => {
        tableData.value.push(newUser);
        page.total += 1;
    }

    const updateUser = (updatedUser: User) => {
        const index = tableData.value.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
            tableData.value[index] = updatedUser;
        }
    }

    const deleteUser = (userId: number) => {
        tableData.value = tableData.value.filter(user => user.id !== userId);
        page.total -= 1;
    }

    return {
        tableData,
        page,
        getData,
        changePage,
        addUser,
        updateUser,
        deleteUser,
    }
})