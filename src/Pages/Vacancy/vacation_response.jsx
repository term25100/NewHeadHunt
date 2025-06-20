import './vacation_response.css';
import React from 'react';
import { useState } from 'react';
export function ResponsePopup({ vacation, onClose, onSend }) {
    const [formData, setFormData] = React.useState({
      title_message: `Вакансия - ${vacation.vacation_name}`,
      message_response: '',
      email: '',
      resume_file: '',
      defautMessage: `Здравствуйте, меня заинтересовала вакансия: ${vacation.vacation_name}. Хотелось бы узнать от вас больше информации и когда можно подъехать на собеседование.`
    });

    const [isDraggingDoc, setIsDraggingDoc] = useState(false);
    const [docName, setDocName] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDragOverDoc = (e) => {
      e.preventDefault();
      setIsDraggingDoc(true);
    };

    const handleDragLeaveDoc = () => {
      setIsDraggingDoc(false);
    };

    const handleDropDoc = (e) => {
      e.preventDefault();
      setIsDraggingDoc(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.toLowerCase().endsWith('.docx')) {
        processDoc(file);
      } else {
        setError('Пожалуйста, загрузите файл в формате .docx');
      }
    };

    const handleFileChangeDoc = (e) => {
      const file = e.target.files[0];
      if (file && file.name.toLowerCase().endsWith('.docx')) {
        processDoc(file);
      } else {
        setError('Пожалуйста, выберите файл в формате .docx');
      }
    };

    const processDoc = (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        // dataUrl будет в формате data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,...
        const base64 = dataUrl.split(',')[1];
        setDocName(file.name);
        setFormData(prev => ({
          ...prev,
          resume_file: base64
        }));
        setError('');
      };
      reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Отправляемые данные:', {
            ...formData,
            vacation_id: vacation.id,       
            user_id: vacation.user_id
        });

        try {
          const response = await fetch('http://localhost:5000/api/vacations-response', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              vacation_id: vacation.id,       
              user_id: vacation.user_id
            })
          });

          if (!response.ok) {
            throw new Error('Ошибка при отправке отклика!');
          }

          onSend(); // Оповещаем родительский компонент
          alert("Сообщение отправлено!");
          onClose(); // Закрываем попап
        } catch (error) {
          console.error('Ошибка:', error);
          alert('Произошла ошибка при отправке отклика!');
        }
    };

    return (
    <div className="invitation-popup-overlay">
      <div className="invitation-popup-container">
        <h3>Отклик на вакансию</h3>
        <p>Вакансия: <strong>{vacation.vacation_name}</strong></p>
        
        <form onSubmit={handleSubmit}>
          <div className="invitation-popup-form-group">
            <label>Тема обращения:</label>
            <input
              type="text"
              name="title_message"
              value={`Вакансия - ${vacation.vacation_name}`}
              onChange={handleChange}
              placeholder="Например: Предложение работы Frontend разработчиком"
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
              placeholder='Введите сообщение для обратной связи с работодателем!'
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
          
          <div className="form-section">
            <h3 className="section-title">Загрузить резюме (.docx)</h3>
            <div
              className={`doc-upload ${isDraggingDoc ? 'dragging' : ''}`}
              onDragOver={handleDragOverDoc}
              onDragLeave={handleDragLeaveDoc}
              onDrop={handleDropDoc}
              style={{
                border: '.15vw dashed #999',
                padding: '1vw',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '.5vw',
                marginBottom: '.5vw'
              }}
            >
              {docName ? (
                <>
                  <p>Выбран файл: <strong>{docName}</strong></p>
                  <button
                    type="button"
                    onClick={() => {
                      setDocName('');
                      setFormData(prev => ({ ...prev, resume_file: '' }));
                    }}
                  >
                    Удалить файл
                  </button>
                </>
              ) : (
                <>
                  <p>Перетащите файл .docx сюда или</p>
                  <label style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}>
                    Выберите файл
                    <input
                      type="file"
                      accept=".docx"
                      onChange={handleFileChangeDoc}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p style={{ fontSize: '.8vw', color: '#666' }}>Максимальный размер файла: 10MB</p>
                </>
              )}
            </div>
          </div>

          <div className="invitation-popup-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Отправить приглашение</button>
          </div>
        </form>
      </div>
    </div>
  );
}