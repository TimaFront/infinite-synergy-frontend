import React, { memo } from "react";
import { Provider } from "react-redux";
import { store } from './redux/store.ts'
import UserList from './components/userlist/UserList.tsx'
import UserEditor from './components/usereditor/UserEditor.tsx'
import './App.css'

const App: React.FC = () => {
  return (
    <Provider store={store}>
        <div className="app">
            <h1>
                Управление пользователями
            </h1>
            <div className="app-container">
                <UserList />
                <UserEditor />
            </div>
        </div>
    </Provider>
  )
}

export default memo(App);