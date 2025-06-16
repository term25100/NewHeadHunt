import './vacation.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ResponsePopup } from './vacation_response';

export function Vacation_Body(){
  const { vacationId } = useParams();
  const [vacation, setVacation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedVacation, setSelectedVacation] = useState(null);

  //console.log(vacationId);
  useEffect(() => {
    async function fetchVacation() {
      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`http://localhost:5000/api/vacation/${vacationId}`);
        if (response.data.success) {
          setVacation(response.data.vacation);
        } else {
          setError('Вакансия не найдена');
        }
      } catch (err) {
        setError('Ошибка при загрузке вакансии');
      } finally {
        setLoading(false);
      }
    }
    fetchVacation();
  }, [vacationId]);

  if (loading) return <p>Загрузка вакансии...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!vacation) return <p>Вакансия не найдена</p>;

  // Для удобства деструктурируем нужные поля
  const {
    vacation_name,
    salary_from,
    salary_to,
    work_type = [],
    work_place = [],
    about_work_type,
    work_region,
    work_city,
    work_adress,
    zip_code,
    company_email,
    company_phone,
    company_site,
    work_description,
    required_skills = [],
    work_advantages = [],
    advantages_describe,
    additionally,
    company_image
  } = vacation;

  // Средняя зарплата (если нужно)
  const salary_mid = salary_from && salary_to ? Math.round((salary_from + salary_to) / 2) : null;

  const handleResponseClick = (vacation) => {
    setSelectedVacation(vacation);
    setShowPopup(true);
  };

  const handleSendResponse = (responseData) => {
    console.log('Отправка приглашения:', responseData);
    // Здесь можно добавить логику отправки на сервер
    setShowPopup(false);
  };

  return (
    <div className='frame-container'>
      <div className="vac-banner">
        <div className="blue-description">
          <h1>{vacation_name || 'Вакансия'}</h1>
          <h2>Ты готов к работе, где ценят тебя по-настоящему?</h2>
          <p>В компании «Диол» мы создаём не просто рабочие места — мы строим команду мечты!</p>
          {company_site ? (
            <a href={company_site} className='goToCompany' target="_blank" rel="noreferrer">Перейти на сайт</a>
          ) : (
            <span className='goToCompany disabled'>Сайт компании отсутствует</span>
          )}
        </div>
        <div className="banner-person">
          {/* {company_image && <img src={company_image} alt="Company" />} */}
        </div>
      </div>

      <div className="vac-info-container">
        <div className="work-type-container">
          <h1>Зарплата</h1>
          <div className='salary-container'>
            <div className="salary-flex">
              <label htmlFor="salary-from">Зарплата от:</label>
              <p name='salary-from'>{salary_from ? salary_from.toLocaleString() : '—'} <span className='currency'>₽</span></p>
            </div>
            <div className="salary-flex">
              <label htmlFor="salary-to">Зарплата до:</label>
              <p name='salary-to'>{salary_to ? salary_to.toLocaleString() : '—'} <span className='currency'>₽</span></p>
            </div>
            <div className="salary-col">
              <label htmlFor="salary-mid">Средняя зарплата для подобных вакансий:</label>
              <p name='salary-mid'>{salary_mid ? salary_mid.toLocaleString() : '—'} <span className='currency'>₽</span></p>
            </div>
          </div>

          <h1>Варианты работы</h1>
          <div className="work-type">
            <ul>
              {work_type.length > 0 ? work_type.map((type, idx) => <li key={idx}>{type}</li>) : <li>Не указано</li>}
            </ul>
          </div>

          <h1>Возможные места работы</h1>
          <div className="work-type">
            <ul>
              {work_place.length > 0 ? work_place.map((type, idx) => <li key={idx}>{type}</li>) : <li>Не указано</li>}
            </ul>
          </div>
          {about_work_type && (
            <>
              <h1>Про удаленную работу</h1>
              <div className='work-type-description'>
                <p>{about_work_type}</p>
              </div>
            </>
          )}
        </div>

        <div className="main-info-container">
          <div className="location-data">
            <div className="loc-data">
              <h1>Местоположение</h1>
              <div className='flex-loc'>
                <div>
                  <div className='flex-location'>
                    <label htmlFor="locate-reg">Область: </label>
                    <p name="locate-reg">{work_region || '—'}</p>
                  </div>
                  <div className='flex-location'>
                    <label htmlFor="locate-city">Город: </label>
                    <p name="locate-city">{work_city || '—'}</p>
                  </div>
                </div>
                <div>
                  <div className='flex-location'>
                    <label htmlFor="locate-adress">Адрес: </label>
                    <p name="locate-adress">{work_adress || '—'}</p>
                  </div>
                  <div className='flex-location'>
                    <label htmlFor="locate-index">Индекс: </label>
                    <p name="locate-index">{zip_code || '—'}</p>
                  </div>
                </div>
              </div>
              <details>
                <summary className='summary-map'>Посмотреть на карте</summary>
                <div>
                  {/* Можно динамически подставить карту по адресу, пока оставлю статическую */}
                  <iframe 
                    className='map-location' 
                    src="https://yandex.ru/map-widget/v1/?ll=37.612418%2C54.185434&mode=search&ol=geo&z=17.18" 
                    width="560" 
                    height="400" 
                    frameBorder="1" 
                    allowFullScreen={true}
                    title="map"
                  ></iframe>
                </div>
              </details>
            </div>

            <div className="description-vac">
              <h1>Описание вакансии</h1>
              <p id='vac-description'>{work_description || 'Описание отсутствует'}</p>

              {required_skills.length > 0 && (
                <>
                  <h1>Требования:</h1>
                  <ul>
                    {required_skills.map((skill, idx) => <li key={idx}>{skill}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div className="adjust-data">
            <div className="contact-data">
              <h1>Контакты</h1>
              <div className='flex-contact'>
                <label htmlFor="contact-email">Электронная почта: </label>
                <p name="contact-email">{company_email || '—'}</p>
              </div>
              <div className='flex-contact'>
                <label htmlFor="contact-phone">Телефон: </label>
                <p name="contact-phone">{company_phone || '—'}</p>
              </div>
              <div className='flex-contact'>
                <label htmlFor="contact-site">Сайт компании: </label>
                {company_site ? (
                  <a href={company_site} target="_blank" rel="noreferrer">{company_site}</a>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>

            <div className="adjust-descriptions">
              <h1>Преимущества работы в компании</h1>
              <p>{advantages_describe || 'Информация отсутствует'}</p>

              {work_advantages.length > 0 && (
                <>
                  <h1>Преимущества:</h1>
                  <ul>
                    {work_advantages.map((adv, idx) => <li key={idx}>{adv}</li>)}
                  </ul>
                </>
              )}

              {additionally && (
                <>
                  <h1>Дополнительно</h1>
                  <p className='finals'>{additionally}</p>
                </>
              )}

              <a 
                className='response-button' 
                onClick={() => handleResponseClick({
                  id: vacation.vacation_id,
                  user_id: vacation.user_id,
                  vacation_name: vacation.vacation_name
                })}
              >
                Откликнуться на вакансию
              </a>
            </div>
          </div>
        </div>
      </div>
        {showPopup && selectedVacation && (
          <ResponsePopup
            vacation={selectedVacation}
            onClose={() => setShowPopup(false)}
            onSend={handleSendResponse}
          />
        )}
    </div>
  );
}
