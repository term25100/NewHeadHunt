import './light_header.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
export function Light_Header({activeTab, onTabChange}){
    const handleClick = (e, tab) => {
        e.preventDefault();
        onTabChange(tab);
    }
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:5000/api/user', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(response.data);
          } catch (err) {
            console.error('Ошибка загрузки данных:', err);
            // Перенаправляем на страницу входа при ошибке
            window.location.href = '/sign_in';
          } finally {
            setLoading(false);
          }
        };

        fetchUserData();
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.location.href = '/';
    };
    return(
        <div className="header">
            <div className='main-container'>
                <a href="/" className="logo">Head <span>Hunt</span></a>
                <nav className="menu">
                    <a href="" 
                    className={`menu-link-room ${activeTab === "vacancy" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "vacancy")}>Вакансии</a>

                    <a href="" 
                    className={`menu-link-room ${activeTab === "profiles" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "profiles")}>Анкеты</a> 

                    <a href="" 
                    className={`menu-link-room ${activeTab === "responses" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "responses")}>Отклики</a> 

                    <a href="" 
                    className={`menu-link-room ${activeTab === "favorites" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "favorites")}>Избранное  <span className='img'></span></a>
                    {userData &&(
                        <div>
                            <a href="" 
                            className={`menu-link-room ${activeTab === "user_menu" ? "active" : ""}`}
                            onClick={(e) => handleClick(e, "user_menu")}>{userData.name}</a> 
                        </div>
                    )}
                    <a onClick={handleLogout} className="menu-link-room">Выход</a>    
                </nav>
            </div>
        </div>
    )
}