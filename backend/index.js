require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require('./config/db');
const axios = require('axios');
const User = require('./models/User.model');
const Vacation = require('./models/Vacation.model');
const Favourite = require('./models/Favourite.model');
const Profile = require('./models/Profile.model');
const Profiles_response = require('./models/Profile_response.model');
const Vacations_response = require('./models/Vacation_response.model');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;

const API_KEY = 'sk-0ssmtJ9iOuZESsp8WcWdrmJFHStvpQyeO6C3SWgdh5sWMm6s9KNlmydF9GbN';
const API_URL = 'https://api.gen-api.ru/api/v1/networks/chat-gpt-3';
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Проверка подключения к БД
sequelize.authenticate()
  .then(() => console.log('PostgreSQL подключен успешно'))
  .catch(err => console.error('Ошибка подключения к PostgreSQL:', err));

// Синхронизация моделей
sequelize.sync({ alter: true })
  .then(() => console.log('Модели синхронизированы'))
  .catch(err => console.error('Ошибка синхронизации:', err));


async function sendMailRuEmail({from, to, subject, text, attachments }) {
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true, 
    auth: {
      user: 'new-head-hunt-responser@mail.ru', 
      pass: 'Wsdw0ABpw6min7g0vbWr' 
    }
  });

  const mailOptions = {
    from, 
    to,
    subject,
    text,
    attachments
  };

  await transporter.sendMail(mailOptions);
}

// Роут для регистрации (совпадает с фронтендом)
app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, password_hash } = req.body;

    // Валидация
    if (!name || !email || !phone || !password_hash) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Создание пользователя (пароль хешируется автоматически в модели)
    const newUser = await User.create({
      name,
      email,
      phone: phone.replace(/\D/g, ''), // Очищаем номер
      password_hash
    });

    // Формируем ответ без пароля
    const userResponse = {
      user_id: newUser.user_id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    };

    res.status(201).json({
      message: 'Регистрация успешна',
      user: userResponse
    });

  } catch (error) {
    console.error('Ошибка регистрации:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email уже используется' });
    }
    
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Валидация
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email и пароль обязательны' 
            });
        }

        // Поиск пользователя
        const user = await User.findOne({ 
            where: { email },
            attributes: ['user_id', 'name', 'email', 'password_hash']
        });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Неверные учетные данные' 
            });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Неверные учетные данные' 
            });
        }

        // Генерация токена
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET || '09u85yhtg9wio5',
            { expiresIn: '1h' }
        );

        // Ответ
        res.json({
            success: true,
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ 
            success: false,
            message: 'Внутренняя ошибка сервера' 
        });
    }
});

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Добавляем данные пользователя в запрос
    next();
  } catch (err) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

