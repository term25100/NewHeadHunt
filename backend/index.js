require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require('./config/db');
const User = require('./models/User.model');
const Vacation = require('./models/Vacation.model');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
      company_image
    } = req.body;

    // Валидация обязательных полей
    if (!vacation_name || !salary_from || !salary_to || !work_type || 
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
      advantages_describe: advantages_describe || ' '
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
    const vacations = await Vacation.findAll({
      where: { user_id: req.user.userId },
      attributes: { exclude: ['user_id'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: vacations.length,
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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});