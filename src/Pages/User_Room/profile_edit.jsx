import React, { useState, useEffect, useCallback } from 'react';
import './vacation_add.css';
import axios from 'axios';

export function Profile_Edit({ profileId, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    profile_name: '',
    salary_from: '',
    salary_to: '',
    work_time: [],
    work_place: [],
    work_city: '',
    biography: '',
    career: '',
    skills: [],
    work_experience: [],
    activity_fields: [],
    qualities: [],
    educations: [],
    languages_knowledge: [],
    additionally: '',
    profile_image: '',
    user_resume: ''
  });

  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const [docName, setDocName] = useState('');
  const [docPreview, setDocPreview] = useState('');
  const [error, setError] = useState('Текущее резюме');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:5000/api/profile/${profileId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data.success) {
          const profile = response.data.profile;
          setFormData({
            ...profile,
            skills: profile.skills?.join(', ') || '',
            work_time: profile.work_time?.join(', ') || '',
            work_place: profile.work_place?.join(', ') || '',
            work_experience: profile.work_experience?.join(', ') || '',
            activity_fields: profile.activity_fields?.join(', ') || '',
            qualities: profile.qualities?.join(', ') || '',
            educations: profile.educations?.join(', ') || '',
            languages_knowledge: profile.languages_knowledge?.join(', ') || ''
          });

          if (profile.profile_image) {
            setImagePreview(`data:image/png;base64,${profile.profile_image}`);
          }

          if (profile.user_resume) {
            setDocName('Текущее резюме');
            setDocPreview(profile.user_resume);
          } else {
            setDocName('');
            setDocPreview(''); // Если резюме нет, то очищаем имя
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

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
      const base64 = dataUrl.split(',')[1]; // base64 без префикса
      setImagePreview(dataUrl);
      setFormData(prev => ({
        ...prev,
        profile_image: base64
      }));
      setError('');
    };
    reader.readAsDataURL(file);
  }, [setImagePreview, setFormData]);

  const handleDropImage = useCallback((e) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
    } else {
      setError('Пожалуйста, загрузите изображение (PNG, JPG)');
    }
  }, [processImage]);

  const handleFileChangeImage = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      processImage(file);
    } else {
      setError('Пожалуйста, выберите изображение (PNG, JPG)');
    }
  }, [processImage]);


  const handleDragOverDoc = useCallback((e) => {
    e.preventDefault();
    setIsDraggingDoc(true);
  }, []);

  const handleDragLeaveDoc = useCallback(() => {
    setIsDraggingDoc(false);
  }, []);


  const processDoc = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      // dataUrl будет в формате data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,...
      const base64 = dataUrl.split(',')[1];
      setDocName(file.name);
      setFormData(prev => ({
        ...prev,
        user_resume: base64
      }));
      setError('');
    };
    reader.readAsDataURL(file);
  }, [setDocName, setFormData]);

  const handleDropDoc = useCallback((e) => {
    e.preventDefault();
    setIsDraggingDoc(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.docx')) {
      processDoc(file);
    } else {
      setError('Пожалуйста, загрузите файл в формате .docx');
    }
  }, [processDoc]);

  const handleFileChangeDoc = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.docx')) {
      processDoc(file);
    } else {
      setError('Пожалуйста, выберите файл в формате .docx');
    }
  }, [processDoc]);


  const validateForm = useCallback(() => {
    let errors = [];

    if (!formData.profile_name.trim()) {
      errors.push('Имя профиля обязательно');
    }

    if (formData.salary_from && isNaN(formData.salary_from)) {
      errors.push('Зарплата "от" должна быть числом');
    }

    if (formData.salary_to && isNaN(formData.salary_to)) {
      errors.push('Зарплата "до" должна быть числом');
    }

    if (!formData.work_city.trim()) {
      errors.push('Город обязателен');
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }

    setError('');
    return true;
  }, [formData.profile_name, formData.salary_from, formData.salary_to, formData.work_city]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
        return;
      }

      const requestData = {
        ...formData,
        salary_from: formData.salary_from ? parseInt(formData.salary_from) : null,
        salary_to: formData.salary_to ? parseInt(formData.salary_to) : null,
        skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : formData.skills,
        work_time: typeof formData.work_time === 'string' ? formData.work_time.split(',').map(s => s.trim()).filter(Boolean) : formData.work_time,
        work_place: typeof formData.work_place === 'string' ? formData.work_place.split(',').map(s => s.trim()).filter(Boolean) : formData.work_place,
        work_experience: typeof formData.work_experience === 'string' ? formData.work_experience.split(',').map(s => s.trim()).filter(Boolean) : formData.work_experience,
        activity_fields: typeof formData.activity_fields === 'string' ? formData.activity_fields.split(',').map(s => s.trim()).filter(Boolean) : formData.activity_fields,
        qualities: typeof formData.qualities === 'string' ? formData.qualities.split(',').map(s => s.trim()).filter(Boolean) : formData.qualities,
        educations: typeof formData.educations === 'string' ? formData.educations.split(',').map(s => s.trim()).filter(Boolean) : formData.educations,
        languages_knowledge: typeof formData.languages_knowledge === 'string' ? formData.languages_knowledge.split(',').map(s => s.trim()).filter(Boolean) : formData.languages_knowledge,
      };

      const response = await axios.put(
        `http://localhost:5000/api/profile-edit/${profileId}`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Профиль успешно обновлен!');
        onUpdate();
        onClose();
      } else {
        setError(response.data.message || 'Ошибка при обновлении профиля');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ошибка при отправке данных');
    }
  }, [formData, profileId, onClose, onUpdate, validateForm]);

  const handleExtractAndFill = useCallback(async () => {
    if (!formData.user_resume) {
      setError('Сначала загрузите резюме (.docx)');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/extract-and-fill', { user_resume: formData.user_resume });

      const extractedData = response.data;

      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));

      setError('');
    } catch (err) {
      console.error('Ошибка при извлечении текста:', err);
      setError(err.response?.data?.message || 'Ошибка при извлечении текста');
    }
  }, [formData.user_resume, setFormData]);

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="popup-title">Редактирование профиля</h2>

        <form onSubmit={handleSubmit} className="scrollable-form">
          <div className="form-group">
            <label>Имя профиля</label>
            <input
              type="text"
              className='Profile_name'
              name="profile_name"
              value={formData.profile_name}
              onChange={handleChange}
              placeholder='Введите название должности которую хотите занимать'
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
              placeholder='Введите минимальную желаемую зарплату'
            />
          </div>

          <div className="form-group">
            <label>Зарплата до</label>
            <input
              type="number"
              name="salary_to"
              value={formData.salary_to}
              onChange={handleChange}
              placeholder='Введите желаемую зарплату'
            />
          </div>

          <div className="form-group">
            <label>Время работы (через запятую)</label>
            <input
              type="text"
              name="work_time"
              value={typeof formData.work_time === 'string' ? formData.work_time : formData.work_time.join(', ')}
              onChange={handleChange}
              placeholder="Например: полный день, удалёнка"
            />
          </div>

          <div className="form-group">
            <label>Место работы (через запятую)</label>
            <input
              type="text"
              name="work_place"
              value={typeof formData.work_place === 'string' ? formData.work_place : formData.work_place.join(', ')}
              onChange={handleChange}
              placeholder="Например: офис, удалёнка"
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
              placeholder='Введите название города в котором планируете работать'
            />
          </div>

          <div className="form-group">
            <label>Биография</label>
            <textarea
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              placeholder='Изложите свою биографию'
            />
          </div>

          <div className="form-group">
            <label>Карьера</label>
            <textarea
              name="career"
              value={formData.career}
              onChange={handleChange}
              placeholder='Изложите где вы раньше работали и какие должности занимали'
            />
          </div>

          <div className="form-group">
            <label>Навыки (через запятую)</label>
            <input
              type="text"
              name="skills"
              value={typeof formData.skills === 'string' ? formData.skills : formData.skills.join(', ')}
              onChange={handleChange}
              placeholder="Например: JavaScript, React, Node.js"
            />
          </div>

          <div className="form-group">
            <label>Опыт работы (через запятую)</label>
            <input
              type="text"
              name="work_experience"
              value={typeof formData.work_experience === 'string' ? formData.work_experience : formData.work_experience.join(', ')}
              onChange={handleChange}
              placeholder='Введите первым значением опыт вашей работы к примеру (3 года) а дальше перечисляйте места работы.'
            />
          </div>

          <div className="form-group">
            <label>Области деятельности (черед запятую)</label>
            <input
              type="text"
              name="activity_fields"
              value={typeof formData.activity_fields === 'string' ? formData.activity_fields : formData.activity_fields.join(', ')}
              onChange={handleChange}
              placeholder='Перечислите чем вы занимались на прошлых работах'
            />
          </div>

          <div className="form-group">
            <label>Качества (через запятую)</label>
            <input
              type="text"
              name="qualities"
              value={typeof formData.qualities === 'string' ? formData.qualities : formData.qualities.join(', ')}
              onChange={handleChange}
              placeholder='Перечислите ваши достойные качества по вашему мнению'
            />
          </div>

          <div className="form-group">
            <label>Образование (через запятую)</label>
            <input
              type="text"
              name="educations"
              value={typeof formData.educations === 'string' ? formData.educations : formData.educations.join(', ')}
              onChange={handleChange}
              placeholder='Введите первым значением свою образовательную ступень например: (Высшее образование) а затем перечисляйте образовательные учреждения'
            />
          </div>

          <div className="form-group">
            <label>Знание языков (через запятую)</label>
            <input
              type="text"
              name="languages_knowledge"
              value={typeof formData.languages_knowledge === 'string' ? formData.languages_knowledge : formData.languages_knowledge.join(', ')}
              onChange={handleChange}
              placeholder='Перечислите языки которые вы знаете и уровни владения'
            />
          </div>

          <div className="form-group">
            <label>Дополнительная информация</label>
            <textarea
              name="additionally"
              value={formData.additionally}
              onChange={handleChange}
              placeholder='Добавьте любую дополнительную информацию'
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
                    <p className="file-requirements">PNG, JPG до 5MB</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Загрузить резюме (.docx)</h3>
            <div
              className={`doc-upload ${isDraggingDoc ? 'dragging' : ''}`}
              onDragOver={handleDragOverDoc}
              onDragLeave={handleDragLeaveDoc}
              onDrop={handleDropDoc}
              style={{
                border: '2px dashed #999',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '8px',
                marginBottom: '15px'
              }}
            >
              {docName ? (
                <>
                  <p>Выбран файл: <strong>{docName}</strong></p>
                  <button
                    type="button"
                    onClick={() => {
                      setDocName('');
                      setFormData(prev => ({ ...prev, user_resume: '' }));
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
                  <p style={{ fontSize: '12px', color: '#666' }}>Максимальный размер файла: 10MB</p>
                </>
              )}
            </div>
          </div>

          <div className="form-actions">
            {error && <div className="error-message" style={{ whiteSpace: 'pre-wrap' }}>{error}</div>}
            <button type="button" className="glowing-button" onClick={handleExtractAndFill} title='ИИ подставит данные автоматически при загруженном docx файле'>
              Подгрузить данные c AI
            </button>
            <button type="submit" className="submit-btn">Сохранить изменения</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  );
}