app.get('/api/user', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['user_id', 'name', 'email'] // Не возвращаем пароль
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

app.post('/api/vacations', authenticateUser, async (req, res) => {
  try {
    const {
      vacation_name,
      salary_from,
      salary_to,
      work_type,
      work_place,
      about_work_type,
      work_region,
      work_city,
      work_adress,
      zip_code,
      company_email,
      company_phone,
      company_site,
      work_description,
      required_skills,
      advantages_describe,
      work_advantages,
      additionally,
      company_image,
      active
    } = req.body;

    // Валидация обязательных полей
    if (!vacation_name || !salary_from || !salary_to || !work_type || !work_place ||
        !work_region || !work_city || !company_email || !company_phone || 
        !work_description || !required_skills) {
      return res.status(400).json({ 
        success: false,
        message: 'Заполните все обязательные поля'
      });
    }

    // Преобразование и значения по умолчанию
    const parsedSalaryFrom = parseInt(salary_from) || 0;
    const parsedSalaryTo = parseInt(salary_to) || 0;
    const parsedZipCode = zip_code ? parseInt(zip_code) : 0;

    const normalizedWorkType = Array.isArray(work_type) 
      ? work_type 
      : (work_type ? work_type.split(',').map(item => item.trim()) : []);
    
    const normalizedWorkPlace = Array.isArray(work_type) 
      ? work_place 
      : (work_place ? work_place.split(',').map(item => item.trim()) : []);

    const normalizedRequiredSkills = Array.isArray(required_skills) 
      ? required_skills 
      : (required_skills ? required_skills.split(',').map(item => item.trim()) : []);
      
    const normalizedWorkAdvantages = work_advantages 
      ? (Array.isArray(work_advantages) ? work_advantages : work_advantages.split(',').map(item => item.trim()))
      : [];

    console.log('req.body:', req.body);  
    // Создание вакансии с дефолтными значениями вместо null
    const newVacation = await Vacation.create({
      user_id: req.user.userId,
      vacation_name: vacation_name || ' ',
      salary_from: parsedSalaryFrom,
      salary_to: parsedSalaryTo,
      work_type: normalizedWorkType,
      work_place: normalizedWorkPlace,
      about_work_type: about_work_type || ' ',
      work_region: work_region || ' ',
      work_city: work_city || ' ',
      work_adress: work_adress || ' ',
      zip_code: parsedZipCode,
      company_email: company_email || ' ',
      company_phone: company_phone || ' ',
      company_site: company_site || ' ',
      work_description: work_description || ' ',
      required_skills: normalizedRequiredSkills,
      work_advantages: normalizedWorkAdvantages,
      additionally: additionally || ' ',
      company_image: company_image || ' ',
      advantages_describe: advantages_describe || ' ',
      active: active || false,
      posted: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Вакансия успешно создана',
      vacation: {
        vacation_id: newVacation.vacation_id,
        vacation_name: newVacation.vacation_name
      }
    });

  } catch (error) {
    console.error('Ошибка создания вакансии:', error);
    
    let errorMessage = 'Ошибка при создании вакансии';
    if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors.map(err => err.message).join(', ');
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage,
      details: error.stack
      // details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// Роут для получения вакансий пользователя
app.get('/api/vacations-extract', authenticateUser, async (req, res) => {
  try {
    const { archived } = req.query; // получаем параметр из query string
    const isArchived = archived === 'true'; // преобразуем в boolean

    const vacations = await Vacation.findAll({
      where: { 
        user_id: req.user.userId,
        active: !isArchived 
      },
      attributes: { exclude: ['user_id'] },
      order: [['posted', 'DESC']]
    });
    const user = await User.findByPk(req.user.userId, {
      attributes: ['user_id', 'name'] // Не возвращаем пароль
    });
    res.json({
      success: true,
      count: vacations.length,
      user,
      vacations
    });
  } catch (error) {
    console.error('Ошибка получения вакансий:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении вакансий' 
    });
  }
});

app.get('/api/vacations-extract-all', async (req, res) => {
  try {
    // 1. Получаем все вакансии
    const vacations = await Vacation.findAll({
      order: [['posted', 'DESC']]
    });

    // 2. Собираем все user_id из вакансий
    const userIds = vacations.map(vacation => vacation.user_id).filter(Boolean);

    // 3. Получаем пользователей по этим ID
    const users = await User.findAll({
      where: { user_id: userIds },
      attributes: ['user_id', 'name', 'email', 'phone'] // Выбираем нужные поля
    });

    // 4. Создаем хеш-таблицу для быстрого доступа { user_id → user_data }
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.user_id] = user;
    });

    // 5. Объединяем вакансии с данными пользователей
    const vacationsWithUsers = vacations.map(vacation => {
      return {
        ...vacation.get({ plain: true }), // Преобразуем в обычный объект
        user: usersMap[vacation.user_id] || null // Добавляем данные пользователя
      };
    });

    res.json({
      success: true,
      count: vacationsWithUsers.length,
      vacations: vacationsWithUsers
    });
  } catch (error) {
    console.error('Ошибка получения всех вакансий:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении вакансий' 
    });
  }
});

