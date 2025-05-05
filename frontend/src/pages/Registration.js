import "../style/style.css";

const Registration = () => {
    return ( 
    <div class="auth-container">
        <div class="auth-left">
            <h1>Присоединяйтесь к Nonefolio</h1>
            <p>Создавайте проекты, оформляйте портфолио и получайте обратную связь в удобном цифровом пространстве.</p>
            <p>Уже зарегистрированы? <a href="/login">Войдите в аккаунт</a></p>
        </div>
        <div class="auth-right">
            <div class="auth-form">
                <h2>Регистрация</h2>
                <form action="#" method="POST">
                    <div class="form-group">
                        <label for="name">Имя и Фамилия</label>
                        <input type="text" id="name" name="name" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input type="password" id="password" name="password" class="form-control" required />
                        <p class="error-message">Пароль должен содержать не менее 8 символов</p>
                    </div>
                    <div class="form-group">
                        <center><button type="submit" class="btn">Зарегистрироваться</button></center>
                    </div>
                </form>
                <div class="auth-footer">
                    <p>Нажимая "Зарегистрироваться", вы соглашаетесь с <a href="#">Условиями использования</a> и <a href="#">Политикой конфиденциальности</a>.</p>
                </div>
            </div>
        </div>
    </div> 
    );
}
 
export default Registration;