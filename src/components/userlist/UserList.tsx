import React, { useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { selectUser, loadUsersPage, setCurrentPage } from '../../redux/usersSlice';
import { User } from '../../types/type';
import './UserList.scss';

const UserList: React.FC = () => {
    const dispatch = useAppDispatch();
    const { users, selectedUser, currentPage, itemsPerPage, totalUsers } = useAppSelector(state => state.users);
    const listRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        dispatch(loadUsersPage());
        
        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [dispatch, currentPage]);

    const handleUserClick = useCallback((user: User) => {
        dispatch(selectUser(user));
    }, [dispatch]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 0) {
            dispatch(setCurrentPage(currentPage - 1));
        }
    }, [currentPage, dispatch]);

    const handleNextPage = useCallback(() => {
        const totalPages = Math.ceil(totalUsers / itemsPerPage);
        if (currentPage < totalPages - 1) {
            dispatch(setCurrentPage(currentPage + 1));
        }
    }, [currentPage, totalUsers, itemsPerPage, dispatch]);

    return (
        <div className="user-list-container">
            <h2>Пользователи</h2>
            <div className="user-list" ref={listRef}>
                {users.length === 0 ? (
                    <div className="loading">Загрузка пользователей...</div>
                ) : (
                    users.map(user => (
                        <div
                            key={user.id}
                            className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                            onClick={() => handleUserClick(user)}
                        >
                            <h3>Пользователь #{user.id + 1}</h3>
                            <p className="user-id">ID: {user.id}</p>
                        </div>
                    ))
                )}
            </div>
            <div className="pagination-controls">
                <button 
                    className="pagination-button" 
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    &laquo; Предыдущая
                </button>
                <span className="pagination-info">
                    Страница {currentPage + 1} из {Math.ceil(totalUsers / itemsPerPage)}
                </span>
                <button 
                    className="pagination-button" 
                    onClick={handleNextPage}
                    disabled={currentPage >= Math.ceil(totalUsers / itemsPerPage) - 1}
                >
                    Следующая &raquo;
                </button>
            </div>
        </div>
    );
};

export default React.memo(UserList);