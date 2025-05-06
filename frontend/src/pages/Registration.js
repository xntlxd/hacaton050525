import "../style/style.css";
import { registerUser } from "../services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      await registerUser(email, password);
      navigate("/login", { state: { registeredEmail: email } });
    } catch (err) {
      setError(err.message);
    }
  };

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
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className="form-control" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                className="form-control" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <center><button type="submit" className="btn">Зарегистрироваться</button></center>
            </div>
          </form>
        </div>
      </div>
    </div> 
  );
};
 
export default Registration;