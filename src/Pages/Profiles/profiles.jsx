import './profiles.css'
export function Profiles(){
    return(
        <div className="main-vac">
            <div className="vac-container">
                <div className="filters">
                    <h1>Найдено: <span>2059</span> сотрудников</h1>
                    <div className="clear-filter">
                        <h2>Текущие фильтры</h2> 
                        <button>Сбросить фильтры</button>
                    </div>
                    <div className="added-filters">
                        <a href="#">Полный рабочий день</a>
                        <a href="#">Зарплата от 50000-70000</a>
                        <a href="#">Требуемый опыт 3 года</a>
                    </div>
                    <div className="salary">
                        <h2>Отфильтруй поиск</h2>
                        <h1>Диапазон зарплаты</h1>
                        <label htmlFor="salary-from">Зарплата от:</label>
                        <input type="text" name='salary-from' placeholder='Минимальная ЗП сотруднику'/>

                        <label htmlFor="salary-to">Зарплата до:</label>
                        <input type="text" name='salary-to' placeholder='Максимальная ЗП сотруднику'/>
                    </div>
                    <div className="jobs">
                        <h1>Тип предлагаемой работы</h1>
                        <div className="job-type">
                            <input className='checker' type="checkbox" />
                            <p>Постоянная: <span>{'(4,124)'}</span></p>
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
                            <p>Биржами труда <span>{'(4,162)'}</span></p>
                        </div>
                        <div className="post-type">
                            <input className='checker' type="checkbox" />
                            <p>Сотрудниками <span>{'(9,162)'}</span></p>
                        </div>
                    </div>
                    <div className="dont-show">
                        <h1>Не показывать</h1>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>Сотрудников без опыта <span>{'(1,162)'}</span></p>
                        </div>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>Без образования <span>{'(1,162)'}</span></p>
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
                    <div className="experiance">
                        <h1>Опыт работы</h1>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>Без опыта работы <span>{'(1000)'}</span></p>
                        </div>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>От 1 года <span>{'(1,162)'}</span></p>
                        </div>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>От 3 лет <span>{'(7,162)'}</span></p>
                        </div>
                        <div className="dont-show-type">
                            <input className='checker' type="checkbox" />
                            <p>От 6 лет и выше <span>{'(3,162)'}</span></p>
                        </div>
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
                <div className="profiles">
                    <div className="head-profiles">
                        <a href="#">Получать уведомления <span className='bell'>.....</span></a>
                        <p>Отсортировано по дате</p>
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
                                    <div className="like">
                                        <button></button>
                                        <div className="profile-photo p1"></div>
                                    </div>
                                </div>
                                <details className='description_about'>
                                    <summary>Подробнее</summary>
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
                                </details>
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
                                    <div className="like">
                                        <button></button>
                                        <div className="profile-photo p1"></div>
                                    </div>
                                </div>
                                <details className='description_about'>
                                    <summary>Подробнее</summary>
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
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}