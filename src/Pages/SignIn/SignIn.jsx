import './SignIn.css';
import { useState } from 'react';
import { ReactComponent as EyeIcon } from './eye-icon.svg';
import { ReactComponent as EyeSlashIcon } from './eye-slash-icon.svg';
import axios from 'axios';  
import { useNavigate } from 'react-router-dom';

export function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                // Сохраняем токен и перенаправляем
                localStorage.setItem('authToken', response.data.token);
                navigate('/user_room');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка авторизации');
        }
    };

    return (
        <div className='background-login'>
            <div className="main_frame">
                <div className="login_frame">
                    <form className='login_wrapper' onSubmit={handleSubmit}>
                        <h1>Авторизация</h1>
                        {error && <div className="error-message">{error}</div>}
                        
                        <label htmlFor="email">EMAIL АДРЕС</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='ВАШ EMAIL АДРЕС'
                            required
                        />
                        
                        <label htmlFor="password">ПАРОЛЬ</label>
                        <div className="password-input-container">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                id='password' 
                                name='password' 
                                value={formData.password}
                                onChange={handleChange}
                                placeholder='ВВЕДИТЕ ВАШ ПАРОЛЬ'
                                required
                            />
                            <button 
                                type="button" 
                                className="toggle_login-password" 
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                            >
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        
                        <a className='remind__pass' href="#">Забыли пароль?</a>
                        <button type="submit" className='login_button'>
                            ВОЙТИ
                        </button>
                    </form>
                    <a className='close' href="/"></a>
                </div>
                
                <div className="prereg_frame">
                    <h1>ВЫ НЕ<br /> УЧАСТНИК?</h1>
                    <p>Если вы станете нашим участником то сможете писать свои отзывы...</p>
                    <a className='prereg_button' href="/sign_up">ЗАРЕГИСТРИРОВАТЬСЯ</a>  
                </div>
            </div>
        </div>
    )
}