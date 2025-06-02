import React from 'react';
import './vacation_add.css';
import { useState } from 'react';
import axios from 'axios';

export function Vacancy_Add({ onClose }) {
  const [formData, setFormData] = useState({
    vacation_name: '',
    salary_from: '',
    salary_to: '',
    work_type: [], // Изменено с массива на строку
    about_work_type: '',
    work_region: '',
    work_city: '',
    work_adress: '',
    zip_code: '',
    company_email: '',
    company_phone: '',
    company_site: '',
    work_description: '',
    required_skills: '', // Изменено с массива на строку
    advantages_describe: '',
    work_advantages: '', // Изменено с массива на строку
    additionally: '',
    company_image: ''
  });

  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // Отделяем base64 от префикса data URL
      const base64 = dataUrl.split(',')[1]; // всё после запятой

      setImagePreview(dataUrl); // для превью оставляем полный dataUrl

      setFormData(prev => ({
        ...prev,
        company_image: base64 // сохраняем только base64 без префикса
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
    
    if (!formData.work_type.trim()) { // Проверка строки вместо массива
      errors.push('Укажите тип работы');
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
    
    if (!formData.required_skills.trim()) { // Проверка строки вместо массива
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
    
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      console.log(token);
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
        // Массивы преобразуем из строк при необходимости
        work_type: formData.work_type.split(',').map(item => item.trim()).filter(item => item),
        required_skills: formData.required_skills.split(',').map(item => item.trim()).filter(item => item),
        work_advantages: formData.work_advantages ? 
          formData.work_advantages.split(',').map(item => item.trim()).filter(item => item) : 
          null
      };
      console.log('Данные для отправки на сервер:', requestData);
      const response = await axios.post('http://localhost:5000/api/vacations', requestData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        onClose();
        alert("Вакансия добавлена!");
        window.location.reload();
      }
    } catch (err) {
      console.error('Ошибка при создании вакансии:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при создании вакансии. Проверьте введенные данные.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="popup-title">Добавить вакансию</h2>
        
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
                  <label>Типы работы (введите текст)</label>
                  <input
                    type="text"
                    name="work_type"
                    value={formData.work_type}
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
                <h3 className="section-title">Местоположение</h3>
                
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
            </div>

            <div className="form-column">
              <div className="form-section">
                <h3 className="section-title">Контакты</h3>
                
                <div className="form-group">
                  <label>Email компании</label>
                  <input
                    type="email"
                    name="company_email"
                    value={formData.company_email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Телефон компании</label>
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
                  <label>Требуемые навыки (введите текст)</label>
                  <input
                    type="text"
                    name="required_skills"
                    value={formData.required_skills}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Преимущества работы</label>
                  <textarea
                    name="advantages_describe"
                    value={formData.advantages_describe}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Список преимуществ (введите текст)</label>
                  <input
                    type="text"
                    name="work_advantages"
                    value={formData.work_advantages}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Дополнительная информация</label>
                  <textarea
                    name="additionally"
                    value={formData.additionally}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

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
                    onClick={() => setImagePreview('')}
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
                    <p className="file-requirements">PNG, JPG, SVG до 5MB</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="form-actions">
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-btn">Опубликовать вакансию</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}