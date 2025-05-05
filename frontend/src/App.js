import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import My_Projects from "./pages/My_Projects";
import My_Works from "./pages/My_Works";
import Create_Project from "./pages/Create_Project";
import "../src/style/style.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my_projects" element={<My_Projects />} />
        <Route path="/my_works" element={<My_Works />} />
        <Route path="/create_project" element={<Create_Project />} />
      </Routes>
    </Router>
  );
}

export default App;
