import Header_home from "../components/Header_home";
import Footer_home from "../components/Footer_home";
import "../style/style.css";

const Home = () => {
    return ( 
    <>
    <Header_home />
    <main>
        <section className="hero">
            <h1>Создавайте, делитесь, вдохновляйтесь</h1>
            <p>Nonefolio - это платформа для студентов и школьников, где вы можете создавать проекты, оформлять портфолио и получать обратную связь.</p>
            <div className="hero-buttons">
                <a href="/registration" className="btn btn-register">Начать</a>
            </div>
        </section>
        
        <section className="features">
            <div className="section-title">
                <h2>Возможности платформы</h2>
                <p>Все, что нужно для успешной работы над проектами</p>
            </div>
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">📋</div>
                    <h3>Управление проектами</h3>
                    <p>Создавайте проекты с гибкой системой задач и этапов, как в профессиональных инструментах.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">👥</div>
                    <h3>Совместная работа</h3>
                    <p>Приглашайте участников, распределяйте задачи и общайтесь.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎨</div>
                    <h3>Портфолио</h3>
                    <p>Оформляйте результаты работы в красивое портфолио с мультимедийными материалами.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">💬</div>
                    <h3>Обратная связь</h3>
                    <p>Получайте комментарии и советы в вашей области.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>Доступ с любого устройства</h3>
                    <p>Платформа полностью адаптирована для компьютеров, планшетов и смартфонов.</p>
                </div>
            </div>
        </section>
    </main>
    <Footer_home /> 
    </>
    );
}
 
export default Home;