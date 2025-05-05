import "../style/style.css";

const Login = () => {
    return ( 
    <div class="auth-container">
        <div class="auth-left">
            <h1>С возвращением!</h1>
            <p>Войдите в свой аккаунт, чтобы продолжить работу над проектами, получить обратную связь от кураторов и развивать свое портфолио.</p>
            <p>Еще не зарегистрированы? <a href="/registration">Создайте аккаунт</a></p>
        </div>
        <div class="auth-right">
            <div class="auth-form">
                <h2>Вход</h2>
                <form action="#" method="POST">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" class="form-control" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль</label>
                        <input type="password" id="password" name="password" class="form-control" required />
                        <p class="error-message">Неверный email или пароль</p>
                    </div>
                    <div class="forgot">
                        <div class="forgot-password">
                            <a href="#">Забыли пароль?</a>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn">Войти</button>
                    </div>
                </form>
            </div>
        </div>
    </div> 
    );
}
 
export default Login;