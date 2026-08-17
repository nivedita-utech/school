import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Students = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', class: '', section: 'A', rollNumber: '', parentContact: '', studentEmail: '', studentPassword: '', parentEmail: '', parentPassword: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/students');
    setStudents(res.data);
  };

  const openAddModal = () => {
    setFormData({ name: '', age: '', class: '', section: 'A', rollNumber: '', parentContact: '', studentEmail: '', studentPassword: '', parentEmail: '', parentPassword: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setFormData({ 
      name: student.name, 
      age: student.age, 
      class: student.class, 
      section: student.section || 'A', 
      rollNumber: student.rollNumber, 
      parentContact: student.parentContact, 
      studentEmail: student.studentEmail || '', 
      studentPassword: '', 
      parentEmail: student.parentEmail || '', 
      parentPassword: '' 
    });
    setEditingId(student._id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/students/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/students', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', age: '', class: '', section: 'A', rollNumber: '', parentContact: '', studentEmail: '', studentPassword: '', parentEmail: '', parentPassword: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      alert('Error saving student');
    }
  };

  const deleteStudent = async (id) => {
    if(window.confirm('Are you sure?')) {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    }
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Students Directory</h1>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Student
          </button>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Age</th>
              <th>Contact</th>
              {user?.role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td>{s.rollNumber}</td>
                <td>{s.name}</td>
                <td><span className="badge badge-success">Class {s.class}</span></td>
                <td><span className="badge" style={{backgroundColor: 'var(--primary-color)'}}>{s.section || 'A'}</span></td>
                <td>{s.age}</td>
                <td>{s.parentContact}</td>
                {user?.role === 'admin' && (
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-icon" title="Edit" onClick={() => openEditModal(s)}><Edit2 size={16} /></button>
                      <button className="btn-icon btn-danger" onClick={() => deleteStudent(s._id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No students found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Student' : 'Add New Student'}</h3>
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
                    <label>Age</label>
                    <input type="number" className="form-control" required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Class (1-10)</label>
                    <input type="number" min="1" max="10" className="form-control" required value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Section</label>
                    <select className="form-control" required value={formData.section} onChange={e => setFormData({...formData, section: e.target.value})}>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Roll Number</label>
                    <input type="text" className="form-control" required value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Parent Contact Phone</label>
                    <input type="text" className="form-control" required value={formData.parentContact} onChange={e => setFormData({...formData, parentContact: e.target.value})} />
                  </div>
                </div>
                
                <h4 style={{marginTop: '16px', marginBottom: '8px', fontSize: '1rem', color: 'var(--text-color)'}}>Student Login Setup</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Student Email ID</label>
                    <input type="email" className="form-control" placeholder="student@school.com" value={formData.studentEmail} onChange={e => setFormData({...formData, studentEmail: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Student Password</label>
                    <input type="password" className="form-control" placeholder="Minimum 6 chars" value={formData.studentPassword} onChange={e => setFormData({...formData, studentPassword: e.target.value})} />
                  </div>
                </div>

                <h4 style={{marginTop: '16px', marginBottom: '8px', fontSize: '1rem', color: 'var(--text-color)'}}>Parent Login Setup</h4>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Parent Email ID</label>
                    <input type="email" className="form-control" placeholder="parent@mail.com" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Parent Password</label>
                    <input type="password" className="form-control" placeholder="Minimum 6 chars" value={formData.parentPassword} onChange={e => setFormData({...formData, parentPassword: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update Student' : 'Save Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
