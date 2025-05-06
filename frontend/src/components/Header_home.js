const Header_home = () => {
    return ( 
    <nav className="navbar">
        <a href="/" className="logo">Nonefolio</a>
        <div className="nav-links">
            <a href="#">О нас</a>
        </div>
        <div className="auth-buttons">
            <a href="/login" className="btn btn-login">Войти</a>
            <a href="/registration" className="btn btn-register">Регистрация</a>
        </div>
    </nav>
    );
}
 
export default Header_home;