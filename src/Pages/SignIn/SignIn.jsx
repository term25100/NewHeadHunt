import './SignIn.css';

export function SignIn(){
    return (
        <div className='background'>
            <div className="main_frame">
                <div className="login_frame">
                    <div className='login_wrapper'>
                        <h1>LOGIN</h1>
                        <label htmlFor="email_adress">EMAIL ADRESS</label>
                        <input type="email" id="email_adress" name="email_adress" placeholder='YOUR EMAIL ADRESS'/>
                        <br />
                        <label htmlFor="password">PASSWORD</label>
                        <input type='password' id='password' name='password' placeholder='ENTER VALID PASSWORD'/>
                        <a className='login_button' href="#">LOGIN</a>
                    </div>
                    <a className='close' href="/"></a>
                </div>
                <div className="prereg_frame">
                    <h1>NOT A<br /> MEMBER?</h1>
                    <p>Если вы станете нашим участником то сможете писать свои отзывы о работе в компаниях а также размещать свои вакансии и резюме! <br /> Также вы сможете сохранять понравившиеся анкеты либо вакансии, зарегистрируйтесь.</p>

                    <a className='prereg_button' href="#">REGISTER NOW</a>  
                </div>
            </div>
        </div>
    )
}