app.get('/api/vacation/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const vacation = await Vacation.findByPk(id); // или другой метод поиска
    if (!vacation) {
      return res.status(404).json({ success: false, message: 'Вакансия не найдена' });
    }
    res.json({ success: true, vacation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

app.put('/api/vacation-edit/:id', async (req, res) => {
  const id = req.params.id;
  const {
    vacation_name,
    salary_from,
    salary_to,
    work_type,
    work_place,
    about_work_type,
    work_region,
    work_city,
    work_adress,
    zip_code,
    company_email,
    company_phone,
    company_site,
    work_description,
    required_skills,
    advantages_describe,
    work_advantages,
    additionally,
    company_image,
    active
  } = req.body;

  try {
    const vacation = await Vacation.findByPk(id);
    if (!vacation) {
      return res.status(404).json({ success: false, message: 'Вакансия не найдена' });
    }

    // Обновляем поля вакансии
    await vacation.update({
      vacation_name,
      salary_from,
      salary_to,
      work_type,
      work_place,        
      about_work_type,
      work_region,
      work_city,
      work_adress,
      zip_code,
      company_email,
      company_phone,
      company_site,
      work_description,
      required_skills,    
      advantages_describe,
      work_advantages,    
      additionally,
      company_image,
      active,
      posted: new Date() 
    });

    res.json({ success: true, message: 'Вакансия обновлена' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Ошибка сервера при обновлении вакансии' });
  }
});

app.delete('/api/vacation-delete/:id', authenticateUser, async (req, res) => {
  const vacationId = req.params.id;

  try {
    // Находим вакансию
    const vacation = await Vacation.findByPk(vacationId);

    if (!vacation) {
      return res.status(404).json({ success: false, message: 'Вакансия не найдена' });
    }

    // Проверяем, принадлежит ли вакансия текущему пользователю
    if (vacation.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Нет доступа к удалению этой вакансии' });
    }

    // Удаляем вакансию (или можно сделать vacation.active = false и сохранить)
    await vacation.destroy();

    res.json({ success: true, message: 'Вакансия успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении вакансии:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении вакансии' });
  }
});

app.post('/api/favourites', authenticateUser, async (req, res) => {
  try {
    const { vacation_id } = req.body;

    if (!vacation_id) {
      return res.status(400).json({ 
        success: false,
        message: 'vacation_id обязателен' 
      });
    }

    // Проверяем, есть ли уже такая запись
    const existingFavourite = await Favourite.findOne({
      where: {
        user_id: req.user.userId,
        vacation_id
      }
    });

    if (existingFavourite) {
      return res.status(400).json({
        success: false,
        message: 'Вакансия уже в избранном'
      });
    }

    // Создаем новую запись
    const newFavourite = await Favourite.create({
      user_id: req.user.userId,
      vacation_id
    });

    res.status(201).json({
      success: true,
      message: 'Вакансия добавлена в избранное',
      favourite: newFavourite
    });

  } catch (error) {
    console.error('Ошибка добавления в избранное:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при добавлении в избранное' 
    });
  }
});

app.get('/api/favourites/vacations', authenticateUser, async (req, res) => {
  try {
    // Находим все избранные вакансии пользователя
    const favourites = await Favourite.findAll({
      where: { 
        user_id: req.user.userId,
        vacation_id: { [Sequelize.Op.not]: null }
      },
      include: [{
        model: Vacation,
        as: 'vacation',
        include: [{
          model: User,
          as: 'user',
          attributes: ['name']
        }]
      }]
    });

    if (!favourites.length) {
      return res.json({
        success: true,
        count: 0,
        vacations: []
      });
    }

    // Форматируем данные для ответа
    const formattedVacations = favourites.map(fav => ({
      ...fav.vacation.get({ plain: true }),
      user_name: fav.vacation.user?.name || 'Неизвестный пользователь'
    }));

    res.json({
      success: true,
      count: formattedVacations.length,
      vacations: formattedVacations
    });

  } catch (error) {
    console.error('Ошибка получения избранных вакансий:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении избранных вакансий'
    });
  }
});

app.delete('/api/favourites/:vacationId', authenticateUser, async (req, res) => {
  const { vacationId } = req.params;

  try {
    const deleted = await Favourite.destroy({
      where: {
        user_id: req.user.userId,
        vacation_id: vacationId
      }
    });

    if (deleted) {
      res.json({ success: true, message: 'Вакансия удалена из избранного' });
    } else {
      res.status(404).json({ success: false, message: 'Вакансия не найдена в избранном' });
    }
  } catch (error) {
    console.error('Ошибка удаления из избранного:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при удалении из избранного' 
    });
  }
});

app.post('/api/profiles', authenticateUser, async (req, res) => {
  try {
    const {
      profile_name,
      salary_from,
      salary_to,
      work_time,
      work_place,
      work_city,
      biography,
      career,
      skills,
      work_experience,
      activity_fields,
      qualities,
      educations,
      languages_knowledge,
      additionally,
      profile_image,
      user_resume
    } = req.body;

    // Валидация (пример, можно расширить)
    if (!profile_name || !work_city) {
      return res.status(400).json({ 
        success: false,
        message: 'Обязательные поля: profile_name, work_city'
      });
    }

    // Преобразуем некоторые поля в массивы, если они пришли строками
    const normalizeArrayField = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        return field.split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    };

    const newProfile = await Profile.create({
      user_id: req.user.userId,
      profile_name: profile_name || ' ',
      salary_from: salary_from ? parseInt(salary_from) : 0,
      salary_to: salary_to ? parseInt(salary_to) : 0,
      work_time: normalizeArrayField(work_time),
      work_place: normalizeArrayField(work_place),
      work_city: work_city || ' ',
      biography: biography || ' ',
      career: career || ' ',
      skills: normalizeArrayField(skills),
      work_experience: normalizeArrayField(work_experience),
      activity_fields: normalizeArrayField(activity_fields),
      qualities: normalizeArrayField(qualities),
      educations: normalizeArrayField(educations),
      languages_knowledge: normalizeArrayField(languages_knowledge),
      additionally: additionally || ' ',
      profile_image: profile_image || ' ',
      user_resume: user_resume || ' ',
      posted: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Профиль успешно создан',
      profile: {
        profile_id: newProfile.profile_id,
        profile_name: newProfile.profile_name
      }
    });

  } catch (error) {
    console.error('Ошибка создания профиля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании профиля',
      details: error.message
    });
  }
});

