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
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        {user?.role === 'admin' && (
          <>
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
          </>
        )}
        <NavLink to="/attendance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <CalendarCheck size={20} />
          <span>{user?.role === 'admin' ? 'Attendance' : 'My Attendance'}</span>
        </NavLink>
        <NavLink to="/fees" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <IndianRupee size={20} />
          <span>{user?.role === 'admin' ? 'Fees' : 'My Fees'}</span>
        </NavLink>
        <NavLink to="/exams" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <BookOpen size={20} />
          <span>{user?.role === 'admin' ? 'Exams' : 'My Exams'}</span>
        </NavLink>
        <NavLink to="/timetable" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <CalendarDays size={20} />
          <span>{user?.role === 'admin' ? 'Timetable' : 'My Timetable'}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
