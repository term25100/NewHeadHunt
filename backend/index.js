require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize } = require('./config/db');
const { Op } = require('sequelize');
const User = require('./models/User.model');
const Vacation = require('./models/Vacation.model');
const Favourite = require('./models/Favourite.model');
const Profile = require('./models/Profile.model');
const Profiles_response = require('./models/Profile_response.model');
const Vacations_response = require('./models/Vacation_response.model');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

sequelize.authenticate()
  .then(() => console.log('PostgreSQL подключен успешно'))
  .catch(err => console.error('Ошибка подключения к PostgreSQL:', err));


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


app.post('/api/users', async (req, res) => {
  try {
    const { name, email, phone, password_hash } = req.body;


    if (!name || !email || !phone || !password_hash) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }


    const newUser = await User.create({
      name,
      email,
      phone: phone.replace(/\D/g, ''), 
      password_hash
    });


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


        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email и пароль обязательны' 
            });
        }


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


        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Неверные учетные данные' 
            });
        }


        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
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
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

app.get('/api/user', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['user_id', 'name', 'email'] 
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

app.get('/api/userData', authenticateUser, async (req, res) => {
  try {
    
    const user = await User.findByPk(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    // Возвращаем данные пользователя (без пароля)
    const userResponse = {
      user_id: user.user_id,
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      user_image: user.user_image
    };

    res.json({ success: true, userResponse });
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
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

app.put('/api/user-edit/:userId', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, phone, password, profile_image } = req.body;

    // Проверяем, что userId из URL совпадает с userId из токена
    if (parseInt(userId) !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Вы можете редактировать только свой профиль'
      });
    }

    // Находим пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }

    // Проверяем уникальность email, если он изменен
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Этот email уже используется другим пользователем'
        });
      }
    }

    // Подготавливаем обновления
    const updateData = {
      name: username || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      user_image: profile_image || user.user_image
    };

    // Обновляем пароль, если он предоставлен
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    // Выполняем обновление
    await User.update(updateData, {
      where: { user_id: userId }
    });

    // Получаем обновленные данные пользователя (без пароля)
    const updatedUser = await User.findByPk(userId, {
      attributes: ['user_id', 'name', 'email', 'phone', 'user_image']
    });

    res.json({
      success: true,
      message: 'Данные пользователя успешно обновлены',
      user: updatedUser
    });

  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Произошла ошибка при обновлении данных'
    });
  }
});

app.post('/api/verify-password', authenticateUser, async (req, res) => {
  try {
    const { password } = req.body; // Получаем пароль из тела запроса
    
    if (!password) {
      return res.status(400).json({ 
        success: false,
        message: 'Пароль не предоставлен' 
      });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Пользователь не найден' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Неверный пароль' 
      });
    }

    res.json({ 
      success: true,
      message: 'Пароль верный' 
    });
  } catch (err) {
    console.error('Ошибка при проверке пароля:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Внутренняя ошибка сервера' 
    });
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

    if (!vacation_name || !salary_from || !salary_to || !work_type || !work_place ||
        !work_region || !work_city || !company_email || !company_phone || 
        !work_description || !required_skills) {
      return res.status(400).json({ 
        success: false,
        message: 'Заполните все обязательные поля'
      });
    }

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
    });
  }
});