app.get('/api/profiles-extract', authenticateUser, async (req, res) => {
  try {
    const { archived } = req.query; // получаем параметр из query string // преобразуем в boolean

    const profiles = await Profile.findAll({
      where: { 
        user_id: req.user.userId 
      },
      attributes: { exclude: ['user_id'] },
      order: [['posted', 'DESC']]
    });
    const user = await User.findByPk(req.user.userId, {
      attributes: ['user_id', 'name'] // Не возвращаем пароль
    });
    res.json({
      success: true,
      count: profiles.length,
      user,
      profiles
    });
  } catch (error) {
    console.error('Ошибка получения вакансий:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении вакансий' 
    });
  }
});

app.delete('/api/profile-delete/:id', authenticateUser, async (req, res) => {
  const profileId = req.params.id;

  try {
    const profile = await Profile.findByPk(profileId);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Анкета не найдена' });
    }

    if (profile.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Нет доступа к удалению этой анкеты' });
    }

    await profile.destroy();

    res.json({ success: true, message: 'Анкета успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении анкеты:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении анкеты' });
  }
});

app.post('/api/extract-and-fill', async (req, res) => {
  const { user_resume } = req.body;

  if (!user_resume) {
    return res.status(400).json({ message: 'Резюме не получено' });
  }

  try {
    const payload = {
      messages: [
        {
          role: 'user',
          content: `Проанализируй это резюме и верни данные в формате JSON со следующими полями: profile_name, salary_from, salary_to, work_time, work_place, work_city, biography, career, skills, work_experience, activity_fields, qualities, educations, languages_knowledge, additionally. Резюме: ${user_resume}`
        }
      ],
      callback_url: null
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };

    const response = await axios.post(API_URL, payload, { headers });

    const result = response.data?.response?.message?.content;

    // Парсим ответ нейросети как JSON
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (e) {
      return res.status(500).json({ message: 'Ответ не в формате JSON', raw: result });
    }

    res.json(parsed);
    console.log(res.json(parsed));
  } catch (error) {
    console.error('Ошибка запроса к нейросети:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Ошибка при обращении к нейросети' });
  }
});

