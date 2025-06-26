import './search.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LocationFinder from '../../location';

export function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [vacationTitles, setVacationTitles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Получаем все названия вакансий при монтировании компонента
    useEffect(() => {
        const fetchVacationTitles = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const url = token 
                    ? 'http://localhost:5000/api/vacations-extract-all/auth'
                    : 'http://localhost:5000/api/vacations-extract-all';

                const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
                
                const response = await axios.get(url, { headers });
                
                if (response.data.success) {
                    // Извлекаем уникальные названия вакансий
                    const titles = [...new Set(
                        response.data.vacations.map(v => v.vacation_name)
                    )];
                    setVacationTitles(titles);
                }
            } catch (error) {
                console.error('Ошибка при загрузке вакансий:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVacationTitles();
    }, []);

    // Массив популярных запросов (можно оставить статичным или получать с сервера)
    const popularQueries = [
        'Программист',
        'Разнорабочий',
        'Инженер КИПиА',
        'Системный администратор',
        'Терапевт'
    ];

    // Поиск подсказок при изменении текста
    useEffect(() => {
        if (searchTerm.length > 0 && vacationTitles.length > 0) {
            const filtered = vacationTitles.filter(title => 
                title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Показываем первые 5 результатов
        } else {
            setSuggestions([]);
        }
    }, [searchTerm, vacationTitles]);

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
        <div className="vacancy-search">
            <div className="main-container">
                <div className='flex-box'>
                    <div className="profession-search">
                        <label htmlFor="profession">Профессия:</label>
                        <input 
                            type="text"  
                            placeholder='Введите желаемую работу' 
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
                    <div className="location-search">
                        <label htmlFor="location">Место работы:</label>
                        <div className="location-container">
                            <LocationFinder onLocationChange={handleLocationChange}/>
                            <button 
                                className='submit-search' 
                                onClick={handleSearchClick}
                                disabled={loading}
                            >
                                {loading ? 'Загрузка...' : 'Найти работу'}
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