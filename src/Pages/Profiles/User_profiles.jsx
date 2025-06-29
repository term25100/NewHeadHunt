import './profiles.css';
import React, { useState, useEffect, useCallback } from 'react';
import { InvitationPopup } from './invitation';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export function User_Profiles({ searchParams }) {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    
    // Фильтры
    const [salaryFrom, setSalaryFrom] = useState('');
    const [salaryTo, setSalaryTo] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [workTypeFilters, setWorkTypeFilters] = useState({
        permanent: false,
        temporary: false,
        contract: false,
        fullTime: false,
        partTime: false,
        remote: false
    });
    const [postedByFilters, setPostedByFilters] = useState({
        agencies: false,
        employers: false,
        headhunt: false
    });
    const [hideFilters, setHideFilters] = useState({
        noExperience: false,
        noEducation: false
    });
    const [experienceFilters, setExperienceFilters] = useState({
        noExperience: false,
        oneYear: false,
        threeYears: false,
        sixYears: false
    });
    const [specialtyFilters, setSpecialtyFilters] = useState({});

    const fetchProfiles = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('authToken');
            const url = token 
                ? `http://localhost:5000/api/profiles-by-user/${userId}/auth`
                : `http://localhost:5000/api/profiles-by-user/${userId}`;

            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await axios.get(url, { headers });
            
            if (response.data.success) {
                const normalizedProfiles = response.data.profiles.map(profile => ({
                    ...profile,
                    user: profile.user || null,
                    isFavourite: profile.isFavourite || false
                }));
                setProfiles(normalizedProfiles);
                applyFilters(normalizedProfiles);
                
                // Устанавливаем информацию о пользователе
                if (response.data.user) {
                    setUserInfo(response.data.user);
                }
            } else {
                setError(response.data.message || 'Ошибка загрузки анкет');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchProfiles();
        }
    }, [userId, fetchProfiles]);

    const applyFilters = useCallback((profilesToFilter = profiles) => {
        let result = [...profilesToFilter];

        // Фильтр по профессии из поиска
        if (searchParams.profession) {
            const professionLower = searchParams.profession.toLowerCase();
            result = result.filter(profile => 
                profile.profile_name.toLowerCase().includes(professionLower)
            );
        }

        // Фильтр по местоположению из поиска
        if (searchParams.location) {
            const locationLower = searchParams.location.toLowerCase();
            result = result.filter(profile => 
                profile.work_city?.toLowerCase().includes(locationLower)
            );
        }

        // Фильтр по зарплате
        if (salaryFrom) {
            const minSalary = Number(salaryFrom);
            result = result.filter(profile => profile.salary_from >= minSalary);
        }
        if (salaryTo) {
            const maxSalary = Number(salaryTo);
            result = result.filter(profile => profile.salary_to <= maxSalary);
        }

        // Фильтр по дате
        if (dateFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let dateThreshold = new Date();
            switch(dateFilter) {
                case 'option1': // Сегодня
                    dateThreshold.setDate(today.getDate() - 1);
                    break;
                case 'option2': // 3 дня
                    dateThreshold.setDate(today.getDate() - 3);
                    break;
                case 'option3': // Неделя
                    dateThreshold.setDate(today.getDate() - 7);
                    break;
                default:
                    break;
            }
            
            result = result.filter(profile => {
                const profileDate = new Date(profile.posted);
                return profileDate >= dateThreshold;
            });
        }

        // Фильтр по типу работы
        const activeWorkTypes = Object.entries(workTypeFilters)
            .filter(([_, isActive]) => isActive)
            .map(([type]) => {
                switch(type) {
                    case 'permanent': return 'Постоянная';
                    case 'temporary': return 'Временная';
                    case 'contract': return 'По контракту';
                    case 'fullTime': return 'Полный рабочий день';
                    case 'partTime': return 'Подработка';
                    case 'remote': return 'Работа на дому';
                    default: return '';
                }
            });
        
        if (activeWorkTypes.length > 0) {
            result = result.filter(profile => 
                activeWorkTypes.some(type => 
                    profile.work_time?.includes(type)
                )
            );
        }

        // Фильтр по разместившим
        const activePostedBy = Object.entries(postedByFilters)
            .filter(([_, isActive]) => isActive)
            .map(([type]) => type);
        
        if (activePostedBy.length > 0) {
            // Здесь можно добавить логику фильтрации по типу разместившего
        }

        // Фильтр "Не показывать"
        if (hideFilters.noExperience) {
            result = result.filter(profile => 
                profile.work_experience && profile.work_experience.length > 0
            );
        }
        if (hideFilters.noEducation) {
            result = result.filter(profile => 
                profile.educations && profile.educations.length > 0
            );
        }

        // Фильтр по специальности
        const activeSpecialties = Object.keys(specialtyFilters)
            .filter(specialty => specialtyFilters[specialty]);
        
        if (activeSpecialties.length > 0) {
            result = result.filter(profile => 
                activeSpecialties.some(specialty => 
                    profile.profile_name.includes(specialty) || 
                    (profile.skills && profile.skills.some(skill => skill.includes(specialty)))
            ));
        }

        setFilteredProfiles(result);
    }, [
        searchParams.profession, 
        searchParams.location,
        salaryFrom, 
        salaryTo, 
        dateFilter,
        workTypeFilters,
        postedByFilters,
        hideFilters,
        specialtyFilters,
        profiles
    ]);

    // Остальные обработчики остаются без изменений
    const handleWorkTypeChange = (type) => {
        setWorkTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handlePostedByChange = (type) => {
        setPostedByFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleHideChange = (type) => {
        setHideFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleExperienceChange = (type) => {
        setExperienceFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleSpecialtyChange = (specialty) => {
        setSpecialtyFilters(prev => ({ ...prev, [specialty]: !prev[specialty] }));
    };

    const handleResetFilters = () => {
        setSalaryFrom('');
        setSalaryTo('');
        setDateFilter('');
        setWorkTypeFilters({
            permanent: false,
            temporary: false,
            contract: false,
            fullTime: false,
            partTime: false,
            remote: false
        });
        setPostedByFilters({
            agencies: false,
            employers: false,
            headhunt: false
        });
        setHideFilters({
            noExperience: false,
            noEducation: false
        });
        setExperienceFilters({
            noExperience: false,
            oneYear: false,
            threeYears: false,
            sixYears: false
        });
        setSpecialtyFilters({});
    };

    const handleInviteClick = (candidate) => {
        setSelectedCandidate(candidate);
        setShowPopup(true);
    };

    const handleFavouriteClick = async (profileId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Для добавления в избранное необходимо авторизоваться');
            return;
        }

        try {
            setProfiles(prev => prev.map(profile => 
                profile.profile_id === profileId 
                    ? { ...profile, isFavourite: !profile.isFavourite } 
                    : profile
            ));

            if (profiles.find(p => p.profile_id === profileId)?.isFavourite) {
                await axios.delete(`http://localhost:5000/api/favourites-prof/${profileId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).catch(error => {
                    if (error.response?.status !== 404) throw error;
                });
            } else {
                await axios.post(
                    'http://localhost:5000/api/favourites-prof',
                    { profile_id: profileId },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            }
        } catch (error) {
            console.error('Ошибка:', error);
            setProfiles(prev => prev.map(profile => 
                profile.profile_id === profileId 
                    ? { ...profile, isFavourite: !profile.isFavourite } 
                    : profile
            ));

            if (error.response?.status === 401) {
                alert('Сессия истекла. Пожалуйста, войдите снова.');
            } else if (error.response?.status !== 404) {
                alert('Ошибка при обработке запроса');
            }
        }
    };

    const handleSendInvitation = (invitationData) => {
        console.log('Отправка приглашения:', invitationData);
        setShowPopup(false);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 300);
    
        return () => clearTimeout(timer);
    }, [
        searchParams.profession,
        searchParams.location,
        salaryFrom, 
        salaryTo, 
        dateFilter,
        workTypeFilters,
        postedByFilters,
        hideFilters,
        experienceFilters,
        specialtyFilters,
        profiles
    ]);

    if (loading) return <div className="loading">Загрузка анкет...</div>;
    if (error) return <div className="error">{error}</div>;

    return(
        <div className="main-vac">
            <div className="profiles-container">
                <div className="filters">
                    <h1>Найдено: <span>{filteredProfiles.length}</span> сотрудников</h1>
                    <div className="clear-filter">
                        <h2>Текущие фильтры</h2> 
                        <button onClick={handleResetFilters}>Сбросить фильтры</button>
                    </div>
                    <div className="salary">
                        <h2>Отфильтруй поиск</h2>
                        <h1>Диапазон зарплаты</h1>
                        <label htmlFor="salary-from">Зарплата от:</label>
                        <input 
                            type="number" 
                            name="salary-from" 
                            value={salaryFrom}
                            onChange={(e) => setSalaryFrom(e.target.value)}
                            placeholder="Минимальная ЗП сотруднику"
                        />

                        <label htmlFor="salary-to">Зарплата до:</label>
                        <input 
                            type="number" 
                            name="salary-to" 
                            value={salaryTo}
                            onChange={(e) => setSalaryTo(e.target.value)}
                            placeholder="Максимальная ЗП сотруднику"
                        />
                    </div>
                    
                    {/* Тип работы */}
                    <div className="jobs">
                        <h1>Тип предлагаемой работы</h1>
                        {Object.entries({
                            permanent: 'Постоянная',
                            temporary: 'Временная',
                            contract: 'По контракту',
                            fullTime: 'Полная занятость',
                            partTime: 'Подработка',
                            remote: 'Работа на дому'
                        }).map(([key, label]) => (
                            <div className="job-type" key={key}>
                                <input 
                                    className="checker" 
                                    type="checkbox" 
                                    checked={workTypeFilters[key]}
                                    onChange={() => handleWorkTypeChange(key)}
                                />
                                <p>{label}</p>
                            </div>
                        ))}
                    </div>
                    
                    
                    {/* Не показывать */}
                    <div className="dont-show">
                        <h1>Не показывать</h1>
                        {Object.entries({
                            noExperience: 'Сотрудников без опыта',
                            noEducation: 'Без образования'
                        }).map(([key, label]) => (
                            <div className="dont-show-type" key={key}>
                                <input 
                                    className="checker" 
                                    type="checkbox" 
                                    checked={hideFilters[key]}
                                    onChange={() => handleHideChange(key)}
                                />
                                <p>{label}</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Дата публикации */}
                    <div className="date">
                        <h1>Дата публикаций</h1>
                        <select 
                            className="select-custom" 
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option value="">Любая дата</option>
                            <option value="option1">Сегодня</option>
                            <option value="option2">Последние 3 дня</option>
                            <option value="option3">Последняя неделя</option>
                        </select>
                    </div>
                    
                    {/* Опыт работы */}
                    <div className="experiance">
                        <h1>Опыт работы</h1>
                        {Object.entries({
                            noExperience: 'Без опыта работы',
                            oneYear: 'От 1 года',
                            threeYears: 'От 3 лет',
                            sixYears: 'От 6 лет и выше'
                        }).map(([key, label]) => (
                            <div className="dont-show-type" key={key}>
                                <input 
                                    className="checker" 
                                    type="checkbox" 
                                    checked={experienceFilters[key]}
                                    onChange={() => handleExperienceChange(key)}
                                />
                                <p>{label}</p>
                            </div>
                        ))}
                    </div>
                    
                    {/* Специальность */}
                    <div className="specialty">
                        <h1>Специальность</h1>
                        <div className="scroll-view">
                            {[
                                'IT и телекоммуникации', 'Инженерия', 'Финансовые услуги',
                                'Здравоохранение', 'Туризм', 'Бухгалтерия', 'Транспортная логистика',
                                'Администрирование', 'Маркетинг и PR', 'Научная работа', 'Медиа',
                                'Торговля', 'Тренинг', 'Энергетика', 'Фармацевтика', 'Производство',
                                'Агенство недвижимости'
                            ].map(specialty => (
                                <div className="specialty-type" key={specialty}>
                                    <input 
                                        className="checker" 
                                        type="checkbox" 
                                        checked={specialtyFilters[specialty] || false}
                                        onChange={() => handleSpecialtyChange(specialty)}
                                    />
                                    <p>{specialty}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="profiles">
                    <div className="head-profiles">
                        <p className='users_list'>Анкеты пользователя: {userInfo?.name || 'Неизвестный пользователь'}</p>
                        <p>Отсортировано по дате</p>
                    </div>
                    <div className="profiles-scrollblock">
                        {loading && <p>Загрузка анкет...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && filteredProfiles.length === 0 && <p>Анкет не найдено.</p>}
                        {!loading && !error && filteredProfiles.map(profile => {
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
                                                    Размещено <span id='date'>{new Date(profile.posted).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                                                    {user && (
                                                        <span> пользователем: <Link to={`/user/${user.user_id}`}>{user.name || 'Неизвестный пользователь'}</Link></span>
                                                    )}
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
                                                <button 
                                                    className={profile.isFavourite ? 'liked' : 'unliked'} 
                                                    onClick={() => handleFavouriteClick(profile.profile_id)}
                                                ></button>
                                                <div className="profile-photo p1" style={{
                                                    backgroundImage: profile.profile_image ? `url(data:image/png;base64,${profile.profile_image})` : `url(data:image/png;base64,${user.user_image})`
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