app.get('/api/profile/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const profile = await Profile.findByPk(id); // или другой метод поиска
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Анкета не найдена' });
    }
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});


app.get('/api/profiles-extract-all', async (req, res) => {
  try {
    // 1. Получаем все профили
    const profiles = await Profile.findAll({
      order: [['posted', 'DESC']]
    });

    // 2. Собираем все user_id из профилей
    const userIds = profiles.map(profile => profile.user_id).filter(Boolean);

    // 3. Получаем пользователей по этим ID
    const users = await User.findAll({
      where: { user_id: userIds },
      attributes: ['user_id', 'name', 'email', 'phone'] // Выбираем нужные поля
    });

    // 4. Создаем объект для быстрого доступа { user_id → user_data }
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.user_id] = user;
    });

    // 5. Объединяем профили с данными пользователей
    const profilesWithUsers = profiles.map(profile => {
      return {
        ...profile.get({ plain: true }), // Преобразуем в обычный объект
        user: usersMap[profile.user_id] || null // Добавляем данные пользователя
      };
    });

    res.json({
      success: true,
      count: profilesWithUsers.length,
      profiles: profilesWithUsers
    });
  } catch (error) {
    console.error('Ошибка получения всех анкет:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении анкет' 
    });
  }
});

app.put('/api/profile-edit/:id', async (req, res) => {
  const id = req.params.id;
  const {
    profile_name,
    salary_from,
    salary_to,
    work_time,
    work_place,
    work_city,
    biography,
    career,
    skills,
    work_experience,
    activity_fields,
    qualities,
    educations,
    languages_knowledge,
    additionally,
    profile_image,
    user_resume
  } = req.body;

  try {
    const profile = await Profile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Профиль не найден' });
    }

    // Обновляем поля профиля
    await profile.update({
      profile_name,
      salary_from,
      salary_to,
      work_time,
      work_place,
      work_city,
      biography,
      career,
      skills,
      work_experience,
      activity_fields,
      qualities,
      educations,
      languages_knowledge,
      additionally,
      profile_image,
      user_resume,
      posted: new Date() // Добавляем или обновляем дату изменения
    });

    res.json({ success: true, message: 'Профиль обновлен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Ошибка сервера при обновлении профиля' });
  }
});


