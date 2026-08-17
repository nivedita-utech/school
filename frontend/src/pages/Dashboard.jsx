import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Users, GraduationCap, Wallet, TrendingUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ students: 0, faculty: 0, salaryPaid: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role !== 'admin') return;
      try {
        const [studentRes, facultyRes, salaryRes] = await Promise.all([
          axios.get('http://localhost:5000/api/students'),
          axios.get('http://localhost:5000/api/faculty'),
          axios.get('http://localhost:5000/api/salary')
        ]);
        
        const totalSalary = salaryRes.data
          .filter(s => s.status === 'Paid')
          .reduce((sum, s) => sum + s.amount, 0);

        setStats({
          students: studentRes.data.length,
          faculty: facultyRes.data.length,
          salaryPaid: totalSalary
        });
      } catch (error) {
        console.error('Error fetching stats', error);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="page-transition">
      <h1 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>Dashboard Overview</h1>
      
      <div className="stat-grid">
        {user?.role === 'admin' && (
          <>
            <div className="card stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--primary-color)' }}>
                <Users size={24} />
              </div>
              <div className="stat-info">
                <h3>Total Students</h3>
                <p>{stats.students}</p>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--success)' }}>
                <GraduationCap size={24} />
              </div>
              <div className="stat-info">
                <h3>Total Faculty</h3>
                <p>{stats.faculty}</p>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'var(--warning)' }}>
                <Wallet size={24} />
              </div>
              <div className="stat-info">
                <h3>Total Salary Paid</h3>
                <p>₹{stats.salaryPaid.toLocaleString()}</p>
              </div>
            </div>
          </>
        )}
        <div className="card stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'var(--accent-color)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>{user?.role === 'admin' ? 'Avg Attendance' : 'My Attendance'}</h3>
            <p>94%</p>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>Welcome to EduManage</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your school's daily operations seamlessly. Navigate through the sidebar to access students, faculty, and payroll management systems.</p>
      </div>
    </div>
  );
};

export default Dashboard;
