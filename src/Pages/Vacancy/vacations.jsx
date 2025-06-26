import './vacations.css';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export function Vacations({ searchParams }) {
    const [vacations, setVacations] = useState([]);
    const [filteredVacations, setFilteredVacations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const [searchTerm, setSearchTerm] = useState('');
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
        noSalary: false,
        courses: false,
        volunteering: false
    });
    const [specialtyFilters, setSpecialtyFilters] = useState({});



    const fetchVacations = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('authToken');
            const url = token 
                ? 'http://localhost:5000/api/vacations-extract-all/auth'
                : 'http://localhost:5000/api/vacations-extract-all';

            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

            const response = await axios.get(url, { headers });

            if (response.data.success) {
                const normalizedVacations = response.data.vacations.map(vac => ({
                    ...vac,
                    user: vac.user || null,
                    isFavourite: vac.isFavourite || false
                }));
                setVacations(normalizedVacations);
                applyFilters(normalizedVacations);
            } else {
                setError(response.data.message || 'Не удалось загрузить вакансии');
            }
        } catch (err) {
            console.error('Ошибка при загрузке вакансий:', err);
            setError(err.response?.data?.message || err.message || 'Ошибка при загрузке вакансий');
        } finally {
            setLoading(false);
        }
    }, []);


    const applyFilters = useCallback((vacationsToFilter = vacations) => {
        let result = [...vacationsToFilter];

        if (searchParams.profession) {
            const professionLower = searchParams.profession.toLowerCase();
            result = result.filter(vac => 
                vac.vacation_name.toLowerCase().includes(professionLower)
            );
        }

        // Фильтр по местоположению
        if (searchParams.location) {
            const locationLower = searchParams.location.toLowerCase();
            result = result.filter(vac => 
                vac.work_city.toLowerCase().includes(locationLower) ||
                vac.work_adress.toLowerCase().includes(locationLower)
            );
        }

        
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(vac => 
                vac.vacation_name.toLowerCase().includes(searchLower) ||
                vac.work_description.toLowerCase().includes(searchLower) ||
                vac.required_skills.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        // Фильтр по зарплате
        if (salaryFrom) {
            const minSalary = Number(salaryFrom);
            result = result.filter(vac => vac.salary_from >= minSalary);
        }
        if (salaryTo) {
            const maxSalary = Number(salaryTo);
            result = result.filter(vac => vac.salary_to <= maxSalary);
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
            
            result = result.filter(vac => {
                const vacDate = new Date(vac.posted);
                return vacDate >= dateThreshold;
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
            result = result.filter(vac => 
                activeWorkTypes.some(type => 
                    vac.work_type.includes(type)
                )
            );
        }

        // Фильтр по разместившим
        const activePostedBy = Object.entries(postedByFilters)
            .filter(([_, isActive]) => isActive)
            .map(([type]) => type);
        
        if (activePostedBy.length > 0) {
            result = result.filter(vac => {
                
                return true; 
            });
        }

        // Фильтр "Не показывать"
        if (hideFilters.noSalary) {
            result = result.filter(vac => vac.salary_from > 0);
        }
        if (hideFilters.courses) {
            result = result.filter(vac => !vac.vacation_name.toLowerCase().includes('курс'));
        }
        if (hideFilters.volunteering) {
            result = result.filter(vac => !vac.vacation_name.toLowerCase().includes('волонтер'));
        }

        // Фильтр по специальности
        const activeSpecialties = Object.keys(specialtyFilters)
            .filter(specialty => specialtyFilters[specialty]);
        
        if (activeSpecialties.length > 0) {
            result = result.filter(vac => 
                activeSpecialties.some(specialty => 
                    vac.vacation_name.includes(specialty) || 
                    vac.work_description.includes(specialty)
                )
            );
        }

        

        setFilteredVacations(result);
    }, [
        searchParams.profession, searchParams.location, searchTerm, salaryFrom, salaryTo, dateFilter, 
        workTypeFilters, postedByFilters, hideFilters, specialtyFilters, vacations
    ]);


    const handleWorkTypeChange = (type) => {
        setWorkTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handlePostedByChange = (type) => {
        setPostedByFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleHideChange = (type) => {
        setHideFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const handleSpecialtyChange = (specialty) => {
        setSpecialtyFilters(prev => ({ ...prev, [specialty]: !prev[specialty] }));
    };

    const handleResetFilters = () => {
        setSearchTerm('');
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
            noSalary: false,
            courses: false,
            volunteering: false
        });
        setSpecialtyFilters({});
    };


    const handleLikeClick = async (vacationId) => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Для добавления в избранное необходимо авторизоваться');
        return;
      }

      try {
        
        setVacations(prev => prev.map(vacation => 
          vacation.vacation_id === vacationId 
            ? { ...vacation, isFavourite: !vacation.isFavourite } 
            : vacation
        ));

        if (vacations.find(v => v.vacation_id === vacationId)?.isFavourite) {
          
          await axios.delete(`http://localhost:5000/api/favourites-vac/${vacationId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(error => {
            
            if (error.response?.status !== 404) throw error;
          });
        } else {
          
          await axios.post(
            'http://localhost:5000/api/favourites',
            { vacation_id: vacationId },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
        }
      } catch (error) {
        console.error('Ошибка:', error);
        
        setVacations(prev => prev.map(vacation => 
          vacation.vacation_id === vacationId 
            ? { ...vacation, isFavourite: !vacation.isFavourite } 
            : vacation
        ));

        if (error.response?.status === 401) {
          alert('Сессия истекла. Пожалуйста, войдите снова.');
        } else if (error.response?.status !== 404) {
          alert('Ошибка при обработке запроса');
        }
      }
    };
    
    useEffect(() => {
        fetchVacations();
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        applyFilters();
      }, 300); 
    
      return () => clearTimeout(timer);
    }, [
      
      searchParams.profession, 
      searchParams.location,
      searchTerm, 
      salaryFrom, 
      salaryTo, 
      dateFilter,
      workTypeFilters,
      postedByFilters,
      hideFilters,
      specialtyFilters,
      vacations
    ]);


    return(
        <div className="main-vac">
            <div className="vac-container">
                <div className="filters">
                    <h1>Найдено: <span>{filteredVacations.length}</span> вакансии</h1>
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
                            placeholder="Минимальная зарплата"
                        />

                        <label htmlFor="salary-to">Зарплата до:</label>
                        <input 
                            type="number" 
                            name="salary-to" 
                            value={salaryTo}
                            onChange={(e) => setSalaryTo(e.target.value)}
                            placeholder="Максимальная зарплата"
                        />
                    </div>
                    
                    {/* Тип работы */}
                    <div className="jobs">
                        <h1>Тип работы</h1>
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
                            courses: 'Курсы',
                            volunteering: 'Волонтерство'
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

                <div className="vacations">
                    <div className="head-vac">
                        {/* <a href="#">Получать уведомления <span className='bell'>.....</span></a> */}
                        <p>Отсортировано по дате</p>
                    </div>
                    <div className="vac-scrollblock">
                        {loading && <p>Загрузка вакансий...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && filteredVacations.length === 0 && <p>Вакансий нет.</p>}
                        {!loading && !error && filteredVacations.map(vacation => (
                          <div key={vacation.vacation_id} className="vacation-wrap vac-active">
                            <div className="vacation-info">
                              <div className='flex_wrapper'>
                                <div className="info">
                                  <p className="modificate">Размещено: Head / Hunt</p>
                                  <Link to={`/vacation/${vacation.vacation_id}`} className='name-vac'>
                                    {vacation.vacation_name}
                                  </Link>
                                  <p className='post-message'>
                                    Размещено <span id='date'>{new Date(vacation.posted).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                                    {vacation.user && (
                                    <span> пользователем: <Link to={`/user/${vacation.user.user_id}`}>{vacation.user.name}</Link></span>
                                    )} 
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
                                  <button 
                                    className={vacation.isFavourite ? 'liked' : 'unliked'} 
                                    onClick={() => handleLikeClick(vacation.vacation_id)}
                                  ></button>
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