app.post('/api/profiles-response', async (req, res) => {
  try {
    const { 
      title_message, 
      name_company, 
      salary_range, 
      message_response, 
      email,
      defaultMessage, 
      profile_id, 
      user_id 
    } = req.body;

    // Валидация обязательных полей
    if (!title_message || !name_company || !message_response || !email || !profile_id || !user_id) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    // Проверка валидности email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Укажите корректный email адрес' });
    }

    let EmailTo;
    let NameProfile;
    
    try {
      const user = await User.findByPk(user_id);
      if (!user || !user.email) {
        console.log("Работодатель не найден или email отсутствует");
        return res.status(404).json({ error: 'Не удалось получить данные работодателя' });
      }
      EmailTo = user.email;
      console.log("Email работодателя:", EmailTo);
    } catch(userError) {
      console.log("Ошибка при получении данных пользователя:", userError);
      return res.status(404).json({ error: 'Не удалось получить данные работодателя' });
    }
    
    try {
      const profile = await Profile.findByPk(profile_id);
      if (!profile || !profile.profile_name) {
        console.log("Профиль не найден или название отсутствует");
        return res.status(404).json({ error: 'Не удалось получить данные о профиле' });
      }
      NameProfile = profile.profile_name;
      console.log("Название вакансии:", NameProfile);
    } catch(profileError) {
      console.log("Ошибка при получении данных о вакансии:", profileError);
      return res.status(404).json({ error: 'Не удалось получить данные о вакансии' });
    }

    // Создание отклика
    const newResponse = await Profiles_response.create({
      title_message,
      name_company,
      salary_range: salary_range || null, // если не указано, будет null
      message_response: message_response || defaultMessage,
      email,
      profile_id,
      user_id
    });

    try {
      await sendMailRuEmail({
        from: '"Head / Hunt" <new-head-hunt-responser@mail.ru>',
        to: EmailTo,
        subject: `На вашу анкету "${NameProfile}" откликнулась компания "${name_company}"!`,
        text: `
Отправитель: Head / Hunt

Сообщение от компании:
${message_response || defaultMessage}

Предложение о зарплате:
${salary_range || "Не указано"}

Контактные данные компании:
Email: ${email}
`
      });
    } catch (emailError) {
      console.error('Ошибка при отправке email:', emailError);
    }

    // Формируем ответ с основными данными
    const responseData = {
      response_id: newResponse.response_id,
      profile_id: newResponse.profile_id,
      user_id: newResponse.user_id,
      name_company: newResponse.name_company,
      title_message: newResponse.title_message
    };

    res.status(201).json({
      message: 'Приглашение успешно отправлено',
      response: responseData
    });

  } catch (error) {
    console.error('Ошибка при создании отклика:', error);
    
    // Обработка ошибок Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Ошибка валидации', details: errors });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        error: 'Ошибка связи', 
        details: 'Указанный профиль или пользователь не существует' 
      });
    }

    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


app.post('/api/vacations-response', async (req, res) => {
  try {
    const { 
      title_message,  
      message_response, 
      email,
      resume_file,
      defaultMessage, 
      vacation_id, 
      user_id 
    } = req.body;

    // Валидация обязательных полей
    if (!title_message?.trim() || !email?.trim() || !resume_file || !vacation_id || !user_id) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

    // Проверка валидности email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Укажите корректный email адрес' });
    }
    const finalMessage = message_response?.trim() ? message_response : defaultMessage;

    if (!finalMessage) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }
    let EmailTo;
    let NameVacation;
    
    try {
      // Получаем email работодателя напрямую из БД
      const user = await User.findByPk(user_id);
      if (!user || !user.email) {
        console.log("Работодатель не найден или email отсутствует");
        return res.status(404).json({ error: 'Не удалось получить данные работодателя' });
      }
      EmailTo = user.email;
      console.log("Email работодателя:", EmailTo);
    } catch(userError) {
      console.log("Ошибка при получении данных пользователя:", userError);
      return res.status(404).json({ error: 'Не удалось получить данные работодателя' });
    }
    
    try {
      // Получаем название вакансии напрямую из БД
      const vacation = await Vacation.findByPk(vacation_id);
      if (!vacation || !vacation.vacation_name) {
        console.log("Вакансия не найдена или название отсутствует");
        return res.status(404).json({ error: 'Не удалось получить данные о вакансии' });
      }
      NameVacation = vacation.vacation_name;
      console.log("Название вакансии:", NameVacation);
    } catch(vacError) {
      console.log("Ошибка при получении данных о вакансии:", vacError);
      return res.status(404).json({ error: 'Не удалось получить данные о вакансии' });
    }

    // Создание отклика
    const newResponse = await Vacations_response.create({
      title_message,
      message_response: finalMessage,
      email,
      resume_file,
      vacation_id,
      user_id
    });



    try {
      await sendMailRuEmail({
        from: '"Head / Hunt" <new-head-hunt-responser@mail.ru>',
        to: EmailTo, // Email пользователя (работодателя)
        subject: `На вашу вакансию "${NameVacation}" откликнулись!`,
        text: `
Отправитель: Head / Hunt

Сообщение от кандидата:
${finalMessage}

Контактные данные кандидата:
Email: ${email}
`,
        attachments: [
          {
            filename: 'Резюме_кандидата.docx',
            content: resume_file.split('base64,')[1] || resume_file,
            encoding: 'base64'
          }
        ]
      });
    } catch (emailError) {
      console.error('Ошибка при отправке email:', emailError);
    }

    // Формируем ответ с основными данными
    const responseData = {
      response_id: newResponse.response_id,
      vacation_id: newResponse.vacation_id,
      user_id: newResponse.user_id,
      title_message: newResponse.title_message,
      message_response: newResponse.message_response,
      email: newResponse.email,
      resume_file: newResponse.resume_file
    };
    //console.log(responseData);
    res.status(201).json({
      message: 'Приглашение успешно отправлено',
      response: responseData
    });

  } catch (error) {
    console.error('Ошибка при создании отклика:', error);
    
    // Обработка ошибок Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({ error: 'Ошибка валидации', details: errors });
    }
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        error: 'Ошибка связи', 
        details: 'Указанный профиль или пользователь не существует' 
      });
    }

    res.status(500).json({ 
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/api/responseVacation-extract', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const responseVacations = await Vacations_response.findAll({
      where: { 
        user_id: userId 
      },
      order: [['response_id', 'DESC']]
    });

    const vacationIds = responseVacations.map(response => response.vacation_id);

    const vacations = await Vacation.findAll({
      where: {
        vacation_id: vacationIds
      },
      attributes: ['vacation_id', 'vacation_name']
    });

    // Соединяем данные откликов с данными вакансий
    const responseWithVacations = responseVacations.map(response => {
      const vacation = vacations.find(v => v.id === response.vacation_id);
      return {
        ...response.get({ plain: true }),
        vacation: vacation ? vacation.get({ plain: true }) : null
      };
    });

    res.json({
      success: true,
      responseVacations: responseWithVacations
    });
  } catch (error) {
    console.error('Ошибка получения откликов на вакансии:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении откликов на вакансии' 
    });
  }
});

