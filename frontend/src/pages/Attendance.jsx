import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarCheck, Users, GraduationCap, Save } from 'lucide-react';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('student');
  
  // Filters
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentClass, setStudentClass] = useState('1');
  const [section, setSection] = useState('A');
  
  // Data
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  useEffect(() => {
    if (activeTab === 'student') {
      fetchStudentAttendance();
    } else {
      fetchFacultyAttendance();
    }
  }, [activeTab, date, studentClass, section]);

  const fetchStudentAttendance = async () => {
    try {
      // First get all students for the class/section
      const stdRes = await axios.get(`http://localhost:5000/api/students`);
      const filteredStudents = stdRes.data.filter(s => s.class === Number(studentClass) && s.section === section);
      setStudents(filteredStudents);

      // Then get attendance for this date
      const attRes = await axios.get(`http://localhost:5000/api/attendance/student?date=${date}&class=${studentClass}&section=${section}`);
      
      const records = {};
      if (attRes.data.length > 0) {
        attRes.data[0].records.forEach(r => {
          records[r.student._id || r.student] = r.status;
        });
      }
      
      // Default missing to 'Present'
      filteredStudents.forEach(s => {
        if (!records[s._id]) {
          records[s._id] = 'Present';
        }
      });
      setAttendanceRecords(records);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFacultyAttendance = async () => {
    try {
      const facRes = await axios.get(`http://localhost:5000/api/faculty`);
      setFaculty(facRes.data);

      const attRes = await axios.get(`http://localhost:5000/api/attendance/faculty?date=${date}`);
      
      const records = {};
      if (attRes.data.length > 0) {
        attRes.data[0].records.forEach(r => {
          records[r.faculty._id || r.faculty] = r.status;
        });
      }
      
      facRes.data.forEach(f => {
        if (!records[f._id]) {
          records[f._id] = 'Present';
        }
      });
      setAttendanceRecords(records);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = (id, status) => {
    setAttendanceRecords(prev => ({ ...prev, [id]: status }));
  };

  const saveAttendance = async () => {
    try {
      if (activeTab === 'student') {
        const records = Object.keys(attendanceRecords).map(id => ({
          student: id,
          status: attendanceRecords[id]
        }));
        await axios.post('http://localhost:5000/api/attendance/student', {
          date, class: studentClass, section, records
        });
        alert('Student attendance saved!');
      } else {
        const records = Object.keys(attendanceRecords).map(id => ({
          faculty: id,
          status: attendanceRecords[id]
        }));
        await axios.post('http://localhost:5000/api/attendance/faculty', {
          date, records
        });
        alert('Faculty attendance saved!');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving attendance');
    }
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Attendance Management</h1>
        <button className="btn btn-primary" onClick={saveAttendance}>
          <Save size={18} /> Save Attendance
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button 
          className={`btn ${activeTab === 'student' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('student')}
          style={activeTab !== 'student' ? { backgroundColor: 'var(--bg-card)' } : {}}
        >
          <Users size={18} /> Student Attendance
        </button>
        <button 
          className={`btn ${activeTab === 'faculty' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('faculty')}
          style={activeTab !== 'faculty' ? { backgroundColor: 'var(--bg-card)' } : {}}
        >
          <GraduationCap size={18} /> Faculty Attendance
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Date</label>
            <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          
          {activeTab === 'student' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Class</label>
                <input type="number" min="1" max="10" className="form-control" value={studentClass} onChange={e => setStudentClass(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Section</label>
                <select className="form-control" value={section} onChange={e => setSection(e.target.value)}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {activeTab === 'student' ? (
                <>
                  <th>Roll No</th>
                  <th>Student Name</th>
                </>
              ) : (
                <>
                  <th>Subject</th>
                  <th>Faculty Name</th>
                </>
              )}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'student' ? students : faculty).map(item => (
              <tr key={item._id}>
                {activeTab === 'student' ? (
                  <>
                    <td>{item.rollNumber}</td>
                    <td>{item.name}</td>
                  </>
                ) : (
                  <>
                    <td>{item.subject}</td>
                    <td>{item.name}</td>
                  </>
                )}
                <td>
                  <select 
                    className="form-control" 
                    style={{ width: 'auto', 
                      backgroundColor: attendanceRecords[item._id] === 'Present' ? '#dcfce7' : 
                                       attendanceRecords[item._id] === 'Absent' ? '#fee2e2' : 
                                       attendanceRecords[item._id] === 'Late' ? '#fef9c3' : '#e0e7ff',
                      color: attendanceRecords[item._id] === 'Present' ? '#166534' : 
                             attendanceRecords[item._id] === 'Absent' ? '#991b1b' : 
                             attendanceRecords[item._id] === 'Late' ? '#854d0e' : '#3730a3',
                      borderColor: 'transparent'
                    }}
                    value={attendanceRecords[item._id] || 'Present'}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Half-day">Half-day</option>
                  </select>
                </td>
              </tr>
            ))}
            {(activeTab === 'student' ? students : faculty).length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No records found for the selected criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
