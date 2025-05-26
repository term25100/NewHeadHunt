import './light_header.css'
export function Light_Header({activeTab, onTabChange}){
    const handleClick = (e, tab) => {
        e.preventDefault();
        onTabChange(tab);
    }
    return(
        <div className="header">
            <div className='main-container'>
                <a href="/" className="logo">Head <span>Hunt</span></a>
                <nav className="menu">
                    <a href="" 
                    className={`menu-link-room ${activeTab === "vacancy" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "vacancy")}>Вакансии</a>

                    <a href="" 
                    className={`menu-link-room ${activeTab === "profiles" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "profiles")}>Анкеты</a> 

                    <a href="" 
                    className={`menu-link-room ${activeTab === "responses" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "responses")}>Отклики</a> 

                    <a href="" 
                    className={`menu-link-room ${activeTab === "favorites" ? "active" : ""}`}
                    onClick={(e) => handleClick(e, "favorites")}>Избранное  <span className='img'></span></a>

                    <a href="" className="menu-link-room">Развитие карьеры</a> 
                    <a href="/sign_in" className="menu-link-room">Выход</a>
                </nav>
            </div>
        </div>
    )
}