import './suggest.css'

export function Suggest(){
    return(
        <div className="suggest-container">
            <h1>Популярные вакансии</h1>
            <div className="suggestions">
                <a href="#">Работа из дома</a>
                <a href="#">Подработка</a>
                <a href="#">Работа менеджера</a>
                <a href="#">Работа с финансами</a>
                <a href="#">Работа на складе</a>
                <a href="#">Работа бухгалтером</a>
                <a href="#">Работа администратором</a>
                <a href="#">Работа водителем</a>
                <a href="#">Работа в IT</a>
                <a href="#">Работа в здравоохранении</a>
                <a href="#">Работа в сфере услуг</a>
                <a href="#">Работа учителем</a>
                <a href="#">Работа в строительстве</a>
            </div>
        </div>
    )
}