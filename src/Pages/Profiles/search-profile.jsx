import './search-profile.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LocationFinder from '../../location';

export function Search_Profiles({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [profileTitles, setProfileTitles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Получаем все названия профилей при монтировании компонента
    useEffect(() => {
        const fetchProfileTitles = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const url = token 
                    ? 'http://localhost:5000/api/profiles-extract-all/auth'
                    : 'http://localhost:5000/api/profiles-extract-all';

                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                
                const response = await axios.get(url, { headers });
                
                if (response.data.success) {
                    // Извлекаем уникальные названия профилей
                    const titles = [...new Set(
                        response.data.profiles.map(p => p.profile_name)
                    )];
                    setProfileTitles(titles);
                }
            } catch (error) {
                console.error('Ошибка при загрузке профилей:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileTitles();
    }, []);

    // Массив популярных запросов для профилей
    const popularQueries = [
        'Программист',
        'Разнорабочий',
        'Инженер КИПиА',
        'Системный администратор',
        'Терапевт'
    ];

    // Поиск подсказок при изменении текста
    useEffect(() => {
        if (searchTerm.length > 0 && profileTitles.length > 0) {
            const filtered = profileTitles.filter(title => 
                title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Показываем первые 5 результатов
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, profileTitles]);

    const handleLocationChange = (location) => {
        try {
            setLocation(location);
        } catch(error) {
            console.error('Ошибка при обновлении местоположения:', error);
        }
    };

    const handleSearchClick = () => {
        onSearch(searchTerm, location);
        setSuggestions([]); // Скрываем подсказки после поиска
    };

    // Обработчик клика по подсказке
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion);
        onSearch(suggestion, location);
        setSuggestions([]);
    };

    // Обработчик клика по популярному запросу
    const handlePopularClick = (query) => {
        setSearchTerm(query);
        onSearch(query, '');
    };

    return(
        <div className="profile-search">
            <div className="main-container">
                <div className='flex-box-profiles'>
                    <div className="profession-search">
                        <label htmlFor="profession">Профессия:</label>
                        <input 
                            type="text"  
                            placeholder='Введите профессию сотрудника' 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={loading}
                        />
                        {/* Выпадающий список подсказок */}
                        {suggestions.length > 0 && (
                            <ul className="suggestions-list">
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
                        {loading && <div className="loading-text">Загрузка данных...</div>}
                    </div>
                    <div className="location-search-profiles">
                        <label htmlFor="location">Предполагаемое место работы:</label>
                        <div className="location-container">
                            <LocationFinder onLocationChange={handleLocationChange}/>
                            <button 
                                className='submit-search-profiles' 
                                onClick={handleSearchClick}
                                disabled={loading}
                            >
                                {loading ? 'Загрузка...' : 'Найти сотрудника'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='popular'>
                <p>Популярные запросы: </p> 
                {popularQueries.map((query, index) => (
                    <a 
                        href="#" 
                        key={index}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePopularClick(query);
                        }}
                    >
                        {query}
                    </a>
                ))}
            </div>
        </div>
    )
}