require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require('./config/db');
const User = require('./models/User.model');
const Vacation = require('./models/Vacation.model');
const Favourite = require('./models/Favourite.model');
const Profile = require('./models/Profile.model');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
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
    const vacations = await Vacation.findAll({
      attributes: { exclude: ['user_id'] },
      order: [['posted', 'DESC']]
    });
    res.json({
      success: true,
      count: vacations.length,
      vacations
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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});