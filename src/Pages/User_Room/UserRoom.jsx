import './UserRoom.css'
import { Vacancy_Add } from './vacation_add';
import { Vacancy_Edit } from './vacation_edit';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import myImage from '../Images/user.png';
import { Profile_Add } from './profile_add';
import { Profile_Edit } from './profile_edit';
import { PasswordConfirm } from './password_confirmation';
import { User_Edit } from './user_edit';
import { ProfileAddSteps} from './steps';
import { TourProvider } from "@reactour/tour";
import InputMask from 'react-input-mask';

export function UserRoom({ activeTab }) {
  const [showPopupAdd, setShowPopupAdd] = useState(false);
  const [showPopupProfileAdd, setShowPopupProfileAdd] = useState(false);
  const [showPopupEdit, setShowPopupEdit] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showFavourites, setShowFavourites] = useState(false);
  const [responseVacations, setResponseVacations] = useState([]);
  const [loadingResponsesVac, setLoadingResponsesVac] = useState(false);
  const [responseProfiles, setResponseProfiles] = useState([]);
  const [loadingResponsesProf, setLoadingResponsesProf] = useState(false);
  const [vacations, setVacations] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [userName, setUserName]=useState([]);
  const [userData, setUserData] = useState(null); 
  const [userLoading, setUserLoading] = useState(true);
  const [loadingVacations, setLoadingVacations] = useState(false);
  const [loadingFavVacations, setLoadingFavVacations] = useState(false);
  const [loadingFavProfiles, setLoadingFavProfiles] = useState(false);
  const [favoriteVacations, setFavoriteVacations] = useState([]);
  const [favoriteProfiles, setFavoriteProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [error, setError] = useState('');
  const [showPopupProfileEdit, setShowPopupProfileEdit] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredVacations, setFilteredVacations] = useState([]);
  const [workTypeFilters, setWorkTypeFilters] = useState({
    permanent: false,
    temporary: false,
    fullTime: false,
    partTime: false,
    remote: false
  });


  const applyFilters = () => {
    let result = vacations.filter(vac => vac.active !== showArchived);

    
    if (searchTerm) {
      result = result.filter(vac => 
        vac.vacation_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'option1': 
          result = result.filter(vac => {
            const vacDate = new Date(vac.posted);
            return vacDate.toDateString() === today.toDateString();
          });
          break;

        case 'option2': 
          const threeDaysAgo = new Date(today);
          threeDaysAgo.setDate(today.getDate() - 3);
          result = result.filter(vac => {
            const vacDate = new Date(vac.posted);
            return vacDate >= threeDaysAgo;
          });
          break;

        case 'option3': 
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          result = result.filter(vac => {
            const vacDate = new Date(vac.posted);
            return vacDate >= weekAgo;
          });
          break;

        case 'option4': 
          const threeWeeksAgo = new Date(today);
          threeWeeksAgo.setDate(today.getDate() - 21);
          result = result.filter(vac => {
            const vacDate = new Date(vac.posted);
            return vacDate >= threeWeeksAgo;
          });
          break;

        case 'option5': 
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          result = result.filter(vac => {
            const vacDate = new Date(vac.posted);
            return vacDate >= monthAgo;
          });
          break;

        default:
          break;
      }
    }

    const activeWorkTypeFilters = Object.entries(workTypeFilters)
    .filter(([_, value]) => value)
    .map(([key]) => {
      switch(key) {
        case 'permanent': return ['Полный рабочий день', 'Постоянная'];
        case 'temporary': return ['Временная'];
        case 'fullTime': return ['Полная занятость'];
        case 'partTime': return ['Подработка'];
        case 'remote': return ['Работа на дому', 'Удаленная работа'];
        default: return [];
      }
    })
    .flat(); 

  if (activeWorkTypeFilters.length > 0) {
    result = result.filter(vac => 
      activeWorkTypeFilters.some(filter => 
        vac.work_type.some(type => type.includes(filter))
      )
    );
  }

    setFilteredVacations(result);
  };

  useEffect(() => {
    applyFilters();
  }, [vacations, showArchived, searchTerm, dateFilter, workTypeFilters]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handleSearchClick = () => {
    applyFilters();
  };

  const handleWorkTypeChange = (type) => {
    setWorkTypeFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleEditUserClick = () => {
    setShowPasswordConfirm(true);
  };

  const handlePasswordConfirm = () => {
    setShowPasswordConfirm(false);
    setShowEditForm(true);
  };

  const handleUpdateData = () => {
    fetchUserData(); 
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "Не указано";
  
    const cleaned = phone.toString().replace(/\D/g, '');

    if (cleaned.length >= 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'))) {
      return `+7 (${cleaned.substring(1, 4)})-${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`;
    }

    return phone;
  };

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
        },
        params:{
          archived: showArchived
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

  const fetchFavoriteVacations = async ()=>{
    setLoadingFavVacations(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setLoadingFavVacations(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/favourites/vacations-extract', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setFavoriteVacations(response.data.favoriteVacations);
      } else {
        setError('Не удалось загрузить избранные вакансии');
      }
    } catch (err) {
      console.error('Ошибка при загрузке избранных вакансий:', err);
      setError('Ошибка при загрузке избранных вакансий');
    } finally {
      setLoadingFavVacations(false);
    }
  }

  const fetchFavouriteProfiles = async ()=>{
    setLoadingFavProfiles(true);
    setError('');
    try{
      const token = localStorage.getItem('authToken');
      if(!token){
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setLoadingFavProfiles(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/favourites/profiles-extract', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setFavoriteProfiles(response.data.favoriteProfiles);
      } else {
        setError('Не удалось загрузить избранные анкеты');
      }
    } catch (err) {
      console.error('Ошибка при загрузке избранных анкет:', err);
      setError('Ошибка при загрузке избранных анкет');
    } finally {
      setLoadingFavProfiles(false);
    }
  }

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setProfiles([]);
        setLoadingProfiles(false);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/profiles-extract', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.data.success) {
        setProfiles(response.data.profiles);
        setUserName(response.data.user);
      } else {
        setError('Не удалось загрузить анкеты');
      }
    } catch (err) {
      console.error('Ошибка при загрузке анкет:', err);
      setError('Ошибка при загрузке Анкет');
    } finally {
      setLoadingProfiles(false);
    }
  };

  const fetchUserData = async()=>{
    setUserLoading(true);
    setError('');
    try{
      const token = localStorage.getItem('authToken');
      if(!token){
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setUserLoading(false);
        return;
      }
      const response = await axios.get('http://localhost:5000/api/userData',{
        headers:{
          'Authorization': `Bearer ${token}`
        },
      });
      if(response.data.success){
        setUserData(response.data.userResponse);
      }else{
        setError('Не удалось загрузить данные пользователя.');
      }
    }catch (err){
      console.error('Ошибка при загрузке данных пользователя: ',err);
      setError('Ошибка при загрузке данных пользователя');
    }finally{
      setUserLoading(false);
    }
  }

  const fetchResponseVacations = async () => {
    setLoadingResponsesVac(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setLoadingResponsesVac(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/responseVacation-extract', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setResponseVacations(response.data.responseVacations);
      } else {
        setError('Не удалось загрузить отклики на вакансии');
      }
    } catch (err) {
      console.error('Ошибка при загрузке откликов:', err);
      setError('Ошибка при загрузке откликов на вакансии');
    } finally {
      setLoadingResponsesVac(false);
    }
  };

  const fetchResponseProfiles = async () => {
    setLoadingResponsesProf(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        setLoadingResponsesProf(false);
        return;
      }

      const responseProfile = await axios.get('http://localhost:5000/api/responseProfile-extract', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (responseProfile.data.success) {
        setResponseProfiles(responseProfile.data.responseProfiles);
      } else {
        setError('Не удалось загрузить отклики на анкеты');
      }
    } catch (err) {
      console.error('Ошибка при загрузке откликов:', err);
      setError('Ошибка при загрузке откликов на анкеты');
    } finally {
      setLoadingResponsesProf(false);
    }
  };

  useEffect(()=>{
    if(activeTab === 'user_menu'){
      fetchUserData();
    }
  },[activeTab]);

  useEffect(()=>{
    if(activeTab === 'responses'){
      fetchResponseVacations();
      fetchResponseProfiles();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavoriteVacations();
      fetchFavouriteProfiles();
    }
  }, [activeTab]);
  
  useEffect(() => {
    if (activeTab === 'vacancy') {
      fetchVacations();
    }
  }, [activeTab, showArchived]);

  useEffect(() => {
    if (!showPopupAdd && activeTab === 'vacancy') {
      // Обновляем список вакансий после закрытия попапа (например, после добавления новой вакансии)
      fetchVacations();
    }
  }, [showPopupAdd, activeTab]);

  useEffect(()=>{
    if(!showPopupProfileAdd && activeTab === 'profiles'){
      fetchProfiles();
    }
  }, [showPopupProfileAdd, activeTab]);
  const filteredVacationsArchive = vacations.filter(vac => vac.active !== showArchived);

  
  
  const activeVacations = vacations.filter(vac => vac.active);

  const handleToggleArchived = () => {
    setShowArchived(prev => !prev);
  };

  const handleDelete = async (vacationId) => {
    const confirmDelete = window.confirm('Вы действительно хотите удалить эту вакансию?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }
      // Отправляем запрос на удаление (предполагается, что на сервере есть такой эндпоинт)
      const response = await axios.delete(`http://localhost:5000/api/vacation-delete/${vacationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        // Обновляем список вакансий локально без перезагрузки с сервера
        setVacations(prev => prev.filter(vac => vac.vacation_id !== vacationId));
      } else {
        alert('Не удалось удалить вакансию.');
      }
    } catch (error) {
      console.error('Ошибка при удалении вакансии:', error);
      alert('Произошла ошибка при удалении вакансии.');
    }
  };

  const handleEditClick = (vacation) => {
    setSelectedVacation(vacation);
    setShowPopupEdit(true);
  };

  const handleDeleteVacResponse = async (responseId) => {
    const confirmDelete = window.confirm('Вы действительно хотите удалить этот отклик?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }
      
      const response = await axios.delete(`http://localhost:5000/api/vacationResponse-delete/${responseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        fetchResponseVacations();
      } else {
        alert('Не удалось удалить отклик.');
      }
    } catch (error) {
      console.error('Ошибка при удалении отклика:', error);
      alert('Произошла ошибка при удалении отклика.');
    }
  };

  const handleDeleteProfResponse = async (responseId) => {
    const confirmDelete = window.confirm('Вы действительно хотите удалить этот отклик?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }
      
      const response = await axios.delete(`http://localhost:5000/api/profileResponse-delete/${responseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.success) {
        fetchResponseProfiles();
      } else {
        alert('Не удалось удалить отклик.');
      }
    } catch (error) {
      console.error('Ошибка при удалении отклика:', error);
      alert('Произошла ошибка при удалении отклика.');
    }
  };

  const handleDeleteProfile = async (profileId) => {
    const confirmDelete = window.confirm('Вы действительно хотите удалить эту анкету?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/profile-delete/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProfiles(prev => prev.filter(prof => prof.profile_id !== profileId));
      } else {
        alert('Не удалось удалить анкету.');
      }
    } catch (error) {
      console.error('Ошибка при удалении анкеты:', error);
      alert('Произошла ошибка при удалении анкеты.');
    }
  };

  const handleEditProfileClick = async (profile) => {
    setSelectedProfile(profile);
    setShowPopupProfileEdit(true);
  };

  const handleDeleteFavouriteVac = async (vacationId) =>{
    const confirmDelete = window.confirm('Вы действительно хотите удалить эту вакансию из избранного?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/favourites-vac/${vacationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        fetchFavoriteVacations();
        alert('Вакансия удалена из избранного!')
      } else {
        alert('Не удалось удалить вакансию из избранного.');
      }
    } catch (error) {
      console.error('Ошибка при удалении вакансии из избранного:', error);
      alert('Произошла ошибка при удалении вакансии из избранного.');
    }
  };

  const handleDeleteFavouriteProf = async (profileId) =>{
    const confirmDelete = window.confirm('Вы действительно хотите удалить эту анкету из избранного?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/api/favourites-prof/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        fetchFavouriteProfiles();
        alert('Анкета удалена из избранного!')
      } else {
        alert('Не удалось удалить анкету.');
      }
    } catch (error) {
      console.error('Ошибка при удалении анкеты из избранного:', error);
      alert('Произошла ошибка при удалении анкеты из избранного.');
    }
  };

  return (
    <div className="user-room-content">
      {activeTab === "vacancy" && (
        <div className='main-container-vac'>
          <div className="filters-user">
            <h1>Размещено: <span>{activeVacations.length}</span> вакансии</h1>
            <div className="salary">
              <h2>Поиск</h2>
              <h1>Название вакансии</h1>
              {/* <label htmlFor="name-vac">Наименование вакансии:</label> */}
              <input type="text" name='name-vac' value={searchTerm} onChange={handleSearchTermChange} placeholder='Введите название вакансии'/>
            </div>
            <div className="jobs">
                <h1>Тип работы</h1>
                <div className="job-type">
                    <input className='checker' type="checkbox"  checked={workTypeFilters.permanent} onChange={() => handleWorkTypeChange('permanent')}/>
                    <p>Постоянная</p>
                </div>
                <div className="job-type">
                    <input className='checker' type="checkbox" checked={workTypeFilters.temporary} onChange={() => handleWorkTypeChange('temporary')}/>
                    <p>Временная</p>
                </div>
                <div className="job-type">
                    <input className='checker' type="checkbox" checked={workTypeFilters.fullTime} onChange={() => handleWorkTypeChange('fullTime')}/>
                    <p>Полная занятость</p>
                </div>
                <div className="job-type">
                    <input className='checker' type="checkbox" checked={workTypeFilters.partTime} onChange={() => handleWorkTypeChange('partTime')}/>
                    <p>Подработка</p>
                </div>
                <div className="job-type">
                    <input className='checker' type="checkbox" checked={workTypeFilters.remote} onChange={() => handleWorkTypeChange('remote')}/>
                    <p>Работа на дому</p>
                </div>
            </div>
            <div className="date-user">
              <h1>Дата публикации</h1>
              <select className='select-custom' id='date_option' value={dateFilter} onChange={handleDateFilterChange}>
                <option className='select-option' value="">Любая дата</option>
                <option className='select-option' value="option1">Сегодня</option>
                <option className='select-option' value="option2">Последние 3 дня</option>
                <option className='select-option' value="option3">Последняя неделя</option>
                <option className='select-option' value="option4">Последние 3 недели</option>
                <option className='select-option' value="option5">Последний месяц</option>
              </select>
              <button onClick={handleSearchClick} className='search-user-button'>Поиск вакансии</button>
            </div>
          </div>
          <div className="vacations-user">
            <div className="head-vac">
              <a className='add-button' onClick={() => setShowPopupAdd(true)}>Добавить вакансию</a>
              {showPopupAdd && (
                <Vacancy_Add 
                  onClose={() => setShowPopupAdd(false)}
                />
              )}
              {showPopupEdit && selectedVacation && (
                <Vacancy_Edit
                  vacationId={selectedVacation.vacation_id} // Передаем только ID
                  onClose={() => {
                    setShowPopupEdit(false);
                    setSelectedVacation(null);
                  }}
                  onUpdateVacancies={fetchVacations}
                />
              )}
              <a
                href="#"
                className={!showArchived ? 'active-button' : 'default-button'}
                onClick={(e) => {
                  e.preventDefault();
                  setShowArchived(false);
                }}
              >
                Активные вакансии
              </a>
              <a
                href="#"
                className={showArchived ? 'active-button' : 'default-button'}
                onClick={(e) => {
                  e.preventDefault();
                  setShowArchived(true);
                }}
              >
                Архив вакансий
              </a>
              {/* <a href="#">Получать уведомления об откликах <span className='bell'>......</span></a> */}
            </div>
            <div className="vac-user-scrollblock">
              {loadingVacations && <p>Загрузка вакансий...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loadingVacations && !error && filteredVacations.length === 0 && <p>{showArchived ? 'Архивных вакансий нет.' : 'Активных вакансий нет.'}</p>}
              {!loadingVacations && !error && filteredVacations.map(vacation => (
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
                              <p id='location-description'>{vacation.work_place.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="delete-button">
                        <button onClick={() => handleDelete(vacation.vacation_id)} title="Удалить вакансию"></button>
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
                      <a className='edit-button' onClick={() => handleEditClick(vacation)}>Редактировать <span className='img-edit'>.</span></a>
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
              <a href="#" onClick={() => setShowPopupProfileAdd(true)} className='add-button'>Добавить анкету</a>
              {showPopupProfileAdd && (
                <Profile_Add 
                  onClose={() => setShowPopupProfileAdd(false)}
                  onUpdateProfiles={fetchProfiles}
                />
                
              )}
              {showPopupProfileEdit && selectedProfile && (
                <Profile_Edit 
                  profileId={selectedProfile.profile_id}
                  onClose={() => {
                    setShowPopupProfileEdit(false);
                    setSelectedProfile(null);
                  }}
                  onUpdate={fetchProfiles} // Функция для обновления списка профилей
                />
              )}
            </div>
            <div className="profiles-scrollblock">
              {loadingProfiles && <p>Загрузка анкет...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loadingProfiles && !error && profiles.length === 0 && (
                <p>{showArchived ? 'Архивных анкет нет.' : 'Активных анкет нет.'}</p>
              )}
              {!loadingProfiles && !error && profiles.map(profile => (
                <div key={profile.profile_id} className="profiles-wrap profile-active">
                  <div className="profile-info">
                    <div className='profile_wrapper'>
                      <div className="info">
                        <p className="modificate">Продвинуто: Head / Hunt</p>
                        <Link to={`/profile/${profile.profile_id}`} className='name-profile'>
                          {profile.profile_name || 'Фронтенд разработчик'}
                        </Link>
                        <p className='post-message'>
                          Размещено <span id='date'>{new Date(profile.posted).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span> 
                          <span> пользователем: <a href="#" id='person'>{userName.name || 'Пользователь'}</a></span>
                        </p>
                        <div className="descriptions">
                          <div className="descript-flex">
                            <div className="description">
                              <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                              <p id='salary-description'>
                                {profile.salary_from || '100000'} - {profile.salary_to || '120000'} рублей в месяц
                              </p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/graduation.png')} className='descript-image' alt="" />
                              <p id='graduate-description'>Образование: <span id='graduate'>{profile.educations?.length > 0 ? profile.educations[0] : 'Общее среднее'}</span></p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/exp.png')} className='descript-image' alt="" />
                              <p id='experience-description'>Опыт работы: <span id='experience'>{profile.work_experience?.length > 0 ? profile.work_experience[0] : 'Нет опыта работы'}</span></p>
                            </div>
                          </div>
                          <div className="descript-flex">
                            <div className="description">
                              <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                              <p id='time-description'>{profile.work_time?.join(', ') || 'Полный рабочий день'}</p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                              <p id='workplace-description'>{profile.work_place?.join(', ') || 'Офис, работа на дому'}</p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                              <p id='location-description'>Город: <span id='city'>{profile.work_city || 'Тула'}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="delete-button">
                        <button onClick={() => handleDeleteProfile(profile.profile_id)} title="Удалить анкету"></button>
                        <div 
                          className="profile-photo p1"
                          style={{ 
                            backgroundImage: profile.profile_image 
                              ? `url(data:image/png;base64,${profile.profile_image})` 
                              : 'url(default-profile-image.jpg)'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="manual-buttons">
                      <details className='description_about'>
                        <summary>Подробнее</summary>
                        <div className="details-content">
                          <h3>Биография:</h3>
                          <p>{profile.biography || 'Не указано'}</p>

                          <h3>Карьера:</h3>
                          <p>{profile.career || 'Не указано'}</p>

                          <h3>Навыки:</h3>
                          <ul>
                            {profile.skills?.map((skill, idx) => (
                              <li key={idx}>{skill}</li>
                            )) || <li>Навыки не указаны</li>}
                          </ul>
                          
                          <h3>Опыт работы:</h3>
                          <ul>
                            {profile.work_experience?.map((exp, idx) => (
                              <li key={idx}>{exp}</li>
                            )) || <li>Опыт работы не указан</li>}
                          </ul>
                          
                          <h3>Сферы деятельности:</h3>
                          <ul>
                            {profile.activity_fields?.map((field, idx) => (
                              <li key={idx}>{field}</li>
                            )) || <li>Сферы деятельности не указаны</li>}
                          </ul>
                          
                          <h3>Личные качества:</h3>
                          <ul>
                            {profile.qualities?.map((quality, idx) => (
                              <li key={idx}>{quality}</li>
                            )) || <li>Личные качества не указаны</li>}
                          </ul>
                          
                          <h3>Образование:</h3>
                          <ul>
                            {profile.educations?.map((edu, idx) => (
                              <li key={idx}>{edu}</li>
                            )) || <li>Образование не указано</li>}
                          </ul>
                          
                          <h3>Знание языков:</h3>
                          <ul>
                            {profile.languages_knowledge?.map((lang, idx) => (
                              <li key={idx}>{lang}</li>
                            )) || <li>Языки не указаны</li>}
                          </ul>
                          
                          <h3>Дополнительно:</h3>
                          <p>{profile.additionally || 'Не указано'}</p>
                        </div>
                      </details>
                      <a
                        className='edit-button'
                        onClick={() => handleEditProfileClick(profile)}
                      >
                        Редактировать <span className='img-edit'>.</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "responses" && (
        <div className='main-responses-container'>
          <div className="vacation-response">
            <h1 className='response-h'>Отклики на вакансии</h1>
            <div className="vacation-response-scroll">
              {loadingResponsesVac && <p>Загрузка откликов...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loadingResponsesVac && !error && responseVacations.length === 0 && (
                <p>У вас пока нет откликов на вакансии</p>
              )}
              {!loadingResponsesVac && !error && responseVacations.map(response => (
                <div key={response.response_id} className="vacation-response-card">
                  <div className="card">
                    <div>
                      {/* <h1>Вакансия: {response.vacation_name || 'Название не указано'}</h1> */}
                      <h2>Заголовок: {response.title_message}</h2>
                      <p>
                        <strong>Обращение:</strong><br />
                        {response.message_response}
                      </p>
                      <p>
                        <strong>Контактный адрес:</strong><br />
                        {response.email}
                      </p>
                      <div className='flex-buttons'>
                        <a 
                          href={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${response.resume_file}`} 
                          download
                          className='response-button'
                        >
                          Скачать резюме
                        </a>
                        <a 
                          href={`mailto:${response.email}`} 
                          className='response-button'
                        >
                          Ответить кандидату
                        </a>
                      </div>
                    </div>
                    <div className='delete-button'>
                      <button onClick={() => handleDeleteVacResponse(response.response_id)}></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divide-line"></div>
          <div className="profile-response">
            <h1 className='response-h'>Отклики на профили</h1>
            <div className="profile-response-scroll">
              {loadingResponsesProf && <p>Загрузка откликов...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loadingResponsesProf && !error && responseProfiles.length === 0 && (
                <p>У вас пока нет откликов на вакансии</p>
              )}
              {!loadingResponsesProf && !error && responseProfiles.map(response => (
                <div key={response.response_id} className="vacation-response-card">
                  <div className="card">
                    <div>
                      {/* <h1>Вакансия: {response.vacation_name || 'Название не указано'}</h1> */}
                      <h2>Заголовок: {response.title_message}</h2>
                      <p>
                        <strong>Обращение:</strong><br />
                        {response.message_response}
                      </p>
                      <p>
                        <strong>Предложение о зарплате:</strong><br />
                        {response.salary_range}
                      </p>
                      <p>
                        <strong>Контактный адрес:</strong><br />
                        {response.email}
                      </p>
                      <div className='flex-buttons'>
                        <a 
                          href={`mailto:${response.email}`} 
                          className='response-button'
                        >
                          Ответить работодателю
                        </a>
                      </div>
                    </div>
                    <div className='delete-button'>
                      <button onClick={() => handleDeleteProfResponse(response.response_id)}></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>  
      )}

      {activeTab === "favorites" && (
        <div className='main-container-fav'>
          <div className='fav-vacations'>
            <h1>Избранные вакансии</h1>
            <div className="vac-fav-scrollblock">
              {loadingFavVacations && <p>Загрузка избранных вакансий...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loadingFavVacations && !error && favoriteVacations.length === 0 && (
                <p>У вас пока нет избранных вакансий</p>
              )}
              {!loadingFavVacations && !error && favoriteVacations.map(vacation => (
                <div key={vacation.vacation_id} className="vacation-wrap vac-active">
                  <div className="vacation-info">
                    <div className='flex_wrapper'>
                      <div className="info">
                        <p className="modificate">Размещено: Head / Hunt</p>
                        <Link to={`/vacation/${vacation.vacation_id}`} className='name-vac'>
                            {vacation.vacation_name}
                        </Link>
                        <p className='post-message'>
                          Размещено <span id='date'>{new Date(vacation.posted).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span> пользователем <span><a href="#" id='company'>{vacation.user_name || 'Компания'}</a></span>
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
                              <p id='time-description'>{Array.isArray(vacation.work_type) ? vacation.work_type.join(', ') : vacation.work_type}</p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                              <p id='location-description'>{Array.isArray(vacation.work_place) ? vacation.work_place.join(', ') : vacation.work_place}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="delete-button">
                        <button onClick={() => handleDeleteFavouriteVac(vacation.vacation_id)} title="Удалить из избранного"></button>
                        <div className="company-logo company1" style={{ backgroundImage: `url(data:image/png;base64,${vacation.company_image})` }}></div>
                      </div>
                    </div>
                    <details className='description_about'>
                      <summary>Подробнее</summary>
                      <h3 className='title_vacation'>Описание вакансии:</h3>
                      <p>{vacation.work_description}</p>
                      <h3 className='requirement'>Требования:</h3>
                      <ul>
                        {Array.isArray(vacation.required_skills) ? (
                          vacation.required_skills.map((skill, idx) => (
                            <li key={idx}>{skill}</li>
                          ))
                        ) : (
                          <li>{vacation.required_skills}</li>
                        )}
                      </ul>
                      <h3 className='conditions'>Условия:</h3>
                      <ul>
                        {vacation.work_advantages && vacation.work_advantages.length > 0 ? (
                          Array.isArray(vacation.work_advantages) ? (
                            vacation.work_advantages.map((adv, idx) => <li key={idx}>{adv}</li>)
                          ) : (
                            <li>{vacation.work_advantages}</li>
                          )
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
          <div className="divide-line">
          </div>
          <div className="fav-profiles">
            <h1>Избранные анкеты</h1>
            <div className="fav-profiles-scrollblock">
              {loadingProfiles && <p>Загрузка анкет...</p>}
              {error && <p className="error-message">{error}</p>}
              {!loadingProfiles && !error && favoriteProfiles.length === 0 && (
                <p>{showArchived ? 'Архивных анкет нет.' : 'Активных анкет нет.'}</p>
              )}
              {!loadingProfiles && !error && favoriteProfiles.map(profile => (
                <div key={profile.profile_id} className="profiles-wrap profile-active">
                  <div className="profile-info">
                    <div className='profile_wrapper'>
                      <div className="info">
                        <p className="modificate">Размещено: Head / Hunt</p>
                        <Link to={`/profile/${profile.profile_id}`} className='name-profile'>
                          {profile.profile_name || 'Фронтенд разработчик'}
                        </Link>
                        <p className='post-message'>
                          Размещено <span id='date'>{new Date(profile.posted).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span> 
                          <span> пользователем: <a href="#" id='person'>{userName.name || 'Пользователь'}</a></span>
                        </p>
                        <div className="descriptions">
                          <div className="descript-flex">
                            <div className="description">
                              <img src={require('../Images/Icons/ruble.png')} className='descript-image' alt="" />
                              <p id='salary-description'>
                                {profile.salary_from || '100000'} - {profile.salary_to || '120000'} рублей в месяц
                              </p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/graduation.png')} className='descript-image' alt="" />
                              <p id='graduate-description'>Образование: <span id='graduate'>{profile.educations?.length > 0 ? profile.educations[0] : 'Общее среднее'}</span></p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/exp.png')} className='descript-image' alt="" />
                              <p id='experience-description'>Опыт работы: <span id='experience'>{profile.work_experience?.length > 0 ? profile.work_experience[0] : 'Нет опыта работы'}</span></p>
                            </div>
                          </div>
                          <div className="descript-flex">
                            <div className="description">
                              <img src={require('../Images/Icons/clock.png')} className='descript-image' alt="" />
                              <p id='time-description'>{profile.work_time?.join(', ') || 'Полный рабочий день'}</p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/home.png')} className='descript-image' alt="" />
                              <p id='workplace-description'>{profile.work_place?.join(', ') || 'Офис, работа на дому'}</p>
                            </div>
                            <div className="description">
                              <img src={require('../Images/Icons/location.png')} className='descript-image' alt="" />
                              <p id='location-description'>Город: <span id='city'>{profile.work_city || 'Тула'}</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="delete-button">
                        <button onClick={() => handleDeleteFavouriteProf(profile.profile_id)} title="Удалить анкету"></button>
                        <div 
                          className="profile-photo p1"
                          style={{ 
                            backgroundImage: profile.profile_image 
                              ? `url(data:image/png;base64,${profile.profile_image})` 
                              : 'url(default-profile-image.jpg)'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="manual-buttons">
                      <details className='description_about'>
                        <summary>Подробнее</summary>
                        <div className="details-content">
                          <h3>Биография:</h3>
                          <p>{profile.biography || 'Не указано'}</p>

                          <h3>Карьера:</h3>
                          <p>{profile.career || 'Не указано'}</p>

                          <h3>Навыки:</h3>
                          <ul>
                            {profile.skills?.map((skill, idx) => (
                              <li key={idx}>{skill}</li>
                            )) || <li>Навыки не указаны</li>}
                          </ul>
                          
                          <h3>Опыт работы:</h3>
                          <ul>
                            {profile.work_experience?.map((exp, idx) => (
                              <li key={idx}>{exp}</li>
                            )) || <li>Опыт работы не указан</li>}
                          </ul>
                          
                          <h3>Сферы деятельности:</h3>
                          <ul>
                            {profile.activity_fields?.map((field, idx) => (
                              <li key={idx}>{field}</li>
                            )) || <li>Сферы деятельности не указаны</li>}
                          </ul>
                          
                          <h3>Личные качества:</h3>
                          <ul>
                            {profile.qualities?.map((quality, idx) => (
                              <li key={idx}>{quality}</li>
                            )) || <li>Личные качества не указаны</li>}
                          </ul>
                          
                          <h3>Образование:</h3>
                          <ul>
                            {profile.educations?.map((edu, idx) => (
                              <li key={idx}>{edu}</li>
                            )) || <li>Образование не указано</li>}
                          </ul>
                          
                          <h3>Знание языков:</h3>
                          <ul>
                            {profile.languages_knowledge?.map((lang, idx) => (
                              <li key={idx}>{lang}</li>
                            )) || <li>Языки не указаны</li>}
                          </ul>
                          
                          <h3>Дополнительно:</h3>
                          <p>{profile.additionally || 'Не указано'}</p>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>   
        </div>
      )}

      {activeTab === "user_menu" && (
        <div className="main-container">
          {showPasswordConfirm && (
            <PasswordConfirm 
              onConfirm={handlePasswordConfirm}
              onCancel={() => setShowPasswordConfirm(false)}
            />
          )}

          {showEditForm && (
            <User_Edit 
              onClose={() => setShowEditForm(false)}
              onUpdate={handleUpdateData}
            />
          )}
          <div className="user_form">
            <h1>Ваши личные данные</h1>
            {userLoading ? (
              <div>Загрузка данных...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="group_userData">
                <div>
                  <div className="group-form">
                    <label>Ваше имя:</label>
                    <p>{userData?.fullName || 'Не указано'}</p>
                  </div>
                  <div className="group-form">
                    <label>Ваш email:</label>
                    <p>{userData?.email || 'Не указано'}</p>
                  </div>
                  <div className="group-form">
                    <label>Ваш телефон:</label>
                    <p>{formatPhoneNumber(userData?.phone)}</p>
                  </div>  
                </div>
                <div>
                  <div className="image-place">
                    <img 
                      src={userData?.user_image ? `data:image/png;base64,${userData.user_image}` : myImage} 
                      alt="Фото пользователя" 
                    />
                  </div>
                </div>
                <div className="group-buttons">
                  <button onClick={handleEditUserClick} className="response-button">
                    Редактировать данные
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}