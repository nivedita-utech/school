import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Wallet, CalendarCheck, IndianRupee, BookOpen, CalendarDays, School as SchoolIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <GraduationCap size={32} color="var(--primary-color)" />
        <h2>EduManage</h2>
      </div>
      <div className="nav-links">
        {user?.role === 'super_admin' ? (
          <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
            <SchoolIcon size={20} />
            <span>Schools Dashboard</span>
          </NavLink>
        ) : (
          <>
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/students" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Users size={20} />
              <span>Students</span>
            </NavLink>
            <NavLink to="/faculty" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <GraduationCap size={20} />
              <span>Faculty</span>
            </NavLink>
            <NavLink to="/salary" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Wallet size={20} />
              <span>Salary</span>
            </NavLink>
            <NavLink to="/attendance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <CalendarCheck size={20} />
              <span>Attendance</span>
            </NavLink>
            <NavLink to="/fees" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <IndianRupee size={20} />
              <span>Fees</span>
            </NavLink>
            <NavLink to="/exams" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <BookOpen size={20} />
              <span>Exams</span>
            </NavLink>
            <NavLink to="/timetable" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <CalendarDays size={20} />
              <span>Timetable</span>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
