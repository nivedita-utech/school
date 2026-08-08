import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', subject: '', designation: '', contact: '', baseSalary: '' });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    const res = await axios.get('http://localhost:5000/api/faculty');
    setFaculty(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/faculty', formData);
      setIsModalOpen(false);
      setFormData({ name: '', subject: '', designation: '', contact: '', baseSalary: '' });
      fetchFaculty();
    } catch (err) {
      alert('Error saving faculty');
    }
  };

  const deleteFaculty = async (id) => {
    if(window.confirm('Are you sure?')) {
      await axios.delete(`http://localhost:5000/api/faculty/${id}`);
      fetchFaculty();
    }
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Faculty Members</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Faculty
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Designation</th>
              <th>Subject</th>
              <th>Contact</th>
              <th>Base Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map(f => (
              <tr key={f._id}>
                <td>{f.name}</td>
                <td><span className="badge badge-warning">{f.designation}</span></td>
                <td>{f.subject}</td>
                <td>{f.contact}</td>
                <td>₹{f.baseSalary}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-icon" title="Edit"><Edit2 size={16} /></button>
                    <button className="btn-icon btn-danger" onClick={() => deleteFaculty(f._id)} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {faculty.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No faculty found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Faculty</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Designation</label>
                    <input type="text" className="form-control" required value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Subject</label>
                    <input type="text" className="form-control" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Contact Number</label>
                  <input type="text" className="form-control" required value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Base Salary (₹)</label>
                  <input type="number" className="form-control" required value={formData.baseSalary} onChange={e => setFormData({...formData, baseSalary: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Faculty</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;
