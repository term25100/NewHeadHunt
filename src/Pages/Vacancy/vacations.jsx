import './vacations.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function Vacations() {
    const [vacations, setVacations] = useState([]);
    const [favoriteVacations, setFavoriteVacations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchVacations = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/vacations-extract-all');
        if (response.data.success) {
          setVacations(response.data.vacations);
        } else {
          setError('Не удалось загрузить вакансии');
        }
      } catch (err) {
        console.error('Ошибка при загрузке вакансий:', err);
        setError('Ошибка при загрузке вакансий');
      } finally {
        setLoading(false);
      }
    };

    const handleLikeClick = async (vacationId) => {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        alert('Для добавления в избранное необходимо авторизоваться');
        return;
      }

      try {
        if (favoriteVacations.includes(vacationId)) {
          // Удаление из избранного
          const response = await axios.delete(`http://localhost:5000/api/favourites/${vacationId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.data.success) {
            setFavoriteVacations(prev => prev.filter(id => id !== vacationId));
            alert('Вакансия удалена из избранного');
          }
        } else {
          // Добавление в избранное
          const response = await axios.post(
            'http://localhost:5000/api/favourites',
            { vacation_id: vacationId },
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
        
          if (response.data.success) {
            setFavoriteVacations(prev => [...prev, vacationId]);
            alert('Вакансия добавлена в избранное');
          } else {
            alert(response.data.message || 'Ошибка при добавлении в избранное');
          }
        }
      } catch (error) {
        console.error('Ошибка:', error);
        if (error.response && error.response.status === 401) {
          alert('Сессия истекла. Пожалуйста, войдите снова.');
        } else {
          alert('Ошибка при обработке запроса');
        }
      }
    };

    // useEffect(() => {
    //   fetchVacations();
    // }, []);

    useEffect(() => {
      const fetchFavoriteVacations = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;
      
        try {
          const response = await axios.get('http://localhost:5000/api/favourites/vacations', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.data.success) {
            setFavoriteVacations(response.data.vacations.map(v => v.vacation_id)); // Сохраняем только ID
          }
        } catch (error) {
          console.error('Ошибка при загрузке избранных вакансий:', error);
        }
      };
    
      fetchVacations();
      fetchFavoriteVacations();
    }, []);

    return(
        <div className="main-vac">
            <div className="vac-container">
                <div className="filters">
                    <h1>Найдено: <span>{vacations.length}</span> вакансии</h1>
                    <div className="clear-filter">
                        <h2>Текущие фильтры</h2> 
                        <button>Сбросить фильтры</button>
                    </div>
                    <div className="added-filters">
                        <a href="#">Полный рабочий день</a>
                        <a href="#">Зарплата от 20000-40000</a>
                        <a href="#">Требуемый опыт 3 года</a>
                    </div>
                    <div className="salary">
                        <h2>Отфильтруй поиск</h2>
                        <h1>Диапазон зарплаты</h1>
                        <label htmlFor="salary-from">Зарплата от:</label>
                        <input type="text" name='salary-from' placeholder='Минимальная зарплата'/>

                        <label htmlFor="salary-to">Зарплата до:</label>
                        <input type="text" name='salary-to' placeholder='Максимальная зарплата'/>
                    </div>
                    <div className="jobs">
                        <h1>Тип работы</h1>
                        <div className="job-type">
                            <input className='checker' type="checkbox" />
                            <p>Постоянная <span>{'(4,124)'}</span></p>
                        </div>
                        <div className="job-type">
                            <input className='checker' type="checkbox" />
                            <p>Временная <span>{'(169)'}</span></p>
                        </div>
                        <div className="job-type">
                            <input className='checker' type="checkbox" />
                            <p>По контракту <span>{'(339)'}</span></p>
                        </div>
                        <div className="job-type">
                            <input className='checker' type="checkbox" />
                            <p>Полная занятость <span>{'(4,518)'}</span></p>
                        </div>
                        <div className="job-type">
                            <input className='checker' type="checkbox" />
                            <p>Подработки <span>{'(400)'}</span></p>
                        </div>
                        <div className="job-type">
                            <input className='checker' type="checkbox" />
                            <p>Работа на дому <span>{'(4,162)'}</span></p>
                        </div>
                    </div>
                    <div className="posted">
                        <h1>Размещено</h1>
                        <div className="post-type">
                            <input className='checker' type="checkbox" />
                            <p>Агенствами <span>{'(4,162)'}</span></p>
                        </div>
                        <div className="post-type">
                            <input className='checker' type="checkbox" />
                            <p>Работодателями <span>{'(9,162)'}</span></p>
                        </div>
                        <div className="post-type">
                            <input className='checker' type="checkbox" />
                            <p>Head / Hunt <span>{'(1,162)'}</span></p>
                        </div>
                    </div>
                    <div className="dont-show">
                        <h1>Не показывать</h1>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>Вакансии без зарплаты <span>{'(1,162)'}</span></p>
                        </div>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>Курсы <span>{'(1,162)'}</span></p>
                        </div>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>Волонтерство <span>{'(1,162)'}</span></p>
                        </div>
                    </div>
                    <div className="date">
                        <h1>Дата публикаций</h1>
                        <select className='select-custom' id='date_option'>
                            <option className='select-option' value="">Любая дата</option>
                            <option className='select-option' value="option1">Сегодня</option>
                            <option className='select-option' value="option2">Последние 3 дня</option>
                            <option className='select-option' value="option3">Последняя неделя</option>
                        </select>
                    </div>
                    <div className="specialty">
                        <h1>Специальность</h1>
                        <div className='scroll-view'>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>IT и телекоммуникации <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Инженерия <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Финансовые услуги <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Здравоохранение <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Туризм <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Бухгалтерия <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Транспортная логистика <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Администрирование <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Маркетинг и PR <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Научная работа <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Медиа <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Торговля <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Тренинг <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Энергетика <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Фармацевтика <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Производство <span>{'(1,162)'}</span></p>
                            </div>
                            <div className="specialty-type">
                                <input className='checker' type="checkbox" />
                                <p>Агенство недвижимости <span>{'(1,162)'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="vacations">
                    <div className="head-vac">
                        <a href="#">Получать уведомления <span className='bell'>.....</span></a>
                        <p>Отсортировано по дате</p>
                    </div>
                    <div className="vac-scrollblock">
                        {loading && <p>Загрузка вакансий...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && vacations.length === 0 && <p>Вакансий нет.</p>}
                        {!loading && !error && vacations.map(vacation => (
                          <div key={vacation.vacation_id} className="vacation-wrap vac-active">
                            <div className="vacation-info">
                              <div className='flex_wrapper'>
                                <div className="info">
                                  <p className="modificate">Продвинуто: Head / Hunt</p>
                                  <Link to={`/vacation/${vacation.vacation_id}`} className='name-vac'>
                                    {vacation.vacation_name}
                                  </Link>
                                  <p className='post-message'>
                                    Размещено <span id='date'>{new Date(vacation.posted).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span> 
                                  </p>
                                  <div className="descriptions">
                                    <div className="descript-flex">
                                      <div className="description">
                                        <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                        <p id='salary-description'>{vacation.salary_from} - {vacation.salary_to} рублей в месяц</p>
                                      </div>
                                      <div className="description">
                                        <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                        <p id='location-description'>{vacation.work_city}. {vacation.work_adress}</p>
                                      </div>
                                    </div>
                                    <div className="descript-flex">
                                      <div className="description">
                                        <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                                        <p id='time-description'>{vacation.work_type.join(', ')}</p>
                                      </div>
                                      <div className="description">
                                        <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                                        <p id='location-description'>{vacation.work_place.join(', ')}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>  
                                <div className="like">
                                  <button className={favoriteVacations.includes(vacation.vacation_id) ? 'liked' : 'unliked'} onClick={() => handleLikeClick(vacation.vacation_id)}></button>
                                  <div className="company-logo company1" style={{ backgroundImage: `url(data:image/png;base64,${vacation.company_image})` }}></div>
                                </div>
                                
                              </div>
                              <details className='description_about'>
                                <summary>Подробнее</summary>
                                <h3 className='title_vacation'>Описание вакансии:</h3>
                                <p>{vacation.work_description}</p>
                                <h3 className='requirement'>Требования:</h3>
                                <ul>
                                  {vacation.required_skills.map((skill, idx) => (
                                    <li key={idx}>{skill}</li>
                                  ))}
                                </ul>
                                <h3 className='conditions'>Условия:</h3>
                                <ul>
                                  {vacation.work_advantages && vacation.work_advantages.length > 0 ? (
                                    vacation.work_advantages.map((adv, idx) => <li key={idx}>{adv}</li>)
                                  ) : (
                                    <li>{vacation.advantages_describe}</li>
                                  )}
                                </ul>
                                <p className='finals'>Дополнительно: {vacation.additionally}</p>
                              </details>
                            </div>
                          </div>
                        ))}
                    </div>    
                </div>
            </div>
        </div>
        
    )
}