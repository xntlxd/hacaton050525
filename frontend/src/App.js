import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import My_Projects from "./pages/My_Projects";
import My_Works from "./pages/My_Works";
import Create_Project from "./pages/Create_Project";
import "../src/style/style.css";
import ProtectedRoute from './services/ProtectedRoute';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/profile" element={
          <ProtectedRoute>
          <Profile />
          </ProtectedRoute>
          } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
          <My_Projects />
          </ProtectedRoute>
          } />
        <Route path="/create_project" element={
          <ProtectedRoute>
          <Create_Project />
          </ProtectedRoute>
          } />
        <Route path="/notifications" element={
          <ProtectedRoute>
          <Notifications />
          </ProtectedRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
