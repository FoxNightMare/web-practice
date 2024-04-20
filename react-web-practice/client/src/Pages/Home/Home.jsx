import React, { useState, useEffect } from 'react';
import './Home.css';
import { useUser } from '../../Componets/UserContext/UserContext';
import axios from 'axios';

const Home = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState([]);
  const [ratingUpdated, setRatingUpdated] = useState(false);
  const [ratedUsers, setRatedUsers] = useState({});
  const [highestRatedUser, setHighestRatedUser] = useState(null); // Состояние для хранения пользователя с самым высоким рейтингом
  const isLoggedIn = !!user;

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', options);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/usersOnDeck');
        const usersOnDeck = response.data;
        setUserData(usersOnDeck);
        // Найдем пользователя с самым высоким рейтингом
        const highestRated = usersOnDeck.reduce((prev, current) => (prev.rating > current.rating ? prev : current));
        setHighestRatedUser(highestRated);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, [ratingUpdated]);

  const updateRating = async (fullname, action) => {
    if (ratedUsers[fullname] === action) {
      console.log('Вы уже ' + (action === 'add' ? 'повысили' : 'понизили') + ' рейтинг для этого пользователя.');
      return;
    }

    try {
      await axios.post(`http://localhost:4000/${action}Rating`, {
        fullname: fullname,
      });
      setRatingUpdated(!ratingUpdated);
      setRatedUsers({ ...ratedUsers, [fullname]: action });
    } catch (error) {
      console.error('Ошибка при обновлении рейтинга:', error);
    }
  };

  return (
    <div>
      {!isLoggedIn && <h1>Войдите в систему, чтобы увидеть рейтинг!</h1>}
      {isLoggedIn && (
        <div>
          <div className="buttons">
            {userData.map((userItem) => (
              <div key={userItem.fullname} className={`card ${userItem === highestRatedUser ? 'highest-rated' : ''}`}>
                <h2>{userItem.fullname}</h2>
                <p>Дата рождения: {formatDate(userItem.birth)}</p>
                <p>Отдел: {userItem.depart}</p>
                <p>Рейтинг: {userItem.rating}</p>
                {userItem.fullname !== user.fullname && (
                  <div>
                    <button onClick={() => updateRating(userItem.fullname, 'add')}>+1</button>
                    <button onClick={() => updateRating(userItem.fullname, 'remove')}>-1</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;