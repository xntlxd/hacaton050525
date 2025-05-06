import "../style/style.css";

const Registration = () => {
    return ( 
    <div className="auth-container">
        <div className="auth-left">
            <h1>Присоединяйтесь к Nonefolio</h1>
            <p>Создавайте проекты, оформляйте портфолио и получайте обратную связь в удобном цифровом пространстве.</p>
            <p>Уже зарегистрированы? <a href="/login">Войдите в аккаунт</a></p>
        </div>
        <div className="auth-right">
            <div className="auth-form">
                <h2>Регистрация</h2>
                <form action="#" method="POST">
                    <div className="form-group">
                        <label htmlFor="name">Имя и Фамилия</label>
                        <input type="text" id="name" name="name" className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" id="password" name="password" className="form-control" required />
                    </div>
                    <div className="form-group">
                        <center><button type="submit" className="btn">Зарегистрироваться</button></center>
                    </div>
                </form>
            </div>
        </div>
    </div> 
    );
}
 
export default Registration;