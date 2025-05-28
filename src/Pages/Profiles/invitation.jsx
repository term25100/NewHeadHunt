import React from 'react';
import './invitation.css';

export const InvitationPopup = ({ candidate, onClose, onSend }) => {
  const [formData, setFormData] = React.useState({
    subject: '',
    salaryRange: '',
    message: `Уважаемый(ая) ${candidate.name}, мы рады предложить вам позицию в нашей компании!`
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({
      ...formData,
      candidateId: candidate.id
    });
  };

  return (
    <div className="invitation-popup-overlay">
      <div className="invitation-popup-container">
        <h3>Приглашение на работу</h3>
        <p>Кандидат: <strong>{candidate.name}Аганов Сергей Федорович</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div className="invitation-popup-form-group">
            <label>Тема обращения:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Например: Предложение работы Frontend разработчиком"
              required
            />
          </div>
          
          <div className="invitation-popup-form-group">
            <label>Диапазон заработной платы:</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="Например: 100 000 - 150 000 руб."
              required
            />
          </div>
          
          <div className="invitation-popup-form-group">
            <label>Сообщение:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
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