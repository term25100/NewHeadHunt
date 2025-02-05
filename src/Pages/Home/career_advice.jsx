import './career_advice.css';

export function Career_Advice(){
    return(
        <div className="advices_container">
            <h1>Поддержка для вас</h1>
            <div className="advices">
                <div className="recruit_advice">
                    <h1>Научись грамотно подбирать персонал</h1>
                    <div className="image_rec">

                    </div>
                    <p>Получи несколько советов чтобы продуктивно искать и нанимать сотрудников.</p>
                    <a href="#">Страница рекрутов</a>
                </div>
                <div className="workers_container">
                    <h1>Развитие вашей карьеры</h1>
                    <div className="workers_advices">
                        <div className="advice">
                            <div className="image_work1">

                            </div>
                            <p>Создай свою первую анкету и найди работу мечты</p>
                            <a className='advice_button' href="#">Создать анкету</a>
                        </div>
                        <div className="advice">
                            <div className="image_work2">
                                
                            </div>
                            <p>Научись работать и получать от этого удовольствие</p>
                            <a className='advice_button' href="#">Развитие карьеры</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}