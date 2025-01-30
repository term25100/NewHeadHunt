import './footer.css'

export function Footer(){
    return(
        <div className="footer">
            <a href="#" className="logo-foot">Head <span>Hunt</span></a>
            <div className="column">
                <h2>Вакансии</h2>
                <a href="#">Помощь</a>
                <a href="#">Поиск работы</a>
                <a href="#">Работа из дома</a>
                <a href="#">Популярные вакансии</a>
                <a href="#">Развитие карьеры</a>
            </div>
            <div className="column">
                <h2>Рекрутерам</h2>
                <a href="#">Страница рекрута</a>
                <a href="#">Разместить вакансию</a>
                <a href="#">Просмотр анкет</a>
                <a href="#">Подбор специалистов</a>
                <a href="#">Развитие рекрута</a>
            </div>
            <div className="column">
                <h2>Интересное</h2>
                <a href="#">Как составлять резюме</a>
                <a href="#">Как грамотно себя подать</a>
                <a href="#">Развитие карьеры</a>
                <a href="#">Трудовой кодекс</a>
                <a href="#">Развитие рекрута</a>
            </div>
            <div className="column">
                <h2>Поддержка</h2>
                <a href="head-hunt@gmail.com" type='mail'>Почта: head-hunt@gmail.com</a>
                <a href="#">Как разместить вакансию</a>
                <a href="#">Как заполнить анкету</a>
                <a href="#">Как подгрузить резюме</a>
                <a href="#">Как cвязаться с работодателем</a>
            </div>
        </div>
    )
}