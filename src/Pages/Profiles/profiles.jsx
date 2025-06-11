import './profiles.css';
import React, { useState, useEffect } from 'react';
import { InvitationPopup } from './invitation';
import axios from 'axios';

export function Profiles() {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        salaryFrom: '',
        salaryTo: '',
        workTypes: [],
        experience: []
    });

    useEffect(() => {
        async function fetchProfiles() {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/profiles-extract-all');
                if (response.data.success) {
                    setProfiles(response.data.profiles);
                } else {
                    setError('Ошибка загрузки анкет');
                }
            } catch (err) {
                setError('Ошибка соединения с сервером');
            } finally {
                setLoading(false);
            }
        }
        fetchProfiles();
    }, []);

    const handleInviteClick = (candidate) => {
        setSelectedCandidate(candidate);
        setShowPopup(true);
    };

    const handleSendInvitation = (invitationData) => {
        console.log('Отправка приглашения:', invitationData);
        setShowPopup(false);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    if (loading) return <div className="loading">Загрузка анкет...</div>;
    if (error) return <div className="error">{error}</div>;

    return(
        <div className="main-vac">
            <div className="profiles-container">
                <div className="filters">
                    <h1>Найдено: <span>{profiles.length}</span> сотрудников</h1>
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
                        {profiles.map(profile => {
                            const user = profile.user || {};
                            const salaryRange = `${profile.salary_from ? profile.salary_from.toLocaleString() : '—'} - ${profile.salary_to ? profile.salary_to.toLocaleString() : '—'}`;
                            const experience = profile.work_experience?.[0] || 'Не указано';
                            return (
                                <div className="profiles-wrap profile-active" key={profile.profile_id}>
                                    <div className="profile-info">
                                        <div className='profile_wrapper'>
                                            <div className="info">
                                                <p className="modificate">Продвинуто: Head / Hunt</p>
                                                <a href={`/profile/${profile.profile_id}`} className='name-profile'>{profile.profile_name}</a>
                                                <p className='post-message'>
                                                    Размещено <span id='date'>{formatDate(profile.posted)}</span>{' '}
                                                    <span>пользователем: <a href="#" id='person'>{user.name || 'Неизвестный пользователь'}</a></span>
                                                </p>
                                                <div className="descriptions">
                                                    <div className="descript-flex">
                                                        <div className="description">
                                                            <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                                                            <p id='salary-description'>{salaryRange} рублей в месяц</p>
                                                        </div>
                                                        <div className="description">
                                                            <img src={require('../Images/Icons/graduation.png')} className='descript-image' alt="" />
                                                            <p id='salary-description'>Образование: <span id='graduate'>{profile.educations?.[0] || 'Не указано'}</span></p>
                                                        </div>
                                                        <div className="description">
                                                            <img src={require('../Images/Icons/exp.png')} className='descript-image' alt="" />
                                                            <p id='salary-description'>Опыт работы: <span id='experiance'>{experience}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="descript-flex">
                                                        <div className="description">
                                                            <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                                                            <p id='time-description'>{profile.work_time?.join(', ') || 'Не указано'}</p>
                                                        </div>
                                                        <div className="description">
                                                            <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                                                            <p id='location-description'>{profile.work_place?.join(', ') || 'Не указано'}</p>
                                                        </div>
                                                        <div className="description">
                                                            <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                                                            <p id='location-description'>Место жительства: <span id='city'>{profile.work_city || 'Не указано'}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="like-profile">
                                                <button></button>
                                                <div className="profile-photo p1" style={{
                                                    backgroundImage: profile.profile_image ? `url(data:image/png;base64,${profile.profile_image})` : 'none'
                                                }}></div>
                                            </div>
                                        </div>
                                        <details className='description_about'>
                                            <summary>Подробнее</summary>
                                            <div className="details-content">
                                                <h3>Резюме:</h3>
                                                <ul>
                                                    <li>ФИО: {user.name || 'Не указано'}</li>
                                                    <li>Местоположение: {profile.work_city || 'Не указано'}</li>
                                                    <li>Занятость: {profile.work_time?.join(', ') || 'Не указано'}</li>
                                                    <li>Ожидаемая зарплата: {salaryRange} рублей</li>
                                                </ul>
                                                
                                                {profile.skills?.length > 0 && (
                                                    <>
                                                        <h3>Навыки:</h3>
                                                        <ul>
                                                            {profile.skills.map((skill, index) => (
                                                                <li key={index}>{skill}</li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}

                                                {profile.work_experience?.length > 0 && (
                                                    <>
                                                        <h3>Опыт работы:</h3>
                                                        {profile.work_experience.map((exp, index) => (
                                                            <p key={index}>{exp}</p>
                                                        ))}
                                                    </>
                                                )}

                                                {profile.educations?.length > 0 && (
                                                    <>
                                                        <h3>Образование:</h3>
                                                        {profile.educations.map((edu, index) => (
                                                            <p key={index}>{edu}</p>
                                                        ))}
                                                    </>
                                                )}

                                                {profile.languages_knowledge?.length > 0 && (
                                                    <>
                                                        <h3>Знание языков:</h3>
                                                        <ul>
                                                            {profile.languages_knowledge.map((lang, index) => (
                                                                <li key={index}>{lang}</li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}

                                                <h3>Контакты:</h3>
                                                <ul>
                                                    <li>Email: {user.email || 'Не указано'}</li>
                                                    <li>Телефон: {user.phone || 'Не указано'}</li>
                                                </ul>
                                                
                                                <a  
                                                    className='full-button' 
                                                    onClick={() => handleInviteClick({
                                                        id: profile.profile_id,
                                                        user_id: user.user_id,
                                                        name: user.name,
                                                        position: profile.profile_name
                                                    })}
                                                >
                                                    Пригласить на работу
                                                </a>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showPopup && selectedCandidate && (
                <InvitationPopup
                candidate={selectedCandidate}
                onClose={() => setShowPopup(false)}
                onSend={handleSendInvitation}
                />
            )}
        </div>
        
    );
}