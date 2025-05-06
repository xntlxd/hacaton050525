import "../style/style.css";

const Login = () => {
    return ( 
    <div className="auth-container">
        <div className="auth-left">
            <h1>С возвращением!</h1>
            <p>Войдите в свой аккаунт, чтобы продолжить работу над проектами и развивать свое портфолио.</p>
            <p>Еще не зарегистрированы? <a href="/registration">Создайте аккаунт</a></p>
        </div>
        <div className="auth-right">
            <div className="auth-form">
                <h2>Вход</h2>
                <form action="#" method="POST">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input type="password" id="password" name="password" className="form-control" required />
                    </div>
                    <div className="forgot">
                        <div className="forgot-password">
                            <a href="#">Забыли пароль?</a>
                        </div>
                    </div>
                    <div className="form-group">
                        <center><button type="submit" className="btn">Войти</button></center>
                    </div>
                </form>
            </div>
        </div>
    </div> 
    );
}
 
export default Login;