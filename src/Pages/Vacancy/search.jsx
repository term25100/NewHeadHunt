import './search.css'

export function Search(){
    return(
        <div className="vacancy-search">
            <div className="main-container">
                <div className='flex-box'>
                    <div className="profession-search">
                        <label htmlFor="profession">Профессия:</label>
                        <input type="text"  placeholder='Введите желаемую работу'/>
                    </div>
                    <div className="location-search">
                        <label htmlFor="location">Место работы:</label>
                        <div className="location-container">
                            <input type="text" placeholder='Введите город'/>
                            <button className='search-scope'></button>
                            <button className='submit-search'>Найти работу</button>
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