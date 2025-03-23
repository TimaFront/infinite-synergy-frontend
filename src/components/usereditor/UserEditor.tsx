import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { updateUser } from '../../redux/usersSlice';
import './UserEditor.scss';

interface FormData {
    name: string;
    surname: string;
    age: number | string;
    email: string;
}

const UserEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const selectedUser = useAppSelector(state => state.users.selectedUser);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        surname: '',
        age: '',
        email: ''
    });

    useEffect(() => {
        if (selectedUser) {
            setFormData({
                name: selectedUser.name || '',
                surname: selectedUser.surname || '',
                age: selectedUser.age || '',
                email: selectedUser.email || ''
            });
        }
    }, [selectedUser]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? (value === '' ? '' : parseInt(value, 10) || 0) : value
        }));
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            dispatch(updateUser({
                id: selectedUser.id,
                name: formData.name,
                surname: formData.surname,
                age: typeof formData.age === 'string' ? parseInt(formData.age, 10) || 0 : formData.age,
                email: formData.email
            }));
        }
    }, [dispatch, formData, selectedUser]);

    if (!selectedUser) {
        return (
            <div className="user-editor">
                <h2>Редактор пользователя</h2>
                <p>Выберите пользователя для редактирования</p>
            </div>
        );
    }

    return (
        <div className="user-editor">
            <h2>Редактирование пользователя {selectedUser.id + 1}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Имя</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="surname">Фамилия</label>
                    <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="age">Возраст</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        min="1"
                        max="120"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="save-button">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default React.memo(UserEditor);