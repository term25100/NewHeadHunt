import './UserRoom.css'
export function UserRoom({ activeTab }) {
  return (
    <div className="user-room-content">
      {activeTab === "vacancy" && (
        <div className='main-container-vac'>
          <div className="filters-user">
                    <h1>Размещено: <span>3</span> вакансии</h1>
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
                        <h1>Дата публикаций</h1>
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
                        <a href="#" className='add-vac'>Добавить вакансию</a>
                        <a href="#" >Архив</a>
                        <a href="#">Получать уведомления об откликах <span className='bell'>......</span></a>
                    </div>
                    <div className="vac-user-scrollblock">
                        <div className="vacation-wrap vac-active">
                            <div className="vacation-info">
                                <div className='flex_wrapper'>
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
                                    </div>
                                    <div className="delete-vac">
                                        <button></button>
                                        <div className="company-logo company1"></div>
                                    </div>
                                </div>
                                <div className="manual-buttons">
                                    <details className='description_about'>
                                    <summary>Подробнее</summary>
                                        <h3 className='title_vacation'>Описание вакансии:</h3>
                                        <p>Компания Диол ищет талантливого веб-дизайнера для работы над интересными проектами. Вам предстоит создавать современные, эстетичные и функциональные дизайн-решения для веб-платформ, collaborating с командой разработчиков и маркетологов.</p>
                                        <h3 className='requirement'>Требования:</h3>
                                        <ul>
                                            <li>Опыт работы в веб-дизайне от 3 лет (портфолио обязательно);</li>
                                            <li>Навыки работы с Figma, Adobe Photoshop, Illustrator;</li>
                                            <li>Понимание UI/UX-принципов, адаптивного дизайна;</li>
                                            <li>Умение работать с анимацией и микровзаимодействиями (плюс);</li>
                                            <li>Знание основ вёрстки (HTML/CSS) — будет преимуществом.</li>
                                        </ul>
                                        <h3 className='conditions'>Условия:</h3>
                                        <ul>
                                            <li>Гибкий график: возможность работать в офисе или удалённо;</li>
                                            <li>Проектная работа или полная занятость;</li>
                                            <li>Конкурентная зарплата (обсуждается по результатам собеседования);</li>
                                            <li>Интересные задачи и профессиональный рост.</li>
                                        </ul>
                                        <p className='finals'>Подходит для дизайнеров, готовых к сложным вызовам и созданию digital-продуктов высокого уровня. Откликайтесь! 🚀</p>
                                    </details>
                                    <a href="#" className='edit-button'>Редактировать <span className='img-edit'>.</span></a>
                                </div>
                                
                            </div>
                        </div>
                        <div className="vacation-wrap vac-active">
                            <div className="vacation-info">
                                <div className='flex_wrapper'>
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
                                    </div>
                                    <div className="delete-vac">
                                        <button></button>
                                        <div className="company-logo company1"></div>
                                    </div>
                                </div>
                                <div className="manual-buttons">
                                    <details className='description_about'>
                                    <summary>Подробнее</summary>
                                        <h3 className='title_vacation'>Описание вакансии:</h3>
                                        <p>Компания Диол ищет талантливого веб-дизайнера для работы над интересными проектами. Вам предстоит создавать современные, эстетичные и функциональные дизайн-решения для веб-платформ, collaborating с командой разработчиков и маркетологов.</p>
                                        <h3 className='requirement'>Требования:</h3>
                                        <ul>
                                            <li>Опыт работы в веб-дизайне от 3 лет (портфолио обязательно);</li>
                                            <li>Навыки работы с Figma, Adobe Photoshop, Illustrator;</li>
                                            <li>Понимание UI/UX-принципов, адаптивного дизайна;</li>
                                            <li>Умение работать с анимацией и микровзаимодействиями (плюс);</li>
                                            <li>Знание основ вёрстки (HTML/CSS) — будет преимуществом.</li>
                                        </ul>
                                        <h3 className='conditions'>Условия:</h3>
                                        <ul>
                                            <li>Гибкий график: возможность работать в офисе или удалённо;</li>
                                            <li>Проектная работа или полная занятость;</li>
                                            <li>Конкурентная зарплата (обсуждается по результатам собеседования);</li>
                                            <li>Интересные задачи и профессиональный рост.</li>
                                        </ul>
                                        <p className='finals'>Подходит для дизайнеров, готовых к сложным вызовам и созданию digital-продуктов высокого уровня. Откликайтесь! 🚀</p>
                                    </details>
                                    <a href="#" className='edit-button'>Редактировать <span className='img-edit'>.</span></a>
                                </div>
                                
                            </div>
                        </div>
                        <div className="vacation-wrap vac-active">
                            <div className="vacation-info">
                                <div className='flex_wrapper'>
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
                                    </div>
                                    <div className="delete-vac">
                                        <button></button>
                                        <div className="company-logo company1"></div>
                                    </div>
                                </div>
                                <div className="manual-buttons">
                                    <details className='description_about'>
                                    <summary>Подробнее</summary>
                                        <h3 className='title_vacation'>Описание вакансии:</h3>
                                        <p>Компания Диол ищет талантливого веб-дизайнера для работы над интересными проектами. Вам предстоит создавать современные, эстетичные и функциональные дизайн-решения для веб-платформ, collaborating с командой разработчиков и маркетологов.</p>
                                        <h3 className='requirement'>Требования:</h3>
                                        <ul>
                                            <li>Опыт работы в веб-дизайне от 3 лет (портфолио обязательно);</li>
                                            <li>Навыки работы с Figma, Adobe Photoshop, Illustrator;</li>
                                            <li>Понимание UI/UX-принципов, адаптивного дизайна;</li>
                                            <li>Умение работать с анимацией и микровзаимодействиями (плюс);</li>
                                            <li>Знание основ вёрстки (HTML/CSS) — будет преимуществом.</li>
                                        </ul>
                                        <h3 className='conditions'>Условия:</h3>
                                        <ul>
                                            <li>Гибкий график: возможность работать в офисе или удалённо;</li>
                                            <li>Проектная работа или полная занятость;</li>
                                            <li>Конкурентная зарплата (обсуждается по результатам собеседования);</li>
                                            <li>Интересные задачи и профессиональный рост.</li>
                                        </ul>
                                        <p className='finals'>Подходит для дизайнеров, готовых к сложным вызовам и созданию digital-продуктов высокого уровня. Откликайтесь! 🚀</p>
                                    </details>
                                    <a href="#" className='edit-button'>Редактировать <span className='img-edit'>.</span></a>
                                </div>
                                
                            </div>
                        </div>
                    </div>    
          </div>
        </div>
      )}

      {activeTab === "profiles" && (
        <div className='main-container'>
          <div className="manual-container">

          </div>
          <div className="content-container">
            
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