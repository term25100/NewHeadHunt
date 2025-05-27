import './vacation.css'

export function Vacation_Body(){
    return (
        <div className='frame-container'>
            <div className="vac-banner">

            </div>
            <div className="vac-info-container">
                <div className="work-type-container">
                    <h1>Зарплата</h1>
                    <div className='salary-container'>
                        <div className="salary-flex">
                        <label htmlFor="salary-from">Зарплата от:</label>
                        <p name='salary-from'>70000 <span className='currency'>....</span></p>
                        </div>
                        <div className="salary-flex">
                            <label htmlFor="salary-to">Зарплата от:</label>
                            <p name='salary-to'>120000 <span className='currency'>....</span></p>
                        </div>
                        <div className="salary-col">
                            <label htmlFor="salary-mid">Средняя зарплата для подобных вакансий:</label>
                            <p name='salary-mid'>105000 <span className='currency'>....</span></p>
                        </div>
                    </div>
                    <h1>Варианты работы</h1>
                    <div className="work-type">
                        <ul>
                            <li>Работа в офисе</li>
                            <li>Работа удаленно</li>
                        </ul>
                    </div>
                    <h1>Про удаленную работу</h1>
                    <div className='work-type-description'>
                        <p>Наша компания эффективно организует работу с удалёнными специалистами через Microsoft Teams: регулярные онлайн-встречи, чёткие задачи в чатах и общие файлы для прозрачности. Мы поддерживаем постоянную связь, контролируем прогресс и обеспечиваем комфортные условия для продуктивной совместной работы.</p>
                    </div>
                    
                </div>
                <div className="main-info-container">
                    <div className="location-data">
                        <div className="loc-data">
                            <h1>Местоположение</h1>
                            <div className='flex-loc'>
                                <div>
                                    <div className='flex-location'>
                                        <label htmlFor="locate-reg">Область: </label>
                                        <p name="locate-reg">Тульская</p>
                                    </div>
                                    <div className='flex-location'>
                                        <label htmlFor="locate-city">Город: </label>
                                        <p name="locate-city">Тула</p>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex-location'>
                                        <label htmlFor="locate-adress">Адрес: </label>
                                        <p name="locate-adress">ул. Тургеневская, 48А</p>
                                    </div>
                                    <div className='flex-location'>
                                        <label htmlFor="locate-index">Индекс: </label>
                                        <p name="locate-index">300041</p>
                                    </div>
                                </div>
                            </div>
                            <details>
                                <summary className='summary-map'>Посмотреть на карте</summary>
                                <div>
                                    <iframe className='map-location' src="https://yandex.ru/map-widget/v1/?ll=37.612418%2C54.185434&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgoxNDg5NDY4OTAwEkHQoNC-0YHRgdC40Y8sINCi0YPQu9CwLCDQotGD0YDQs9C10L3QtdCy0YHQutCw0Y8g0YPQu9C40YbQsCwgNDjQkCIKDRBzFkIV6L1YQg%2C%2C&z=17.18" width="560" height="400" frameborder="1" allowfullscreen="true" ></iframe>
                                </div>
                            </details>
                        </div>
                        <div className="description-vac">
                            <h1>Описание вакансии</h1>
                            <p id='vac-description'>Компания Диол ищет талантливого веб-дизайнера для работы над интересными проектами. Вам предстоит создавать современные, эстетичные и функциональные дизайн-решения для веб-платформ, collaborating с командой разработчиков и маркетологов.</p>
                            <h1>Требования:</h1>
                            <ul>
                                <li>Опыт работы в веб-дизайне от 3 лет (портфолио обязательно);</li>
                                <li>Навыки работы с Figma, Adobe Photoshop, Illustrator;</li>
                                <li>Понимание UI/UX-принципов, адаптивного дизайна;</li>
                                <li>Умение работать с анимацией и микровзаимодействиями (плюс);</li>
                                <li>Знание основ вёрстки (HTML/CSS) — будет преимуществом.</li>
                            </ul>
                        </div>
                    </div>
                    <div className="adjust-data">
                        <div className="contact-data">
                            <h1>Контакты</h1>
                            <div className='flex-contact'>
                                <label htmlFor="contact-email">Электронная почта: </label>
                                <p name="contact-email">info@diol-it.ru</p>
                            </div>
                            <div className='flex-contact'>
                                <label htmlFor="contact-phone">Электронная почта: </label>
                                <p name="contact-phone">+7 495 132-03-02</p>
                            </div>
                            <div className='flex-contact'>
                                <label htmlFor="contact-site">Сайт компании: </label>
                                <p name="contact-site">+7 495 132-03-02</p>
                            </div>
                        </div>
                        <div className="adjust-descriptions">
                            <h1>Преимущества работы в компании</h1>
                            <p>Работа в компании «Диол» — это не просто должность, а возможность стать частью сильной команды, где ценят каждого сотрудника. Мы предлагаем не только интересные задачи и профессиональный рост, но и комфортные условия труда, включая социальные гарантии.</p>
                            <h1>Преимущества:</h1>
                            <ul>
                                <li>Гибкий график: возможность работать в офисе или удалённо;</li>
                                <li>Расширенное страхование ДМС;</li>
                                <li>Официальное трудоустройство;</li>
                                <li>Проектная работа или полная занятость;</li>
                                <li>Конкурентная зарплата (обсуждается по результатам собеседования);</li>
                                <li>Интересные задачи и профессиональный рост.</li>
                            </ul>
                            <h1>Дополнительно</h1>
                            <p className='finals'>Подходит для дизайнеров, готовых к сложным вызовам и созданию digital-продуктов высокого уровня. Откликайтесь! 🚀</p>
                            <a href="/vacation" className='response-button'>Откликнуться на вакансию</a>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}