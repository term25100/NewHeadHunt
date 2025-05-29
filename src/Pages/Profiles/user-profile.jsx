import './user-profile.css';
import myImage from '../Images/Peoples/sergei.webp';
import userFile from '../Images/Icons/alarm.png';
import { useState } from 'react';
import { InvitationPopup } from './invitation';

export function User_Profile(){
    const [showPopup, setShowPopup] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const handleInviteClick = (candidate) => {
        setSelectedCandidate(candidate);
        setShowPopup(true);
    };
    const handleSendInvitation = (invitationData) => {
        console.log('Отправка приглашения:', invitationData);
        // Здесь можно добавить логику отправки на сервер
        setShowPopup(false);
    };
    const candidate = [
        {
          id: 1,
          name: "Аганов Сергей Федорович",
          position: "Фронтенд разработчик"
        }
    ];
    return(
        <div className='UserCard'>
            <h1>Фронтенд разработчик: Аганов Сергей Федорович</h1>
            <div className="flex-work">
                <div>
                    <h2>Рабочие предпочтения:</h2>
                    <ul>
                        <li>Заработная плата: 100000-120000 рублей в месяц</li>
                        <li>Время работы: Полный рабочий день</li>
                        <li>Предпочительное места работы: Офис, работа на дому</li>
                        <li>Город работы: Тула</li>
                    </ul>
                </div>
                <div className="image-place">
                    <img src={myImage} alt="Фото соискателя    " />
                </div>
            </div>
            <h2>Биография</h2>
            <p>Аганов Сергей Федорович родился 15 марта 1985 года в Москве. С детства увлекался техникой и компьютерами, первые шаги в программировании сделал еще в школе на старом Pentium, изучая BASIC и Pascal. В 2002 году поступил в Тульский государственный технический университет им. Н.Э. Баумана на факультет «Информатика и системы управления», где углубленно изучал алгоритмы, веб-технологии и базы данных.</p>
            <h3>Начало карьеры</h3>
            <p>После окончания вуза в 2007  начал карьеру в небольшой веб-студии, где занимался версткой сайтов на HTML/CSS и писал скрипты на JavaScript (jQuery). В этот период работал над проектами для малого бизнеса, что дало понимание полного цикла разработки.</p>
            <h3>Навыки</h3>
            <ul>
                <li>JavaScript (ES6+), TypeScript;</li>
                <li>React.js / Next.js (опыт от 3 лет);</li>
                <li>Vue.js / Angular — базовое владение;</li>
                <li>HTML5, CSS3 (Sass/SCSS, Tailwind CSS).</li>
                <li>Webpack, Vite;</li>
                <li>Git, GitHub/GitLab;</li>
                <li>Figma (адаптивная вёрстка по макетам).</li>
                <li>Знание REST API, GraphQL;</li>
                <li>Базовый бэкенд (Node.js, Express).</li>
            </ul>
            <h3>Опыт работы</h3>
            <ul>
                <li>Frontend-разработчик (3 года) Название компании / Фриланс | 2021 – н.в.</li>
            </ul>
            <h3>Сфера занятий</h3>
            <ul>
                <li>Разработка SPA-приложений на React;</li>
                <li>Оптимизация производительности (Lazy Loading, PWA);</li>
                <li>Взаимодействие с дизайнерами и бэкенд-разработчиками.</li>
            </ul>
            <h3>Образование</h3>
            <ul>
                <li>Тульский государственный университет / IT-специальность (2015–2020).</li>
                <li>Курсы: «React Advanced» от Яндекс.Практикум; «Modern JavaScript» (Udemy).</li>
            </ul>
            <h3>Знание языков</h3>
            <ul>
                <li>Русский язык в совершенстве</li>
                <li>Английский язык уровень B2</li>
            </ul>
            <div className="flex-Profile-buttons">
                <a href="#" onClick={() => handleInviteClick(candidate)}>Пригласить на работу</a>
                <a href={userFile} download={userFile}>Скачать резюме</a>
            </div>

            {showPopup && selectedCandidate && (
                <InvitationPopup
                candidate={selectedCandidate}
                onClose={() => setShowPopup(false)}
                onSend={handleSendInvitation}
                />
            )}
        </div>
    );
}