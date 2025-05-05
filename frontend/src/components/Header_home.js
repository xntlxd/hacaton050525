const Header_home = () => {
    return ( 
    <nav class="navbar">
        <a href="#" class="logo">Nonefolio</a>
        <div class="nav-links">
            <a href="#">О нас</a>
        </div>
        <div class="auth-buttons">
            <a href="/login" class="btn btn-login">Войти</a>
            <a href="/registration" class="btn btn-register">Регистрация</a>
        </div>
    </nav>
    );
}
 
export default Header_home;