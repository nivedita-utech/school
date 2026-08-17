import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(67, 97, 238, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <GraduationCap size={32} color="var(--primary-color)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Login to EduManage System</p>
        </div>

        {error && <div style={{ background: 'rgba(231, 76, 60, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input 
                type="email" 
                className="form-control" 
                style={{ paddingLeft: '40px' }}
                placeholder="junior@school.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
              <input 
                type="password" 
                className="form-control" 
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Login to Dashboard
          </button>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(67, 97, 238, 0.05)', borderRadius: '8px', border: '1px dashed rgba(67, 97, 238, 0.3)' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--primary-color)', marginBottom: '12px', textAlign: 'center' }}>Demo Credentials</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span onClick={() => {setEmail('junior@school.com'); setPassword('admin123');}} style={{ cursor: 'pointer', textDecoration: 'underline' }}><strong>Junior:</strong> junior@school.com</span>
                <span><strong>Pass:</strong> admin123</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span onClick={() => {setEmail('senior@school.com'); setPassword('admin123');}} style={{ cursor: 'pointer', textDecoration: 'underline' }}><strong>Senior:</strong> senior@school.com</span>
                <span><strong>Pass:</strong> admin123</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
