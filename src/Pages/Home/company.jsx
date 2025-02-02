import './company.css'

export function Company(){
    return(
        <div className="company-container">
            <div className="flex-container">
                <div className="company">
                    <a className='c1' href="#"></a>
                    <a className='c2' href="#"></a>
                    <a className='c3' href="#"></a>
                    <a className='c4' href="#"></a>
                    <a className='c5' href="#"></a>
                    <a className='c6' href="#"></a>
                </div>
                <div className='company-heading'>
                    <h1>Найдите роботу которая вам понравится на нашем сайте</h1>
                    <p>Ваша карьерная лестница может начаться в одной из компаний лидеров.</p>
                    <div className='comBut'>
                        <a href="#">Все компании</a>
                    </div>
                </div>
            </div>
        </div>
    )
}