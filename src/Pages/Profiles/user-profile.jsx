import './user-profile.css';
import defaultImage from '../Images/user.png';
import { InvitationPopup } from './invitation';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function User_Profile() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const [resumeSrc, setResumeSrc] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`http://localhost:5000/api/profile/${profileId}`);
        if (response.data.success) {
          setProfile(response.data.profile);
          
          if (response.data.profile.user_id) {
            const userResponse = await axios.get(`http://localhost:5000/api/user/${response.data.profile.user_id}`);
            if (userResponse.data.success) {
              setUser(userResponse.data.user);
            }
          }
          // Обработка изображения профиля
          if (!response.data.profile.profile_image) {
            setImageSrc(`data:image/png;base64,${user.data.user.user_image}`);
          }else{
            const base64Image = `data:image/png;base64,${response.data.profile.profile_image}`;
            setImageSrc(base64Image);
          }
          
          // Обработка резюме
          if (response.data.profile.user_resume) {
            const base64Resume = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${response.data.profile.user_resume}`;
            setResumeSrc(base64Resume);
          }

        } else {
          setError('Анкета не найдена');
        }
      } catch (err) {
        setError('Ошибка при загрузке анкеты');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [profileId]);


  const handleInviteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowPopup(true);
  };

  const handleSendInvitation = (invitationData) => {
    console.log('Отправка приглашения:', invitationData);
    // Здесь можно добавить логику отправки на сервер
    setShowPopup(false);
  };

  if (loading) return <p>Загрузка анкеты...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!profile) return <p>Анкета не найдена</p>;

  // Деструктурируем нужные поля
  const {
    profile_name,
    salary_from,
    salary_to,
    work_time = [],
    work_place = [],
    work_city,
    biography,
    career,
    skills = [],
    work_experience = [],
    activity_fields = [],
    qualities = [],
    educations = [],
    languages_knowledge = [],
    additionally,
    profile_image,
    user_resume
  } = profile;

  // Средняя зарплата
  const salary_mid = salary_from && salary_to ? Math.round((salary_from + salary_to) / 2) : null;

  // Формируем кандидата для приглашения
  const candidate = {
    id: profileId,
    name: profile_name,
    position: "Фронтенд разработчик" // Это можно либо добавить в модель, либо получать из другой таблицы
  };

  return (
    <div className='UserCard'>
      <h1>{user.name} - {profile_name || 'Анкета соискателя'}</h1>
      <div className="flex-work">
        <div>
          <h2>Рабочие предпочтения:</h2>
          <ul>
            <li>Заработная плата: {salary_from ? salary_from.toLocaleString() : '—'} - {salary_to ? salary_to.toLocaleString() : '—'} рублей в месяц</li>
            <li>Время работы: {work_time.length > 0 ? work_time.join(', ') : 'Не указано'}</li>
            <li>Предпочитаемые места работы: {work_place.length > 0 ? work_place.join(', ') : 'Не указано'}</li>
            <li>Город работы: {work_city || 'Не указан'}</li>
          </ul>
        </div>
        <div className="image-place">
          <img src={imageSrc} alt="Фото соискателя" />
        </div>
      </div>

      <h2>Биография</h2>
      <p>{biography || 'Биография не указана'}</p>

      {career && (
        <>
          <h3>Начало карьеры</h3>
          <p>{career}</p>
        </>
      )}

      {skills.length > 0 && (
        <>
          <h3>Навыки</h3>
          <ul>
            {skills.map((skill, idx) => <li key={idx}>{skill}</li>)}
          </ul>
        </>
      )}

      {work_experience.length > 0 && (
        <>
          <h3>Опыт работы</h3>
          <ul>
            {work_experience.map((exp, idx) => <li key={idx}>{exp}</li>)}
          </ul>
        </>
      )}

      {activity_fields.length > 0 && (
        <>
          <h3>Сфера занятий</h3>
          <ul>
            {activity_fields.map((field, idx) => <li key={idx}>{field}</li>)}
          </ul>
        </>
      )}

      {educations.length > 0 && (
        <>
          <h3>Образование</h3>
          <ul>
            {educations.map((edu, idx) => <li key={idx}>{edu}</li>)}
          </ul>
        </>
      )}

      {languages_knowledge.length > 0 && (
        <>
          <h3>Знание языков</h3>
          <ul>
            {languages_knowledge.map((lang, idx) => <li key={idx}>{lang}</li>)}
          </ul>
        </>
      )}

      {qualities.length > 0 && (
        <>
          <h3>Личные качества</h3>
          <ul>
            {qualities.map((quality, idx) => <li key={idx}>{quality}</li>)}
          </ul>
        </>
      )}

      {additionally && (
        <>
          <h3>Дополнительная информация</h3>
          <p>{additionally}</p>
        </>
      )}

      <div className="flex-Profile-buttons">
        <a   
          onClick={() => handleInviteClick({
              id: profile.profile_id,
              user_id: user.user_id,
              name: user.name,
              position: profile.profile_name
          })}
        >
              Пригласить на работу
        </a>
        <a href={resumeSrc} download>Скачать резюме</a>
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