app.get('/api/vacations-extract', authenticateUser, async (req, res) => {
  try {
    const { archived } = req.query; 
    const isArchived = archived === 'true'; 

    const vacations = await Vacation.findAll({
      where: { 
        user_id: req.user.userId,
        active: !isArchived 
      },
      attributes: { exclude: ['user_id'] },
      order: [['posted', 'DESC']]
    });
    const user = await User.findByPk(req.user.userId, {
      attributes: ['user_id', 'name'] 
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


app.get('/api/vacations-extract-all/auth', authenticateUser, async (req, res) => {
  try {
    // 1. Получаем все вакансии
    const vacations = await Vacation.findAll({
      order: [['posted', 'DESC']]
    });

    // 2. Получаем ID избранных вакансий пользователя
    const favorites = await Favourite.findAll({
      where: { 
        user_id: req.user.userId,
        vacation_id: { [Op.not]: null }
      },
      attributes: ['vacation_id'],
      raw: true
    });
    
    const favoriteVacationIds = favorites.map(fav => fav.vacation_id);

    // 3. Получаем информацию о пользователях, создавших вакансии
    const userIds = [...new Set(vacations.map(v => v.user_id).filter(Boolean))];
    const users = await User.findAll({
      where: { user_id: userIds },
      attributes: ['user_id', 'name', 'email', 'phone'],
      raw: true
    });
    
    const usersMap = users.reduce((acc, user) => {
      acc[user.user_id] = user;
      return acc;
    }, {});

    // 4. Формируем окончательный ответ
    const result = vacations.map(vacation => {
      const vacationData = vacation.get({ plain: true });
      return {
        ...vacationData,
        isFavourite: favoriteVacationIds.includes(vacation.vacation_id),
        user: vacation.user_id ? usersMap[vacation.user_id] || null : null
      };
    });

    res.json({
      success: true,
      vacations: result
    });

  } catch (error) {
    console.error('Ошибка получения вакансий:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении вакансий',
      error: error.message
    });
  }
});

app.get('/api/vacations-extract-all', async (req, res) => {
  try {
    
    const vacations = await Vacation.findAll({
      order: [['posted', 'DESC']]
    });

    
    const userIds = vacations.map(vacation => vacation.user_id).filter(Boolean);

    
    const users = await User.findAll({
      where: { user_id: userIds },
      attributes: ['user_id', 'name', 'email', 'phone'] 
    });

    
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.user_id] = user;
    });

    
    const vacationsWithUsers = vacations.map(vacation => {
      return {
        ...vacation.get({ plain: true }), 
        user: usersMap[vacation.user_id] || null 
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
    const vacation = await Vacation.findByPk(id); 
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
    
    const vacation = await Vacation.findByPk(vacationId);

    if (!vacation) {
      return res.status(404).json({ success: false, message: 'Вакансия не найдена' });
    }
    
    if (vacation.user_id !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Нет доступа к удалению этой вакансии' });
    }

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

app.post('/api/favourites-prof', authenticateUser, async (req, res) => {
  try {
    const { profile_id } = req.body;

    if (!profile_id) {
      return res.status(400).json({ 
        success: false,
        message: 'profile_id обязателен' 
      });
    }

    const existingFavourite = await Favourite.findOne({
      where: {
        user_id: req.user.userId,
        profile_id
      }
    });

    if (existingFavourite) {
      return res.status(400).json({
        success: false,
        message: 'Анкета уже в избранном'
      });
    }

    const newFavourite = await Favourite.create({
      user_id: req.user.userId,
      profile_id
    });

    res.status(201).json({
      success: true,
      message: 'Анкета добавлена в избранное',
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

app.get('/api/favourites/vacations-extract', authenticateUser, async(req, res)=>{
  try {
    const userId = req.user.userId; 
    const favorites = await Favourite.findAll({
      where: { 
        user_id: userId,
        vacation_id: { [Op.not]: null }  
      },
      attributes: ['vacation_id'],
      raw: true
    });

    const vacationIds = favorites.map(fav => fav.vacation_id);

    const vacations = await Vacation.findAll({
      where: {
        vacation_id: vacationIds
      }
    });

    res.json({
      success: true,
      favoriteVacations: vacations.map(vac => vac.get({ plain: true }))
    });
  } catch (error) {
    console.error('Ошибка получения избранных вакансий:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении избранных вакансий' 
    });
  }
});

app.get('/api/favourites/profiles-extract', authenticateUser, async(req, res)=>{
  try {
    const userId = req.user.userId; 
    const favorites = await Favourite.findAll({
      where: { 
        user_id: userId,
        profile_id: { [Op.not]: null }  
      },
      attributes: ['profile_id'],
      raw: true
    });

    const profileIds = favorites.map(fav => fav.profile_id);

    const profiles = await Profile.findAll({
      where: {
        profile_id: profileIds
      }
    });

    res.json({
      success: true,
      favoriteProfiles: profiles.map(prof => prof.get({ plain: true }))
    });
  } catch (error) {
    console.error('Ошибка получения избранных вакансий:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении избранных вакансий' 
    });
  }
});

app.delete('/api/favourites-vac/:vacationId', authenticateUser, async (req, res) => {
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

app.delete('/api/favourites-prof/:profileId', authenticateUser, async (req, res) => {
  const { profileId } = req.params;

  try {
    const deleted = await Favourite.destroy({
      where: {
        user_id: req.user.userId,
        profile_id: profileId
      }
    });

    if (deleted) {
      res.json({ success: true, message: 'Анкета удалена из избранного' });
    } else {
      res.status(404).json({ success: false, message: 'Анкета не найдена в избранном' });
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

    
    if (!profile_name || !work_city) {
      return res.status(400).json({ 
        success: false,
        message: 'Обязательные поля: profile_name, work_city'
      });
    }

    
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
    const { archived } = req.query; 

    const profiles = await Profile.findAll({
      where: { 
        user_id: req.user.userId 
      },
      attributes: { exclude: ['user_id'] },
      order: [['posted', 'DESC']]
    });
    const user = await User.findByPk(req.user.userId, {
      attributes: ['user_id', 'name'] 
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



app.get('/api/profile/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const profile = await Profile.findByPk(id); 
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Анкета не найдена' });
    }
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

app.get('/api/profiles-extract-all/auth', authenticateUser, async (req, res) => {
  try {
    // 1. Получаем все анкеты
    const profiles = await Profile.findAll({
      order: [['posted', 'DESC']]
    });

    // 2. Получаем ID избранных анкет пользователя
    const favorites = await Favourite.findAll({
      where: { 
        user_id: req.user.userId,
        profile_id: { [Op.not]: null }
      },
      attributes: ['profile_id'],
      raw: true
    });
    
    const favoriteProfileIds = favorites.map(fav => fav.profile_id);

    // 3. Получаем информацию о пользователях
    const userIds = [...new Set(profiles.map(p => p.user_id).filter(Boolean))];
    const users = await User.findAll({
      where: { user_id: userIds },
      attributes: ['user_id', 'name', 'email', 'phone'],
      raw: true
    });
    
    const usersMap = users.reduce((acc, user) => {
      acc[user.user_id] = user;
      return acc;
    }, {});

    // 4. Формируем окончательный ответ
    const result = profiles.map(profile => {
      const profileData = profile.get({ plain: true });
      return {
        ...profileData,
        isFavourite: favoriteProfileIds.includes(profile.profile_id),
        user: profile.user_id ? usersMap[profile.user_id] || null : null
      };
    });

    res.json({
      success: true,
      profiles: result
    });

  } catch (error) {
    console.error('Ошибка получения анкет:', error);
    res.status(500).json({ 
      success: false,
      message: 'Ошибка при получении анкет',
      error: error.message
    });
  }
});

app.get('/api/profiles-extract-all', async (req, res) => {
  try {
    
    const profiles = await Profile.findAll({
      order: [['posted', 'DESC']]
    });

    
    const userIds = profiles.map(profile => profile.user_id).filter(Boolean);

    
    const users = await User.findAll({
      where: { user_id: userIds },
      attributes: ['user_id', 'name', 'email', 'phone'] 
    });

    
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.user_id] = user;
    });

    
    const profilesWithUsers = profiles.map(profile => {
      return {
        ...profile.get({ plain: true }), 
        user: usersMap[profile.user_id] || null 
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
      posted: new Date() 
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

    if (!title_message || !name_company || !message_response || !email || !profile_id || !user_id) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

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

    const newResponse = await Profiles_response.create({
      title_message,
      name_company,
      salary_range: salary_range || null, 
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

    if (!title_message?.trim() || !email?.trim() || !resume_file || !vacation_id || !user_id) {
      return res.status(400).json({ error: 'Все обязательные поля должны быть заполнены' });
    }

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
        to: EmailTo, 
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


    const responseData = {
      response_id: newResponse.response_id,
      vacation_id: newResponse.vacation_id,
      user_id: newResponse.user_id,
      title_message: newResponse.title_message,
      message_response: newResponse.message_response,
      email: newResponse.email,
      resume_file: newResponse.resume_file
    };

    res.status(201).json({
      message: 'Приглашение успешно отправлено',
      response: responseData
    });

  } catch (error) {
    console.error('Ошибка при создании отклика:', error);
    
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


app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});