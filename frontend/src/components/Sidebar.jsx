import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Wallet } from 'lucide-react';

const Sidebar = () => {
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
      </div>
    </div>
  );
};

export default Sidebar;
