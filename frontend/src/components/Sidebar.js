const Sidebar = () => {
    return ( 
    <aside class="sidebar">
        <div class="sidebar-header">
            <a href="#" class="sidebar-logo">Nonefolio</a>
            <div class="user-profile">
                <div class="user-avatar">АИ</div>
                <div class="user-info">
                    <h4>Алексей Иванов</h4>
                    <p>Участник</p>
                </div>
            </div>
        </div>
        <nav class="sidebar-menu">
            <p class="menu-title">Основное</p>
            <a href="/my_projects" class="menu-item active">
                <i>📋</i>
                <span>Мои проекты</span>
            </a>
            <a href="/messages" class="menu-item">
                <i>💬</i>
                <span>Сообщения</span>
            </a>
            <p class="menu-title">Портфолио</p>
            <a href="/my_works" class="menu-item">
                <i>🎨</i>
                <span>Мои работы</span>
            </a>
            <p class="menu-title">Настройки</p>
            <a href="/profile" class="menu-item">
                <i>⚙️</i>
                <span>Профиль</span>
            </a>
            <a href="/create_project" class="menu-item active">
                <i>➕</i>
                <span>Новый проект</span>
            </a>
        </nav>
    </aside> 
    );
}
 
export default Sidebar;