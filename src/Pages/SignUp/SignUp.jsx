import './SignUp.css';
import { IMaskInput } from 'react-imask';
import { useState } from 'react';
import { ReactComponent as EyeIcon } from './eye-icon.svg';
import { ReactComponent as EyeSlashIcon } from './eye-slash-icon.svg';

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className='background-reg'>
      <div className="reg_main_frame">
        <div className="reg_frame">
          <div className='reg_wrapper'>
            <h1>Регистрация</h1>
            <label htmlFor="name">ВАШЕ ИМЯ</label>
            <input type="text" id="name" name="name" placeholder="ВВЕДИТЕ ВАШЕ ИМЯ" />
            <label htmlFor="email_adress">EMAIL АДРЕС</label>
            <input type="email" id="email_adress" name="email_adress" placeholder='ВАШ EMAIL АДРЕС'/>
            <label htmlFor='telephone'>ТЕЛЕФОН</label>
            <IMaskInput mask="+7 (000) 000-00-00" definitions={{ '0': /[0-9]/ }} id="telephone" name="telephone" placeholder="+7 (___) ___-__-__" />
            <label htmlFor="password">ПАРОЛЬ</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id='password' 
                name='password' 
                placeholder='ВВЕДИТЕ ВАШ ПАРОЛЬ'
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            
            <label htmlFor="password2">ПОВТОРИТЕ ПАРОЛЬ</label>
            <div className="password-input-container">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} 
                id='password2' 
                name='password2' 
                placeholder='ПОВТОРИТЕ ПАРОЛЬ' 
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            
            <a className='reg_button' href="#">ЗАРЕГИСТРИРОВАТЬСЯ</a>
          </div>
          <a className='reg_close' href="/"></a>
        </div>
        <div className="signIn_frame">
          <h1>УЖЕ<br /> ЗАРЕГИСТРИРОВАНЫ?</h1>
          <p>Если вы уже являетесь пользователем нашего сайта и по какой либо причине не можете войти в свой аккаунт воспользуйтесь ссылками для восстановления доступа предоставленными ниже.</p>
          <a className='remind_pass' href="#">Забыли пароль?</a>
          <a className='remind_login' href="#">Забыли логин?</a>
          <p>Или войдите в аккаунт, если вы уже были зарегистрированы.</p>
          <a className='signIn_button' href="/sign_in">ВОЙТИ</a>  
        </div>
      </div>
    </div>
  );
}