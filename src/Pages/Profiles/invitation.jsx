import React from 'react';
import './invitation.css';

export const InvitationPopup = ({ candidate, onClose, onSend }) => {
  const [formData, setFormData] = React.useState({
    title_message: `Анкета - ${candidate.position}`,
    name_company: '',
    salary_range: '',
    message_response: '',
    email: '',
    defautMessage: `Уважаемый(ая) ${candidate.name}, мы рады предложить вам позицию ${candidate.position} в нашей компании!`
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/profiles-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profile_id: candidate.id,       
          user_id: candidate.user_id
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке приглашения');
      }

      onSend(); // Оповещаем родительский компонент
      alert("Сообщение отправлено!");
      onClose(); // Закрываем попап
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при отправке приглашения');
    }
  };

  return (
    <div className="invitation-popup-overlay">
      <div className="invitation-popup-container">
        <h3>Приглашение на работу</h3>
        <p>Кандидат: <strong>{candidate.name}</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div className="invitation-popup-form-group">
            <label>Тема обращения:</label>
            <input
              type="text"
              name="title_message"
              value={`Анкета - ${candidate.position}`}
              onChange={handleChange}
              placeholder="Например: Предложение работы Frontend разработчиком"
              required
            />
          </div>

          <div className="invitation-popup-form-group">
            <label>Название вашей организации:</label>
            <input
              type="text"
              name="name_company"
              value={formData.name_company}
              onChange={handleChange}
              placeholder="Например: 'ООО Диол'"
              required
            />
          </div>
          
          <div className="invitation-popup-form-group">
            <label>Диапазон заработной платы:</label>
            <input
              type="text"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleChange}
              placeholder="Например: Мы готовы платить вам 100 000 - 150 000 руб."
              required
            />
          </div>
          
          <div className="invitation-popup-form-group">
            <label>Сообщение:</label>
            <textarea
              name="message_response"
              value={formData.message_response}
              onChange={handleChange}
              rows="5"
              placeholder={`Мы были впечатлены вашей анкетой "${candidate.position}" и хотели бы предложить вам сотрудничество.`}
              required
            />
          </div>

          <div className="invitation-popup-form-group">
            <label>Ваш email для обратной связи с пользователем:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите email для обратной связи с кандидатом"
              required
            />
          </div>
          
          <div className="invitation-popup-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Отправить приглашение</button>
          </div>
        </form>
      </div>
    </div>
  );
};