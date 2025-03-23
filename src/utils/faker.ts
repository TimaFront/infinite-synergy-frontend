import { User } from '../types/type';

export const generateUsers = (count = 1000000, startId = 0): User[] => {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
        users.push({
            id: startId + i,
            name: '',
            surname: '',
            age: 0,
            email: '',
        });
    }
    return users;
}