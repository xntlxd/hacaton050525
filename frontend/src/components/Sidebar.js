const Sidebar = () => {
    return ( 
    <aside className="sidebar">
        <div className="sidebar-header">
            <a href="#" className="sidebar-logo">Nonefolio</a>
            <div className="user-profile">
                <div className="user-avatar">АИ</div>
                <div className="user-info">
                    <h4>Алексей Иванов</h4>
                    <p>Участник</p>
                </div>
            </div>
        </div>
        <nav className="sidebar-menu">
            <p className="menu-title">Основное</p>
            <a href="/my_projects" className="menu-item">
                <i>📋</i>
                <span>Мои проекты</span>
            </a>
            <a href="/messages" className="menu-item">
                <i>💬</i>
                <span>Сообщения</span>
            </a>
            <p className="menu-title">Портфолио</p>
            <a href="/my_works" className="menu-item">
                <i>🎨</i>
                <span>Мои работы</span>
            </a>
            <p className="menu-title">Настройки</p>
            <a href="/profile" className="menu-item">
                <i>⚙️</i>
                <span>Профиль</span>
            </a>
            <a href="/create_project" className="menu-item">
                <i>➕</i>
                <span>Новый проект</span>
            </a>
        </nav>
    </aside> 
    );
}
 
export default Sidebar;