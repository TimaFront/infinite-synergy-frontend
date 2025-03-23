import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "../types/type.ts";
import { generateUsers } from "../utils/faker.ts";

const userCache: Record<number, User[]> = {};
const totalUserCount = 1000000;
const batchSize = 500;

const initialState: UserState = {
    users: [],
    selectedUser: null,
    currentPage: 0,
    itemsPerPage: 100,
    totalUsers: totalUserCount,
};

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        selectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
        updateUser: (state, action: PayloadAction<User>) => {
            const { id, ...userData } = action.payload;
            const userIndex = state.users.findIndex(user => user.id === id);
            if (userIndex !== -1) {
                state.users[userIndex] = { ...state.users[userIndex], ...userData };
                if (state.selectedUser?.id === id) {
                    state.selectedUser = {
                        ...state.users[userIndex],
                    };
                }
            }

            const cacheKey = Math.floor(id / batchSize);
            if (userCache[cacheKey]) {
                const cacheIndex = id % batchSize;
                if (cacheIndex < userCache[cacheKey].length) {
                    userCache[cacheKey][cacheIndex] = { ...userCache[cacheKey][cacheIndex], ...userData };
                }
            }
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        // Загрузка пользователей по страницам
        loadUsersPage: (state) => {
            const startIdx = state.currentPage * state.itemsPerPage;
            const endIdx = startIdx + state.itemsPerPage;
            
            const startBatch = Math.floor(startIdx / batchSize);
            const endBatch = Math.floor((endIdx - 1) / batchSize);

            for (let batch = startBatch; batch <= endBatch; batch++) {
                if (!userCache[batch] && batch * batchSize < totalUserCount) {

                    const batchStartId = batch * batchSize;
                    const count = Math.min(batchSize, totalUserCount - batchStartId);
                    userCache[batch] = generateUsers(count, batchStartId);
                }
            }
            
            const usersNeeded: User[] = [];
            
            for (let i = startIdx; i < endIdx && i < totalUserCount; i++) {
                const batchIndex = Math.floor(i / batchSize);
                const indexInBatch = i % batchSize;
                
                if (userCache[batchIndex] && indexInBatch < userCache[batchIndex].length) {
                    usersNeeded.push(userCache[batchIndex][indexInBatch]);
                }
            }
            
            // Обновляем данные
            state.users = usersNeeded;
        }
    }
});

export const { 
    selectedUser: selectUser, 
    updateUser, 
    setCurrentPage,
    loadUsersPage
} = usersSlice.actions;
export default usersSlice.reducer;