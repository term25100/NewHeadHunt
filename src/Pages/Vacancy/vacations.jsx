import './vacations.css'

export function Vacations(){
    return(
        <div className="main-vac">
            <div className="vac-container">
                <div className="filters">
                    <h1>Найдено: <span>4022</span> вакансии</h1>
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
                        <div className="vacation-wrap vac-active">
                            <div className="vacation-info">
                                <div className="info">
                                    <p className="modificate">Продвинуто: Head / Hunt</p>
                                    <a href="" className='name-vac'>Программист Java</a>
                                    <p className='post-message'>Размещено <span id='date'>19 декабря</span> компанией <span><a href="#" id='company'>Диол</a></span></p>
                                    <div className="descriptions">
                                        <div className="descript-flex">
                                            <div className="description">
                                                <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                <p id='salary-description'>70000 - 120000 рублей в месяц</p>
                                            </div>
                                            <div className="description">
                                                <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                <p id='location-description'>Тула. ул.Тургеневская улица, 48А</p>
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
                                        </div>
                                    </div>
                                    <p className='hidden-descript'></p>
                                    <button className='detailed'>Подробнее {'>'}</button>
                                </div>
                                <div className="like">
                                    <button></button>
                                    <div className="company-logo company1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="vacation-wrap vac-active">
                            <div className="vacation-info">
                                <div className="info">
                                    <p className="modificate">Продвинуто: Head / Hunt</p>
                                    <a href="" className='name-vac'>Веб-дизайнер</a>
                                    <p className='post-message'>Размещено <span id='date'>19 декабря</span> компанией <span><a href="#" id='company'>Диол</a></span></p>
                                    <div className="descriptions">
                                        <div className="descript-flex">
                                            <div className="description">
                                                <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                <p id='salary-description'>70000 - 120000 рублей в месяц</p>
                                            </div>
                                            <div className="description">
                                                <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                <p id='location-description'>Тула. ул.Тургеневская улица, 48А</p>
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
                                        </div>
                                    </div>
                                    <p className='hidden-descript'></p>
                                    <button className='detailed'>Подробнее {'>'}</button>
                                </div>
                                <div className="like">
                                    <button></button>
                                    <div className="company-logo company1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="vacation-wrap vac-active">
                            <div className="vacation-info">
                                <div className="info">
                                    <p className="modificate">Продвинуто: Head / Hunt</p>
                                    <a href="" className='name-vac'>Фронтенд разработчик</a>
                                    <p className='post-message'>Размещено <span id='date'>19 декабря</span> компанией <span><a href="#" id='company'>Диол</a></span></p>
                                    <div className="descriptions">
                                        <div className="descript-flex">
                                            <div className="description">
                                                <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                <p id='salary-description'>70000 - 120000 рублей в месяц</p>
                                            </div>
                                            <div className="description">
                                                <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                <p id='location-description'>Тула. ул.Тургеневская улица, 48А</p>
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
                                        </div>
                                    </div>
                                    <p className='hidden-descript'></p>
                                    <button className='detailed'>Подробнее {'>'}</button>
                                </div>
                                <div className="like">
                                    <button></button>
                                    <div className="company-logo company1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="vacation-wrap">
                            <div className="vacation-info">
                                <div className="info">
                                    <p className="modificate inactive">Продвинуто: Head / Hunt</p>
                                    <a href="" className='name-vac'>Бэкенд разработчик</a>
                                    <p className='post-message'>Размещено <span id='date'>19 декабря</span> компанией <span><a href="#" id='company'>Диол</a></span></p>
                                    <div className="descriptions">
                                        <div className="descript-flex">
                                            <div className="description">
                                                <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                <p id='salary-description'>70000 - 120000 рублей в месяц</p>
                                            </div>
                                            <div className="description">
                                                <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                <p id='location-description'>Тула. ул.Тургеневская улица, 48А</p>
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
                                        </div>
                                    </div>
                                    <p className='hidden-descript'></p>
                                    <button className='detailed'>Подробнее {'>'}</button>
                                </div>
                                <div className="like">
                                    <button></button>
                                    <div className="company-logo company1"></div>
                                </div>
                            </div>
                        </div>
                        <div className="vacation-wrap">
                            <div className="vacation-info">
                                <div className="info">
                                    <p className="modificate inactive">Продвинуто: Head / Hunt</p>
                                    <a href="" className='name-vac'>Старший кассир</a>
                                    <p className='post-message'>Размещено <span id='date'>17 декабря</span> компанией <span><a href="#" id='company'>Sber</a></span></p>
                                    <div className="descriptions">
                                        <div className="descript-flex">
                                            <div className="description">
                                                <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                <p id='salary-description'>70000 - 100000 рублей в месяц</p>
                                            </div>
                                            <div className="description">
                                                <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                <p id='location-description'>Тула. Красноармейский просп. 9</p>
                                            </div>
                                        </div>
                                        <div className="descript-flex">
                                            <div className="description">
                                                <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                                                <p id='time-description'>Полный рабочий день</p>
                                            </div>
                                            <div className="description">
                                                <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                                                <p id='location-description'>Офис</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className='hidden-descript'></p>
                                    <button className='detailed'>Подробнее {'>'}</button>
                                </div>
                                <div className="like">
                                    <button></button>
                                    <div className="company-logo company2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}