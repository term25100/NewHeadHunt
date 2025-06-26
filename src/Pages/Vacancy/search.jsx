import './search.css';
import { useState } from 'react';
import LocationFinder from '../../location';

export function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');

    const handleLocationChange = (location) => {
        try {
            setLocation(location);
        } catch(error) {
            console.error('Ошибка при обновлении местоположения:', error);
        }
    };

    const handleSearchClick = () => {
        onSearch(searchTerm, location);
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
                        />
                    </div>
                    <div className="location-search">
                        <label htmlFor="location">Место работы:</label>
                        <div className="location-container">
                            <LocationFinder onLocationChange={handleLocationChange}/>
                            <button 
                                className='submit-search' 
                                onClick={handleSearchClick}
                            >
                                Найти работу
                            </button>
                            <a href="#" className='search-link'>Вакансии {'➜'}</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='popular'>
                <p>Популярные запросы: </p> 
                <a href="#">Программист</a>
                <a href="#">Разнорабочий</a>
                <a href="#">Инжинер КИПиА</a>
                <a href="#">Системный администратор</a>
                <a href="#">Терапевт</a>
            </div>
        </div>
    )
}