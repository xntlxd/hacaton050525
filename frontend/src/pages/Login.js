import "../style/style.css";
import { loginUser } from "../services/api";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await loginUser(email, password);
      
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("userData", JSON.stringify(response.data.userdata));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

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
};
 
export default Login;