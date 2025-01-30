import './banner.css'
import React, {useState} from 'react';
import LocationFinder from '../../location'
export function Banner(){
        const [setUser] = useState('');
        const handleLocationChange = (location) => {
        setUser.Location(location);
    };
    return(
        <div className="container">
            <div className="heading">
                <div className="headings">
                    <h1>Люблю <br />П<span className='heart'>♡</span>недельник</h1>
                    <h2>Найди роботу которая нравится!</h2>
                </div>
                <div className="image">

                </div>
            </div>
            <div className="search-container">
                <div className="inputs">
                    <div className="profession">
                        <label htmlFor="profession">Ваша профессия:</label>
                        <input type="text" name='profession' placeholder='Введите профессию' />
                    </div>
                    <div className="location">
                        <label htmlFor="location">Место работы:</label>
                        <div className='line-search'>
                            {/* <input id='location' type="text" name='location' placeholder='Введите город' value={userLocation} />
                            <button id='get-location' className='scope'></button> */}
                            <LocationFinder onLocationChange={handleLocationChange} />
                            <button className='search-button'>Найти работу!</button>
                        </div>
                    </div>
                </div>
                <a href="#" className='job-link'>Вакансии {'>'}</a>
            </div>
            <p>Найдено <span>125,901</span> новых вакансий - <span>5,945</span> за последние сутки!</p>
        </div>
    )
}