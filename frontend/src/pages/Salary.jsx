import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, CheckCircle } from 'lucide-react';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ facultyId: '', amount: '', month: '', status: 'Paid' });

  useEffect(() => {
    fetchSalaries();
    fetchFaculty();
  }, []);

  const fetchSalaries = async () => {
    const res = await axios.get('http://localhost:5000/api/salary');
    setSalaries(res.data);
  };

  const fetchFaculty = async () => {
    const res = await axios.get('http://localhost:5000/api/faculty');
    setFaculty(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/salary', formData);
      setIsModalOpen(false);
      setFormData({ facultyId: '', amount: '', month: '', status: 'Paid' });
      fetchSalaries();
    } catch (err) {
      alert('Error saving salary record');
    }
  };

  const markPaid = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/salary/${id}`, { status: 'Paid' });
      fetchSalaries();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Salary Processing</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Process Salary
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Designation</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map(s => (
              <tr key={s._id}>
                <td>{s.facultyId?.name}</td>
                <td>{s.facultyId?.designation}</td>
                <td>{s.month}</td>
                <td>₹{s.amount}</td>
                <td>
                  <span className={`badge ${s.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  {s.status !== 'Paid' && (
                    <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => markPaid(s._id)}>
                      <CheckCircle size={14} /> Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {salaries.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No salary records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Process New Salary</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Faculty</label>
                  <select 
                    className="form-control" 
                    required 
                    value={formData.facultyId} 
                    onChange={e => {
                      const selected = faculty.find(f => f._id === e.target.value);
                      setFormData({...formData, facultyId: e.target.value, amount: selected ? selected.baseSalary : ''});
                    }}
                  >
                    <option value="">-- Select --</option>
                    {faculty.map(f => (
                      <option key={f._id} value={f._id}>{f.name} ({f.designation})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Month (e.g., Aug 2026)</label>
                    <input type="text" className="form-control" required value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Amount (₹)</label>
                    <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;
