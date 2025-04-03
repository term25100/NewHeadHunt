import './SignIn.css';

export function SignIn(){
    return (
        <div className='background'>
            <div className="main_frame">
                <div className="login_frame">
                    <div className='login_wrapper'>
                        <h1>Авторизация</h1>
                        <label htmlFor="email_adress">EMAIL АДРЕС</label>
                        <input type="email" id="email_adress" name="email_adress" placeholder='ВАШ EMAIL АДРЕС'/>
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
                        <a className='login_button' href="#">ВОЙТИ</a>
                    </div>
                    <a className='close' href="/"></a>
                </div>
                <div className="prereg_frame">
                    <h1>ВЫ НЕ<br /> УЧАСТНИК?</h1>
                    <p>Если вы станете нашим участником то сможете писать свои отзывы о работе в компаниях а также размещать свои вакансии и резюме! <br /> Также вы сможете сохранять понравившиеся анкеты либо вакансии, зарегистрируйтесь.</p>
                    <a className='prereg_button' href="/sign_up">ЗАРЕГИСТРИРОВАТЬСЯ</a>  
                </div>
            </div>
        </div>
    )
}