import './header.css'
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
export function Header(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Проверяем, не истек ли токен (exp в секундах)
          if (decoded.exp * 1000 > Date.now()) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('authToken'); // опционально удаляем просроченный токен
          }
        } catch (e) {
          setIsLoggedIn(false);
          localStorage.removeItem('authToken'); // токен некорректный
        }
      } else {
        setIsLoggedIn(false);
      }
    }, []);

    const handleSignInClick = (e) => {
      e.preventDefault();
      if (isLoggedIn) {
        window.location.href = '/user_room'; // или путь к личному кабинету
      } else {
        window.location.href = '/sign_in';
      }
    };

    const handleFavoritesClick = (e) => {
      e.preventDefault();
      if (isLoggedIn) {
        navigate('/user_room?tab=favorites');
      } else {
        window.location.href = '/sign_in';
      }
    };

    const handleVacancyClick = (e) => {
      e.preventDefault();
      if (isLoggedIn) {
        navigate('/user_room?tab=vacancy');
      } else {
        window.location.href = '/sign_in';
      }
    };

    return(
        <div className="header">
            <div className='main-container'>
                <a href="/" className="logo">Head <span>Hunt</span></a>
                <nav className="menu">
                    <a href="/vacancy_list" className="menu-link">Вакансии</a>
                    <a href="/profiles" className="menu-link">Анкеты</a> 
                    <a href="#" className="menu-link">Развитие карьеры</a>
                    <div className="divide"></div>   
                    <a className="menu-link" onClick={handleVacancyClick}>Вы рекрут? <span className='special'>Разместите вакансию</span></a>
                    <a href="/sign_up" className="menu-reg">Регистрация</a>
                    <a className="menu-link" onClick={handleSignInClick}>Вход</a>
                    <a className="menu-link" onClick={handleFavoritesClick}>Избранное  <span className='img'></span></a>
                </nav>
            </div>
        </div>
    )
}