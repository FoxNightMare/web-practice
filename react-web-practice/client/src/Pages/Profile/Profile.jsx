import React from 'react';
import './Profile.css'; // Предположим, что у вас есть стили для форматирования даты
import { useUser } from '../../Componets/UserContext/UserContext';

const Profile = () => {
  const { user, isAuthenticated } = useUser(); // Добавим isAuthenticated из контекста пользователей

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
  };

  return (
    <div>
      <h1>Профиль пользователя</h1>
      {isAuthenticated ? (
        user ? (
          <div>
            <p>Полное имя: {user.fullname}</p>
            <p>День рождения: {formatDate(user.birth)}</p>
            <p>Телефон: {user.phone}</p>
            <p>Отдел: {user.depart}</p>
            <p>Рейтинг: {user.rating}</p>
          </div>
        ) : (
          <p>Данные пользователя загружаются...</p>
        )
      ) : (
        <p>Зайдите, чтобы увидеть данные</p>
      )}
    </div>
  );
};

export default Profile;