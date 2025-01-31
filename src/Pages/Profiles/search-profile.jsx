import './search-profile.css'
import { useState } from 'react'
import LocationFinder from '../../location'
export function Search_Profiles(){
        const [setUser] = useState('');
        const handleLocationChange = (location) => {
        try{
            setUser.Location(location);
        }catch(error){
            console.error('Ошибка при обновлении местоположения:', error);
        }
    };
    return(
        <div className="profile-search">
            <div className="main-container">
                <div className='flex-box-profiles'>
                    <div className="profession-search">
                        <label htmlFor="profession">Профессия:</label>
                        <input type="text"  placeholder='Введите профессию сотрудника'/>
                    </div>
                    <div className="location-search-profiles">
                        <label htmlFor="location">Предполагаемое место работы:</label>
                        <div className="location-container">
                            <LocationFinder onLocationChange={handleLocationChange}/>
                            <button className='submit-search-profiles'>Найти сотрудника</button>
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