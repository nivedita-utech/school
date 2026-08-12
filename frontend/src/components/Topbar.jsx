import React, { useContext } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f1f3f5', padding: '8px 16px', borderRadius: '8px', width: '300px' }}>
        <Search size={18} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search..." 
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button className="btn-icon">
          <Bell size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={20} />
          </div>
          <div>
            <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.email || 'Admin User'}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{user?.schoolType === 'junior' ? 'Junior School Admin' : 'Senior School Admin'}</p>
          </div>
        </div>
        <button className="btn-icon" onClick={logout} title="Logout" style={{ marginLeft: '8px' }}>
          <LogOut size={20} color="var(--danger)" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
