import React, { useState, useEffect } from 'react';

const LocationFinder = ({ onLocationChange }) => {
    const [location, setLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const apiKey = '5311be0a7af9488daa542dbdf44adc25'; 

    useEffect(() => {
        getLocation(); 
    }, []);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, handleError);
        } else {
            setErrorMessage('Геолокация не поддерживается вашим браузером.');
        }
    };

    const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;


        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&language=ru`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const city = data.results[0].components.city || data.results[0].components.town || data.results[0].components.village || 'Неизвестный город';
                    const locationString = `${city}`;
                    setLocation(locationString);
                    onLocationChange(city); 
                } else {
                    setLocation('Город не найден.');
                }
            })
            .catch(err => {
                console.error(err);
                setErrorMessage('Ошибка при получении данных о городе.');
            });
    };

    const handleError = () => {
        setErrorMessage('Не удалось получить местоположение.');
    };

    return (
        <div className='location-container'>
            <input id='location' type="text" name='location' placeholder='Введите город' value={location} onChange={(e) => {
                    setLocation(e.target.value);
                    onLocationChange(e.target.value);
                }}/>
            <button id='get-location' className='scope' onClick={getLocation}></button>
            {/* <button onClick={getLocation}></button>
            {location && <a href=''>{location}</a>} */}
        </div>
        
    );
};

export default LocationFinder;