import './UserRoom.css'
import { Vacancy_Add } from './vacation_add';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export function UserRoom({ activeTab }) {
  const [showPopup, setShowPopup] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [userName, setUserName]=useState([]);
  const [loadingVacations, setLoadingVacations] = useState(false);
  const [error, setError] = useState('');

  // Функция загрузки вакансий пользователя с сервера
  const fetchVacations = async () => {
    setLoadingVacations(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setVacations([]);
        setLoadingVacations(false);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/vacations-extract', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setVacations(response.data.vacations);
        setUserName(response.data.user);
      } else {
        setError('Не удалось загрузить вакансии');
      }
    } catch (err) {
      console.error('Ошибка при загрузке вакансий:', err);
      setError('Ошибка при загрузке вакансий');
    } finally {
      setLoadingVacations(false);
    }
  };

  // Загружаем вакансии при открытии вкладки "vacancy" и при закрытии попапа добавления вакансии
  useEffect(() => {
    if (activeTab === 'vacancy') {
      fetchVacations();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!showPopup && activeTab === 'vacancy') {
      // Обновляем список вакансий после закрытия попапа (например, после добавления новой вакансии)
      fetchVacations();
    }
  }, [showPopup, activeTab]);

  // Фильтруем только активные вакансии
  const activeVacations = vacations.filter(vac => vac.active);

  return (
    <div className="user-room-content">
      {activeTab === "vacancy" && (
        <div className='main-container-vac'>
          <div className="filters-user">
            <h1>Размещено: <span>{activeVacations.length}</span> вакансии</h1>
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
              <h2>Фильтр</h2>
              <h1>Название вакансии</h1>
              <label htmlFor="name-vac">Наименование вакансии:</label>
              <input type="text" name='name-vac' placeholder='Введите название вакансии'/>
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
            <div className="date-user">
              <h1>Дата публикации</h1>
              <select className='select-custom' id='date_option'>
                <option className='select-option' value="">Любая дата</option>
                <option className='select-option' value="option1">Сегодня</option>
                <option className='select-option' value="option2">Последние 3 дня</option>
                <option className='select-option' value="option3">Последняя неделя</option>
              </select>
            </div>
          </div>
          <div className="vacations-user">
            <div className="head-vac">
              <a className='add-button' onClick={() => setShowPopup(true)}>Добавить вакансию</a>
              {showPopup && (
                <Vacancy_Add 
                  onClose={() => setShowPopup(false)}
                />
              )}
              <a href="#" >Архив вакансий</a>
              <a href="#">Получать уведомления об откликах <span className='bell'>......</span></a>
            </div>
            <div className="vac-user-scrollblock">
              {loadingVacations && <p>Загрузка вакансий...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loadingVacations && !error && activeVacations.length === 0 && <p>Активных вакансий нет.</p>}
              {!loadingVacations && !error && activeVacations.map(vacation => (
                <div key={vacation.vacation_id} className="vacation-wrap vac-active">
                  <div className="vacation-info">
                    <div className='flex_wrapper'>
                      <div className="info">
                        <p className="modificate">Продвинуто: Head / Hunt</p>
                        <Link to={`/vacation/${vacation.vacation_id}`} className='name-vac'>
                            {vacation.vacation_name}
                        </Link>
                        <p className='post-message'>
                          Размещено <span id='date'>{new Date(vacation.posted).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span> пользователем <span><a href="#" id='company'>{userName.name || 'Компания'}</a></span>
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
                              <p id='location-description'>Офис, работа на дому</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="delete-button">
                        <button /* Можно добавить обработчик удаления */></button>
                        <div className="company-logo company1" style={{ backgroundImage: `url(data:image/png;base64,${vacation.company_image})` }}></div>
                      </div>
                    </div>
                    <div className="manual-buttons">
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
                      <a href="#" className='edit-button'>Редактировать <span className='img-edit'>.</span></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>    
          </div>
        </div>
      )}

      {activeTab === "profiles" && (
        <div className='main-container-profiles'>
            <div className="profiles-user">
                    <div className="head-profiles">
                        <a href="#" className='add-button'>Добавить анкету</a>
                        <a href="#">Архивные анкеты</a>
                        <a href="#">Получать уведомления об откликах <span className='bell'>.....</span></a>
                    </div>
                    <div className="profiles-scrollblock">
                        <div className="profiles-wrap profile-active">
                            <div className="profile-info">
                                <div className='profile_wrapper'>
                                    <div className="info">
                                        <p className="modificate">Продвинуто: Head / Hunt</p>
                                        <a href="" className='name-profile'>Фронтенд разработчик</a>
                                        <p className='post-message'>Размещено <span id='date'>19 декабря</span> <span><a href="#" id='person'>Сергей А.Ф.</a></span></p>
                                        <div className="descriptions">
                                            <div className="descript-flex">
                                                <div className="description">
                                                    <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>100000 - 120000 рублей в месяц</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/graduation.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>Образование: <span id='graduate'>Высшее</span></p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/exp.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>Опыт работы: <span id='experiance'>3</span> года</p>
                                                </div>
                                            </div>
                                            <div className="descript-flex">
                                                <div className="description">
                                                    <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                                                    <p id='time-description'>Полный рабочий день</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                                                    <p id='location-description'>Офис, работа на дому</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                    <p id='location-description'>Место жительства: <span id='city'>Тула</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="delete-button">
                                        <button></button>
                                        <div className="profile-photo p1"></div>
                                    </div>
                                </div>
                                <div className="manual-buttons">
                                    <details className='description_about'>
                                        <summary>Подробнее</summary>
                                        <div className="details-content">
                                            <h3>Резюме:{}</h3>
                                            <ul>
                                                <li>ФИО: Аганов Сергей Федорович</li>
                                                <li>Местоположение: Тула (готов к гибридному формату: офис + удалённая работа)</li>
                                                <li>Занятость: Полный рабочий день</li>
                                                <li>Ожидаемая зарплата: 100 000 – 120 000 рублей</li>
                                            </ul>
                                            <h3>Навыки:</h3>
                                            <ul>
                                                <li>JavaScript (ES6+), TypeScript;</li>
                                                <li>React.js / Next.js (опыт от 3 лет);</li>
                                                <li>Vue.js / Angular — базовое владение;</li>
                                                <li>HTML5, CSS3 (Sass/SCSS, Tailwind CSS).</li>
                                                <li>Webpack, Vite;</li>
                                                <li>Git, GitHub/GitLab;</li>
                                                <li>Figma (адаптивная вёрстка по макетам).</li>
                                                <li>Знание REST API, GraphQL;</li>
                                                <li>Базовый бэкенд (Node.js, Express).</li>
                                            </ul>
                                            <h3>Опыт работы:</h3>
                                            <p>🚀 Frontend-разработчик (3 года)
                                            Название компании / Фриланс | 2021 – н.в.</p>
                                            <ul>
                                                <li>Разработка SPA-приложений на React;</li>
                                                <li>Оптимизация производительности (Lazy Loading, PWA);</li>
                                                <li>Взаимодействие с дизайнерами и бэкенд-разработчиками.</li>
                                            </ul>
                                            <h3>Образование:</h3>
                                            <p>Высшее образование:
                                            Тульский государственный университет / IT-специальность (2015–2020).<br />
                                            Курсы: «React Advanced» от Яндекс.Практикум; «Modern JavaScript» (Udemy).
                                            </p>
                                            <h3>Знание языков:</h3>
                                            <p>Русский (родной), Английский (B1)</p>
                                            <h3>Контакты:</h3>
                                            <ul>
                                                <li>Телефон: +7(354)343-43-33</li>
                                                <li>Email: sergeiAF@gmail.com</li>
                                                <li>GitHub: <a href='#'>https://github.com/sergeiAF/</a></li>
                                            </ul>
                                        </div>
                                    </details>
                                    <a href="#" className='edit-button'>Редактировать <span className='img-edit'>.</span></a>
                                </div>
                            </div>
                        </div>
                        <div className="profiles-wrap profile-active">
                            <div className="profile-info">
                                <div className='profile_wrapper'>
                                    <div className="info">
                                        <p className="modificate">Продвинуто: Head / Hunt</p>
                                        <a href="" className='name-profile'>Фронтенд разработчик</a>
                                        <p className='post-message'>Размещено <span id='date'>19 декабря</span> <span><a href="#" id='person'>Сергей А.Ф.</a></span></p>
                                        <div className="descriptions">
                                            <div className="descript-flex">
                                                <div className="description">
                                                    <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>100000 - 120000 рублей в месяц</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/graduation.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>Образование: <span id='graduate'>Высшее</span></p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/exp.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>Опыт работы: <span id='experiance'>3</span> года</p>
                                                </div>
                                            </div>
                                            <div className="descript-flex">
                                                <div className="description">
                                                    <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                                                    <p id='time-description'>Полный рабочий день</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                                                    <p id='location-description'>Офис, работа на дому</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                    <p id='location-description'>Место жительства: <span id='city'>Тула</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="delete-button">
                                        <button></button>
                                        <div className="profile-photo p1"></div>
                                    </div>
                                </div>
                                <div className="manual-buttons">
                                    <details className='description_about'>
                                        <summary>Подробнее</summary>
                                        <div className="details-content">
                                            <h3>Резюме:{}</h3>
                                            <ul>
                                                <li>ФИО: Аганов Сергей Федорович</li>
                                                <li>Местоположение: Тула (готов к гибридному формату: офис + удалённая работа)</li>
                                                <li>Занятость: Полный рабочий день</li>
                                                <li>Ожидаемая зарплата: 100 000 – 120 000 рублей</li>
                                            </ul>
                                            <h3>Навыки:</h3>
                                            <ul>
                                                <li>JavaScript (ES6+), TypeScript;</li>
                                                <li>React.js / Next.js (опыт от 3 лет);</li>
                                                <li>Vue.js / Angular — базовое владение;</li>
                                                <li>HTML5, CSS3 (Sass/SCSS, Tailwind CSS).</li>
                                                <li>Webpack, Vite;</li>
                                                <li>Git, GitHub/GitLab;</li>
                                                <li>Figma (адаптивная вёрстка по макетам).</li>
                                                <li>Знание REST API, GraphQL;</li>
                                                <li>Базовый бэкенд (Node.js, Express).</li>
                                            </ul>
                                            <h3>Опыт работы:</h3>
                                            <p>🚀 Frontend-разработчик (3 года)
                                            Название компании / Фриланс | 2021 – н.в.</p>
                                            <ul>
                                                <li>Разработка SPA-приложений на React;</li>
                                                <li>Оптимизация производительности (Lazy Loading, PWA);</li>
                                                <li>Взаимодействие с дизайнерами и бэкенд-разработчиками.</li>
                                            </ul>
                                            <h3>Образование:</h3>
                                            <p>Высшее образование:
                                            Тульский государственный университет / IT-специальность (2015–2020).<br />
                                            Курсы: «React Advanced» от Яндекс.Практикум; «Modern JavaScript» (Udemy).
                                            </p>
                                            <h3>Знание языков:</h3>
                                            <p>Русский (родной), Английский (B1)</p>
                                            <h3>Контакты:</h3>
                                            <ul>
                                                <li>Телефон: +7(354)343-43-33</li>
                                                <li>Email: sergeiAF@gmail.com</li>
                                                <li>GitHub: <a href='#'>https://github.com/sergeiAF/</a></li>
                                            </ul>
                                        </div>
                                    </details>
                                    <a href="#" className='edit-button'>Редактировать <span className='img-edit'>.</span></a>
                                </div>
                            </div>
                        </div>
                        <div className="profiles-wrap profile-active">
                            <div className="profile-info">
                                <div className='profile_wrapper'>
                                    <div className="info">
                                        <p className="modificate">Продвинуто: Head / Hunt</p>
                                        <a href="" className='name-profile'>Фронтенд разработчик</a>
                                        <p className='post-message'>Размещено <span id='date'>19 декабря</span> <span><a href="#" id='person'>Сергей А.Ф.</a></span></p>
                                        <div className="descriptions">
                                            <div className="descript-flex">
                                                <div className="description">
                                                    <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>100000 - 120000 рублей в месяц</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/graduation.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>Образование: <span id='graduate'>Высшее</span></p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/exp.png')} className='descript-image' alt="" />
                                                    <p id='salary-description'>Опыт работы: <span id='experiance'>3</span> года</p>
                                                </div>
                                            </div>
                                            <div className="descript-flex">
                                                <div className="description">
                                                    <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                                                    <p id='time-description'>Полный рабочий день</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                                                    <p id='location-description'>Офис, работа на дому</p>
                                                </div>
                                                <div className="description">
                                                    <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                    <p id='location-description'>Место жительства: <span id='city'>Тула</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="delete-button">
                                        <button></button>
                                        <div className="profile-photo p1"></div>
                                    </div>
                                </div>
                                <div className="manual-buttons">
                                    <details className='description_about'>
                                        <summary>Подробнее</summary>
                                        <div className="details-content">
                                            <h3>Резюме:{}</h3>
                                            <ul>
                                                <li>ФИО: Аганов Сергей Федорович</li>
                                                <li>Местоположение: Тула (готов к гибридному формату: офис + удалённая работа)</li>
                                                <li>Занятость: Полный рабочий день</li>
                                                <li>Ожидаемая зарплата: 100 000 – 120 000 рублей</li>
                                            </ul>
                                            <h3>Навыки:</h3>
                                            <ul>
                                                <li>JavaScript (ES6+), TypeScript;</li>
                                                <li>React.js / Next.js (опыт от 3 лет);</li>
                                                <li>Vue.js / Angular — базовое владение;</li>
                                                <li>HTML5, CSS3 (Sass/SCSS, Tailwind CSS).</li>
                                                <li>Webpack, Vite;</li>
                                                <li>Git, GitHub/GitLab;</li>
                                                <li>Figma (адаптивная вёрстка по макетам).</li>
                                                <li>Знание REST API, GraphQL;</li>
                                                <li>Базовый бэкенд (Node.js, Express).</li>
                                            </ul>
                                            <h3>Опыт работы:</h3>
                                            <p>🚀 Frontend-разработчик (3 года)
                                            Название компании / Фриланс | 2021 – н.в.</p>
                                            <ul>
                                                <li>Разработка SPA-приложений на React;</li>
                                                <li>Оптимизация производительности (Lazy Loading, PWA);</li>
                                                <li>Взаимодействие с дизайнерами и бэкенд-разработчиками.</li>
                                            </ul>
                                            <h3>Образование:</h3>
                                            <p>Высшее образование:
                                            Тульский государственный университет / IT-специальность (2015–2020).<br />
                                            Курсы: «React Advanced» от Яндекс.Практикум; «Modern JavaScript» (Udemy).
                                            </p>
                                            <h3>Знание языков:</h3>
                                            <p>Русский (родной), Английский (B1)</p>
                                            <h3>Контакты:</h3>
                                            <ul>
                                                <li>Телефон: +7(354)343-43-33</li>
                                                <li>Email: sergeiAF@gmail.com</li>
                                                <li>GitHub: <a href='#'>https://github.com/sergeiAF/</a></li>
                                            </ul>
                                        </div>
                                    </details>
                                    <a href="#" className='edit-button'>Редактировать <span className='img-edit'>.</span></a>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
      )}

      {activeTab === "responses" && (
        <div className='main-container'>
          <div className="manual-container">

          </div>
          <div className="content-container">
            
          </div>
        </div>
      )}

      {activeTab === "favorites" && (
        <div className='main-container'>
          <div className="manual-container">

          </div>
          <div className="content-container">
            
          </div>
        </div>
      )}
    </div>
  );
}