app.get('/api/responseProfile-extract', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId; 
    const responseProfiles = await Profiles_response.findAll({
      where: { 
        user_id: userId 
      },
      order: [['response_id', 'DESC']]
    });

    const profileIds = responseProfiles.map(responseProfiles => responseProfiles.profile_id);

    const profiles = await Profile.findAll({
      where: {
        profile_id: profileIds
      },
      attributes: ['profile_id', 'profile_name']
    });

    // Соединяем данные откликов с данными вакансий
    const responseWithProfiles = responseProfiles.map(response => {
      const profile = profiles.find(v => v.id === responseProfiles.profile_id);
      return {
        ...response.get({ plain: true }),
        profile: profile ? profile.get({ plain: true }) : null
      };
    });

    res.json({
      success: true,
      responseProfiles: responseWithProfiles
    });
  } catch (error) {
    console.error('Ошибка получения откликов на анкеты:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении откликов на анкеты' 
    });
  }
});

app.delete('/api/vacationResponse-delete/:id', authenticateUser, async (req, res) => {
  const responseId = req.params.id;

  try {
    const response = await Vacations_response.findByPk(responseId);

    if (!response) {
      return res.status(404).json({ success: false, message: 'Отклик не найден' });
    }

    if (response.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Нет доступа к удалению этого отклика' });
    }

    await response.destroy();

    res.json({ success: true, message: 'Отклик успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении отклика:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении отклика' });
  }
});

app.delete('/api/profileResponse-delete/:id', authenticateUser, async (req, res) => {
  const responseId = req.params.id;

  try {
    const response = await Profiles_response.findByPk(responseId);

    if (!response) {
      return res.status(404).json({ success: false, message: 'Отклик не найден' });
    }

    if (response.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Нет доступа к удалению этого отклика' });
    }

    await response.destroy();

    res.json({ success: true, message: 'Отклик успешно удален' });
  } catch (error) {
    console.error('Ошибка при удалении отклика:', error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении отклика' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});