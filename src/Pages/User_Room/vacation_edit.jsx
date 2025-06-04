import React, { useState, useEffect } from 'react';
import './vacation_add.css';
import axios from 'axios';

export function Vacancy_Edit({ vacationId, onUpdateVacancies, onClose }) {
  const [formData, setFormData] = useState({
    vacation_name: '',
    salary_from: '',
    salary_to: '',
    work_type: [], 
    work_place: '',
    about_work_type: '',
    work_region: '',
    work_city: '',
    work_adress: '',
    zip_code: '',
    company_email: '',
    company_phone: '',
    company_site: '',
    work_description: '',
    required_skills: '', 
    advantages_describe: '',
    work_advantages: '', 
    additionally: '',
    company_image: '',
    active: false,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Загрузка данных вакансии при монтировании или изменении vacationId
  useEffect(() => {
    if (!vacationId) return;

    const fetchVacation = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/vacation/${vacationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const v = response.data.vacation;

          setFormData({
            vacation_name: v.vacation_name || '',
            salary_from: v.salary_from?.toString() || '',
            salary_to: v.salary_to?.toString() || '',
            work_type: Array.isArray(v.work_type) ? v.work_type.join(', ') : '',
            work_place: Array.isArray(v.work_place) ? v.work_place.join(', ') : '',
            about_work_type: v.about_work_type || '',
            work_region: v.work_region || '',
            work_city: v.work_city || '',
            work_adress: v.work_adress || '',
            zip_code: v.zip_code?.toString() || '',
            company_email: v.company_email || '',
            company_phone: v.company_phone || '',
            company_site: v.company_site || '',
            work_description: v.work_description || '',
            required_skills: Array.isArray(v.required_skills) ? v.required_skills.join(', ') : '',
            advantages_describe: v.advantages_describe || '',
            work_advantages: Array.isArray(v.work_advantages) ? v.work_advantages.join(', ') : '',
            additionally: v.additionally || '',
            company_image: v.company_image || '',
            active: !!v.active,
          });

          // Для превью изображения: если есть company_image (base64), создаём dataURL
          if (v.company_image) {
            setImagePreview(`data:image/png;base64,${v.company_image}`);
          } else {
            setImagePreview('');
          }
        } else {
          setError('Не удалось загрузить данные вакансии');
        }
      } catch (err) {
        console.error(err);
        setError('Ошибка при загрузке вакансии');
      } finally {
        setLoading(false);
      }
    };

    fetchVacation();
  }, [vacationId]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const base64 = dataUrl.split(',')[1];
      setImagePreview(dataUrl);
      setFormData(prev => ({
        ...prev,
        company_image: base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.vacation_name.trim()) {
      errors.push('Название вакансии обязательно');
    }
    
    if (!formData.salary_from || isNaN(formData.salary_from)) {
      errors.push('Зарплата "от" должна быть числом');
    }
    
    if (!formData.salary_to || isNaN(formData.salary_to)) {
      errors.push('Зарплата "до" должна быть числом');
    }
    
    if (!formData.work_type.trim()) {
      errors.push('Укажите тип работы');
    }

    if (!formData.work_place.trim()) {
      errors.push('Укажите место работы');
    }
    
    if (!formData.work_region.trim()) {
      errors.push('Регион обязателен');
    }
    
    if (!formData.work_city.trim()) {
      errors.push('Город обязателен');
    }
    
    if (!formData.company_email.trim() || !/^\S+@\S+\.\S+$/.test(formData.company_email)) {
      errors.push('Введите корректный email (например, example@domain.com)');
    }
    
    if (!formData.company_phone.trim() || !/^\+?[0-9\s\-()]+$/.test(formData.company_phone)) {
      errors.push('Введите корректный телефон (например, +7(123)456-78-90)');
    }
    
    if (!formData.work_description.trim()) {
      errors.push('Описание работы обязательно');
    }
    
    if (!formData.required_skills.trim()) {
      errors.push('Укажите требуемые навыки');
    }
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      const cleanedPhone = formData.company_phone.replace(/[^\d+]/g, '');

      const requestData = {
        ...formData,
        salary_from: parseInt(formData.salary_from),
        salary_to: parseInt(formData.salary_to),
        zip_code: formData.zip_code ? parseInt(formData.zip_code) : null,
        company_phone: cleanedPhone,
        work_type: formData.work_type.split(',').map(item => item.trim()).filter(item => item),
        work_place: formData.work_place.split(',').map(item => item.trim()).filter(item => item),
        required_skills: formData.required_skills.split(',').map(item => item.trim()).filter(item => item),
        work_advantages: formData.work_advantages ? 
          formData.work_advantages.split(',').map(item => item.trim()).filter(item => item) : 
          null,
        active: formData.active,
      };

      // Отправляем PUT-запрос на обновление вакансии
      const response = await axios.put(`http://localhost:5000/api/vacation-edit/${vacationId}`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        alert('Вакансия успешно обновлена!');
        onUpdateVacancies();
        onClose();
      } else {
        setError(response.data.message || 'Ошибка при обновлении вакансии');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Произошла ошибка при обновлении вакансии. Проверьте введённые данные.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="popup-title">Редактировать вакансию</h2>

        {loading ? (
          <p>Загрузка данных...</p>
        ) : (
          <form onSubmit={handleSubmit} className="scrollable-form">
            <div className="form-columns">
              <div className="form-column">
                <div className="form-section">
                  <h3 className="section-title">Основная информация</h3>

                  <div className="form-group">
                    <label>Название вакансии</label>
                    <input
                      type="text"
                      name="vacation_name"
                      value={formData.vacation_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Зарплата от</label>
                    <input
                      type="number"
                      name="salary_from"
                      value={formData.salary_from}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Зарплата до</label>
                    <input
                      type="number"
                      name="salary_to"
                      value={formData.salary_to}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Типы работы (через запятую)</label>
                    <input
                      type="text"
                      name="work_type"
                      value={formData.work_type}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Места работы (через запятую)</label>
                    <input
                      type="text"
                      name="work_place"
                      value={formData.work_place}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Описание типа работы</label>
                    <textarea
                      name="about_work_type"
                      value={formData.about_work_type}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Адрес работы</h3>

                  <div className="form-group">
                    <label>Регион</label>
                    <input
                      type="text"
                      name="work_region"
                      value={formData.work_region}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Город</label>
                    <input
                      type="text"
                      name="work_city"
                      value={formData.work_city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Адрес</label>
                    <input
                      type="text"
                      name="work_adress"
                      value={formData.work_adress}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Почтовый индекс</label>
                    <input
                      type="number"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Контакты компании</h3>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="company_email"
                      value={formData.company_email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Телефон</label>
                    <input
                      type="tel"
                      name="company_phone"
                      value={formData.company_phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Сайт компании</label>
                    <input
                      type="url"
                      name="company_site"
                      value={formData.company_site}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Описание вакансии</h3>

                  <div className="form-group">
                    <label>Описание работы</label>
                    <textarea
                      name="work_description"
                      value={formData.work_description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Требуемые навыки (через запятую)</label>
                    <input
                      type="text"
                      name="required_skills"
                      value={formData.required_skills}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Описание преимуществ</label>
                    <textarea
                      name="advantages_describe"
                      value={formData.advantages_describe}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Преимущества работы (через запятую)</label>
                    <input
                      type="text"
                      name="work_advantages"
                      value={formData.work_advantages}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Дополнительно</label>
                    <textarea
                      name="additionally"
                      value={formData.additionally}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                    />
                    Сделать вакансию активной
                  </label>
                </div>
              </div>

              <div className="form-column">
                <div className="form-section">
                  <h3 className="section-title">Логотип компании</h3>
                  <div
                    className={`image-upload ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                        <button
                          type="button"
                          className="change-image-btn"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, company_image: '' }));
                          }}
                        >
                          Изменить изображение
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="upload-instructions">
                          <p>Перетащите изображение сюда или</p>
                          <label className="file-input-label">
                            Выберите файл
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="file-input"
                            />
                          </label>
                          <p className="file-requirements">PNG, JPG до 5MB</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              {error && (
                <div className="error-message" style={{ whiteSpace: 'pre-wrap' }}>
                  {error}
                </div>
              )}
              <button type="submit" className="submit-btn">
                Сохранить изменения
              </button>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}