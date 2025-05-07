import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import My_Projects from "./pages/My_Projects";
import ProjectView from './pages/ProjectView';
import Create_Project from "./pages/Create_Project";
import "../src/style/style.css";
import ProtectedRoute from './services/ProtectedRoute';
import Notifications from './pages/Notifications';
import { useParams } from 'react-router-dom';
import Card from './pages/Card';

function App() {
  const ProjectPage = () => {
    const { projectId } = useParams();
    return <ProjectView projectId={parseInt(projectId)} />;
  };
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
        <Route path="/project/:projectId" element={<ProjectPage />} />
        <Route path="/projects/:projectId/tasks" element={
          <ProtectedRoute>
            <Card />
          </ProtectedRoute>
        } />
        <Route path="/project/:projectId/cards" element={
          <ProtectedRoute>
            <Card />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;