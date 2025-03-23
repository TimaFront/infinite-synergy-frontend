export interface User {
    id: number;
    name: string;
    surname: string;
    age: number;
    email: string;
}

export interface UserState {
    users: User[];
    selectedUser: User | null;
    currentPage: number;
    itemsPerPage: number;
    totalUsers: number;
}