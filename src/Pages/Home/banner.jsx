import './banner.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocationFinder from '../../location'

export function Banner(){
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [vacationTitles, setVacationTitles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [vacancyStats, setVacancyStats] = useState({
        total: 0,
        lastDay: 0
    });
    const navigate = useNavigate();
    const [setUser] = useState('');

    useEffect(() => {
        const fetchVacationData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const url = token 
                    ? 'http://localhost:5000/api/vacations-extract-all/auth'
                    : 'http://localhost:5000/api/vacations-extract-all';

                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                
                const response = await axios.get(url, { headers });
                
                if (response.data.success) {
                    // Получаем названия вакансий
                    const titles = [...new Set(
                        response.data.vacations.map(v => v.vacation_name)
                    )];
                    setVacationTitles(titles);

                    // Рассчитываем статистику
                    const now = new Date();
                    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    
                    const lastDayVacancies = response.data.vacations.filter(vac => {
                        const vacDate = new Date(vac.posted);
                        return vacDate >= oneDayAgo;
                    });

                    setVacancyStats({
                        total: response.data.vacations.length,
                        lastDay: lastDayVacancies.length
                    });
                }
            } catch (error) {
                console.error('Ошибка при загрузке вакансий:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVacationData();
    }, []);

    useEffect(() => {
        if (searchTerm.length > 0 && vacationTitles.length > 0) {
            const filtered = vacationTitles.filter(title => 
                title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, vacationTitles]);

    const handleLocationChange = (location) => {
        setLocation(location);
    };

    const handleSearch = () => {
        navigate('/vacancy_list', { 
            state: { 
                profession: searchTerm,
                location: location
            } 
        });
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        navigate('/vacancy_list', { 
            state: { 
                profession: suggestion,
                location: location
            } 
        });
    };

    return(
        <div className="container">
            <div className="heading">
                <div className="headings">
                    <h1>Люблю <br />П<span className='heart'>♡</span>недельник</h1>
                    <h2>Найди роботу которая нравится!</h2>
                </div>
                <div className="image"></div>
            </div>
            <div className="search-container">
                <div className="inputs">
                    <div className="profession">
                        <label htmlFor="profession">Ваша профессия:</label>
                        <input 
                            type="text" 
                            name='profession' 
                            placeholder='Введите профессию' 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestions-dropdown">
                                {suggestions.map((suggestion, index) => (
                                    <li 
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="location">
                        <label htmlFor="location">Место работы:</label>
                        <div className='line-search'>
                            <LocationFinder onLocationChange={handleLocationChange} />
                            <button 
                                className='search-button' 
                                onClick={handleSearch}
                            >
                                Найти работу!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {loading ? (
                <p>Загрузка данных о вакансиях...</p>
            ) : (
                <p>Найдено <span>{vacancyStats.total.toLocaleString()}</span> новых вакансий - <span>{vacancyStats.lastDay.toLocaleString()}</span> за последние сутки!</p>
            )}
        </div>
    )
}