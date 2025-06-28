import './suggest.css'
import { useNavigate } from 'react-router-dom'

export function Suggest(){
    const navigate = useNavigate();

    const handleSuggestionClick = (profession) => {
        navigate('/vacancy_list', { 
            state: { 
                profession: profession,
                location: ''
            } 
        });
    };

    return(
        <div className="suggest-container">
            <h1>Популярные вакансии</h1>
            <div className="suggestions">
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Сварщик'); }}>Сварщик</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Менеджер'); }}>Менеджер</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Финансовый директор'); }}>Финансовый директор</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Заведующий складом'); }}>Заведующий складом</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Бухгалтер'); }}>Бухгалтер</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Администратор'); }}>Администратор</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Водитель'); }}>Водитель</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Инженер программист'); }}>Инженер программист</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Терапевт'); }}>Терапевт</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Официант'); }}>Официант</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Преподаватель'); }}>Преподаватель</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Инженер'); }}>Инженер</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Системный администратор'); }}>Системный администратор</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Разнорабочий'); }}>Разнорабочий</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Стоматолог'); }}>Стоматолог</a>
                <a onClick={(e) => { e.preventDefault(); handleSuggestionClick('Грузчик'); }}>Грузчик</a>
            </div>
        </div>
    )
}