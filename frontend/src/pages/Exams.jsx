import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BookOpen, Plus, Save } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Exams = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examData, setExamData] = useState({ name: '', class: '', date: '' });
  
  const [selectedExam, setSelectedExam] = useState('');
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const res = await axios.get('http://localhost:5000/api/exams');
    setExams(res.data);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/exams', examData);
      setIsModalOpen(false);
      setExamData({ name: '', class: '', date: '' });
      fetchExams();
    } catch (err) {
      alert('Error creating exam');
    }
  };

  const loadExamDetails = async (examId) => {
    setSelectedExam(examId);
    const exam = exams.find(e => e._id === examId);
    if (!exam) return;

    try {
      // Load students for this class
      const stdRes = await axios.get('http://localhost:5000/api/students');
      const classStudents = stdRes.data.filter(s => s.class === exam.class);
      setStudents(classStudents);

      // Load existing results
      const resRes = await axios.get(`http://localhost:5000/api/exams/results?exam=${examId}`);
      const resMap = {};
      resRes.data.forEach(r => {
        resMap[r.student._id || r.student] = {
          marksObtained: r.marksObtained,
          totalMarks: r.totalMarks,
          grade: r.grade
        };
      });

      // Default values
      classStudents.forEach(s => {
        if (!resMap[s._id]) {
          resMap[s._id] = { marksObtained: '', totalMarks: '100', grade: '-' };
        }
      });
      setResults(resMap);

    } catch (err) {
      console.error(err);
    }
  };

  const handleResultChange = (studentId, field, value) => {
    setResults(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const saveResults = async () => {
    if (!selectedExam) return;
    try {
      for (const studentId of Object.keys(results)) {
        const result = results[studentId];
        if (result.marksObtained !== '') {
          await axios.post('http://localhost:5000/api/exams/results', {
            exam: selectedExam,
            student: studentId,
            marksObtained: Number(result.marksObtained),
            totalMarks: Number(result.totalMarks)
          });
        }
      }
      alert('Results saved successfully!');
      loadExamDetails(selectedExam); // reload to get calculated grades
    } catch (err) {
      alert('Error saving results');
    }
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>{user?.role === 'admin' ? 'Exams & Results' : 'My Exams'}</h1>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add New Exam
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="form-group" style={{ maxWidth: '400px', marginBottom: 0 }}>
          <label>Select Exam to Enter Marks</label>
          <select className="form-control" value={selectedExam} onChange={e => loadExamDetails(e.target.value)}>
            <option value="">-- Select Exam --</option>
            {exams.map(e => (
              <option key={e._id} value={e._id}>{e.name} (Class {e.class})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedExam && (
        <div className="table-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <h3>{user?.role === 'admin' ? 'Enter Marks' : 'Exam Result'}</h3>
            {user?.role === 'admin' && (
              <button className="btn btn-primary" onClick={saveResults}>
                <Save size={18} /> Save Marks
              </button>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Class/Sec</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>{s.rollNumber}</td>
                  <td>{s.name}</td>
                  <td>{s.class}-{s.section}</td>
                  <td>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ width: '80px', padding: '4px' }}
                      value={results[s._id]?.marksObtained || ''}
                      onChange={e => handleResultChange(s._id, 'marksObtained', e.target.value)}
                      disabled={user?.role !== 'admin'}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      className="form-control" 
                      style={{ width: '80px', padding: '4px' }}
                      value={results[s._id]?.totalMarks || ''}
                      onChange={e => handleResultChange(s._id, 'totalMarks', e.target.value)}
                      disabled={user?.role !== 'admin'}
                    />
                  </td>
                  <td>
                    <span className="badge badge-success">{results[s._id]?.grade || '-'}</span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No students found in this class</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Exam</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateExam}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Exam Name (e.g., Mid-Term)</label>
                  <input type="text" className="form-control" required value={examData.name} onChange={e => setExamData({...examData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <input type="number" min="1" max="10" className="form-control" required value={examData.class} onChange={e => setExamData({...examData, class: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-control" required value={examData.date} onChange={e => setExamData({...examData, date: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
