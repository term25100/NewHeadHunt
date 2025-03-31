import './header.css'
export function Header(){
    return(
        <div className="header">
            <div className='main-container'>
                <a href="/" className="logo">Head <span>Hunt</span></a>
                <nav className="menu">
                    <a href="/vacancy" className="menu-link">Вакансии</a>
                    <a href="/profiles" className="menu-link">Анкеты</a> 
                    <a href="#" className="menu-link">Развитие карьеры</a>
                    <div className="divide"></div>   
                    <a href="#" className="menu-link">Вы рекрут? <span className='special'>Разместите вакансию</span></a>
                    <a href="#" className="menu-reg">Регистрация</a>
                    <a href="/sign_in" className="menu-link">Вход</a>
                    <a href="#" className="menu-link">Избранное  <span className='img'></span></a>
                </nav>
            </div>
        </div>
    )
}