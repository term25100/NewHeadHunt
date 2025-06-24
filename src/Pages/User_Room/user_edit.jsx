import React, { useState, useCallback } from 'react';
import './user_edit.css';
import axios from 'axios';

export function User_Edit({ userId, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profile_image: ''
  });

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleDragOverImage = useCallback((e) => {
    e.preventDefault();
    setIsDraggingImage(true);
  }, []);

  const handleDragLeaveImage = useCallback(() => {
    setIsDraggingImage(false);
  }, []);

  const processImage = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const base64 = dataUrl.split(',')[1];
      setImagePreview(dataUrl);
      setFormData(prev => ({
        ...prev,
        profile_image: base64
      }));
      setError('');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDropImage = useCallback((e) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
    } else {
      setError('Пожалуйста, загрузите изображение (PNG, JPG, SVG)');
    }
  }, [processImage]);

  const handleFileChangeImage = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
    } else {
      setError('Пожалуйста, выберите изображение (PNG, JPG, SVG)');
    }
  }, [processImage]);

  const validateForm = useCallback(() => {
    let errors = [];

    if (!formData.username.trim()) {
      errors.push('Имя пользователя обязательно');
    }

    if (!formData.email.trim()) {
      errors.push('Email обязателен');
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.push('Введите корректный email');
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.push('Пароли не совпадают');
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }

    setError('');
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      // Удаляем confirmPassword из данных перед отправкой
      const { confirmPassword, ...requestData } = formData;
      
      // Если пароль не менялся, не отправляем его
      if (!requestData.password) {
        delete requestData.password;
      }

      const response = await axios.put(
        `http://localhost:5000/api/user-edit/${userId}`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Данные успешно обновлены!');
        onUpdate();
        onClose();
      } else {
        setError(response.data.message || 'Ошибка при обновлении данных');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ошибка при отправке данных');
    }
  }, [formData, userId, onClose, onUpdate, validateForm]);

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="popup-title">Редактирование профиля</h2>

        <form onSubmit={handleSubmit} className="scrollable-form">
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div className="form-group">
            <label>Электронная почта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              required
            />
          </div>

          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Введите ваш телефон"
            />
          </div>

          <div className="form-group">
            <label>Новый пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите новый пароль"
            />
          </div>

          <div className="form-group">
            <label>Подтверждение пароля</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Повторите новый пароль"
            />
          </div>

          <div className="form-section">
            <h3 className="section-title">Изображение профиля</h3>
            <div
              className={`image-upload ${isDraggingImage ? 'dragging' : ''}`}
              onDragOver={handleDragOverImage}
              onDragLeave={handleDragLeaveImage}
              onDrop={handleDropImage}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, profile_image: '' }));
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
                        onChange={handleFileChangeImage}
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
            {error && <div className="error-message" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
            <button type="submit" className="submit-btn">Сохранить изменения</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}