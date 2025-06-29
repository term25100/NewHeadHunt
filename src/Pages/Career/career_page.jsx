import './career_page.css'
export function Career_page(){
    return(
        <div>
            <div class="career-container">
                <div className="career-header">
                  <h1>Развитие карьеры</h1>
                  <p>Полезные советы и ресурсы для профессионального роста</p>
                </div>

                <div className="career-container">
                  
                  <div className="career-article">
                    <div className="article-image">
                      <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                           alt="Карьерный рост" 
                           style={{width: '100%', height: '20vw', objectFit: 'cover'}} />
                    </div>
                    <div className="article-content">
                      <h2>5 шагов для успешного карьерного роста</h2>
                      <p className="article-meta">15 июня 2023 · 20 мин чтения</p>
                      <p>1. Определите свои цели и приоритеты. 2. Развивайте профессиональные навыки. 3. Создайте сильную сеть контактов. 4. Будьте инициативны. 5. Не бойтесь выходить из зоны комфорта.</p>
                      <a href='https://brainapps.ru/blog/2023/10/shagov-k-uspeshnoy-karerea-23252/' className="read-more">Читать далее</a>
                    </div>
                  </div>

                  
                  <div className="career-article reverse">
                    <div className="article-image">
                      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                           alt="Собеседование" 
                           style={{width: '100%', height: '20vw', objectFit: 'cover'}} />
                    </div>
                    <div className="article-content">
                      <h2>Как успешно пройти собеседование</h2>
                      <p className="article-meta">10 июня 2023 · 5 мин чтения</p>
                      <p>Подготовьтесь к распространенным вопросам, исследуйте компанию, продумайте свои ответы по методике STAR, подготовьте вопросы работодателю и не забывайте про язык тела.</p>
                      <a href='https://dzen.ru/a/ZSAJ3B9WHAhPaKiS?utm_source=yandex&utm_medium=cpc&utm_campaign=SEARCH_Feed1&mt_link_id=kikkq1&yprqee=4134143742683119615' className="read-more">Читать далее</a>
                    </div>
                  </div>

                  
                  <div className="career-article">
                    <div className="article-image">
                      <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                           alt="Работа в команде" 
                           style={{width: '100%', height: '20vw', objectFit: 'cover'}} />
                    </div>
                    <div className="article-content">
                      <h2>Навыки будущего: что нужно развивать сейчас</h2>
                      <p className="article-meta">5 июня 2023 · 15 мин чтения</p>
                      <p>Эмоциональный интеллект, критическое мышление, креативность, цифровая грамотность и адаптивность - ключевые навыки для профессионалов в быстро меняющемся мире.</p>
                      <a href='https://trends.rbc.ru/trends/education/5e728cbc9a79476476f6eb4e' className="read-more">Читать далее</a>
                    </div>
                  </div>

                  
                  <div className="career-tips">
                    <h2>Быстрые советы</h2>
                    <div className="tips-grid">
                      <div className="tip-card">
                        <div className="tip-icon">💼</div>
                        <h3>Сеть контактов</h3>
                        <p>Посещайте профессиональные мероприятия и расширяйте сеть контактов.</p>
                      </div>
                      <div className="tip-card">
                        <div className="tip-icon">📚</div>
                        <h3>Непрерывное обучение</h3>
                        <p>Выделяйте время для обучения новым навыкам каждый месяц.</p>
                      </div>
                      <div className="tip-card">
                        <div className="tip-icon">🎯</div>
                        <h3>Четкие цели</h3>
                        <p>Ставьте SMART-цели для своего профессионального развития.</p>
                      </div>
                      <div className="tip-card">
                        <div className="tip-icon">🔄</div>
                        <h3>Обратная связь</h3>
                        <p>Регулярно запрашивайте обратную связь о своей работе.</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div> 
        </div>
    );
}