import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentDashboard from "./components/StudentDashboard";
import ProfessorDashboard from "./components/ProfessorDashboard";
import AdminPanel from './components/Admin';
import AdminHome from './components/Admin/Home';
import ScheduleManagement from './components/ScheduleManagement';
import RecentAnnouncements from './components/Announcements';
import ProfessorNavBar from './components/professorNavBar';
import MarkLeave from './components/MarkLeave';
import Profile from './components/profile';
import StudentDashboard1 from './components/student/StudentDashboard';
import FirstHome from './components/firstPage/firstHome'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<FirstHome />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/add-schedule" element={<AdminPanel />} />
        <Route path="/Admin-Home" element={<AdminHome />} />
        <Route path="/Schedule" element={<ScheduleManagement />} />
        <Route path="/Announcements" element={<RecentAnnouncements />} />
        <Route path="/ProfessorNavBar" element={<ProfessorNavBar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/MarkLeave" element={<MarkLeave />} />
        <Route path="/student" element={<StudentDashboard1 />} />
      </Routes>
    </Router>
  );
}

export default App;
