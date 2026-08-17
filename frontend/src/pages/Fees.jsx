import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, CheckCircle, IndianRupee } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Fees = () => {
  const { user } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ student: '', amount: '', dueDate: '' });

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, []);

  const fetchFees = async () => {
    const res = await axios.get('http://localhost:5000/api/fees');
    setFees(res.data);
  };

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/students');
    setStudents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/fees', formData);
      setIsModalOpen(false);
      setFormData({ student: '', amount: '', dueDate: '' });
      fetchFees();
    } catch (err) {
      alert('Error adding fee record');
    }
  };

  const markAsPaid = async (id) => {
    if(window.confirm('Mark this fee as paid?')) {
      try {
        await axios.put(`http://localhost:5000/api/fees/${id}/pay`);
        fetchFees();
      } catch (err) {
        alert('Error updating fee status');
      }
    }
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>{user?.role === 'admin' ? 'Fee Management' : 'My Fees'}</h1>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Fee Record
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class/Sec</th>
              <th>Amount (₹)</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Receipt No.</th>
              {user?.role === 'admin' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {fees.map(f => (
              <tr key={f._id}>
                <td>{f.student ? f.student.name : 'Unknown'}</td>
                <td>{f.student ? `${f.student.class} - ${f.student.section}` : '-'}</td>
                <td><IndianRupee size={14} />{f.amount}</td>
                <td>{new Date(f.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className="badge" style={{
                    backgroundColor: f.status === 'Paid' ? '#dcfce7' : f.status === 'Overdue' ? '#fee2e2' : '#fef9c3',
                    color: f.status === 'Paid' ? '#166534' : f.status === 'Overdue' ? '#991b1b' : '#854d0e'
                  }}>
                    {f.status}
                  </span>
                </td>
                <td>{f.receiptNumber || '-'}</td>
                {user?.role === 'admin' && (
                  <td>
                    {f.status !== 'Paid' && (
                      <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => markAsPaid(f._id)}>
                        <CheckCircle size={14} style={{ marginRight: '4px' }} /> Mark Paid
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {fees.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No fee records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add Fee Record</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Select Student</label>
                  <select className="form-control" required value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})}>
                    <option value="">-- Select --</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.name} (Class {s.class} {s.section})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" className="form-control" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" className="form-control" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Fee</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;
