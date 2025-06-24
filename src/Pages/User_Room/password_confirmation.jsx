import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './password_confirm.css';

export function PasswordConfirm({ onConfirm, onCancel }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    setPassword(e.target.value);
    setError('');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Пожалуйста, введите ваш текущий пароль');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://localhost:5000/api/verify-password',
        { password },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onConfirm();
      } else {
        setError(response.data.message || 'Неверный пароль');
      }
    } catch (err) {
      console.error('Ошибка при проверке пароля:', err);
      setError(err.response?.data?.message || 'Ошибка при проверке пароля');
    }
  }, [password, onConfirm]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <div className="confirm-overlay">
      <div className="confirm-container">
        <h2 className="confirm-title">Подтверждение личности</h2>
        <p className="confirm-message">Для изменения данных профиля введите ваш текущий пароль</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Текущий пароль</label>
            <input
              type="password"
              value={password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Введите текущий пароль"
              autoFocus
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="confirm-actions">
            <button type="submit" className="confirm-btn">Подтвердить</button>
            <button type="button" className="cancel-btn" onClick={onCancel}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}