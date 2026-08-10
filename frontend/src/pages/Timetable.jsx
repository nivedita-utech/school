import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarDays, Plus, Save, Edit2 } from 'lucide-react';

const Timetable = () => {
  const [classNum, setClassNum] = useState('1');
  const [section, setSection] = useState('A');
  const [timetables, setTimetables] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    periods: [{ time: '', subject: '', faculty: '' }]
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchTimetables();
  }, [classNum, section]);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchTimetables = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/timetable?class=${classNum}&section=${section}`);
      setTimetables(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFaculty = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/faculty');
      setFaculty(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (day) => {
    const existing = timetables.find(t => t.dayOfWeek === day);
    if (existing) {
      setFormData({
        dayOfWeek: day,
        periods: existing.periods.map(p => ({
          time: p.time,
          subject: p.subject,
          faculty: p.faculty._id || p.faculty
        }))
      });
    } else {
      setFormData({
        dayOfWeek: day,
        periods: [{ time: '', subject: '', faculty: '' }]
      });
    }
    setIsModalOpen(true);
  };

  const handleAddPeriod = () => {
    setFormData(prev => ({
      ...prev,
      periods: [...prev.periods, { time: '', subject: '', faculty: '' }]
    }));
  };

  const handlePeriodChange = (index, field, value) => {
    const updatedPeriods = [...formData.periods];
    updatedPeriods[index][field] = value;
    setFormData(prev => ({ ...prev, periods: updatedPeriods }));
  };

  const handleRemovePeriod = (index) => {
    const updatedPeriods = formData.periods.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, periods: updatedPeriods }));
  };

  const handleSaveTimetable = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/timetable', {
        class: classNum,
        section,
        dayOfWeek: formData.dayOfWeek,
        periods: formData.periods
      });
      setIsModalOpen(false);
      fetchTimetables();
      alert('Timetable saved successfully');
    } catch (err) {
      alert('Error saving timetable');
    }
  };

  const getDaySchedule = (day) => {
    return timetables.find(t => t.dayOfWeek === day);
  };

  return (
    <div className="page-transition">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Class Timetable</h1>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label>Class</label>
            <input type="number" min="1" max="10" className="form-control" value={classNum} onChange={e => setClassNum(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label>Section</label>
            <select className="form-control" value={section} onChange={e => setSection(e.target.value)}>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {daysOfWeek.map(day => {
          const schedule = getDaySchedule(day);
          return (
            <div key={day} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>{day}</h3>
                <button className="btn-icon" onClick={() => handleOpenModal(day)}>
                  <Edit2 size={16} />
                </button>
              </div>
              <div style={{ flex: 1 }}>
                {schedule && schedule.periods.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {schedule.periods.map((p, idx) => (
                      <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <div>
                          <strong style={{ display: 'block' }}>{p.time}</strong>
                          <span>{p.subject}</span>
                        </div>
                        <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {p.faculty ? p.faculty.name : '-'}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>
                    No schedule set
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Edit Timetable for {formData.dayOfWeek}</h3>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveTimetable}>
              <div className="modal-body">
                {formData.periods.map((period, index) => (
                  <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Time (e.g. 09:00 - 10:00)" 
                      className="form-control" 
                      required 
                      value={period.time} 
                      onChange={e => handlePeriodChange(index, 'time', e.target.value)} 
                    />
                    <input 
                      type="text" 
                      placeholder="Subject" 
                      className="form-control" 
                      required 
                      value={period.subject} 
                      onChange={e => handlePeriodChange(index, 'subject', e.target.value)} 
                    />
                    <select 
                      className="form-control" 
                      required 
                      value={period.faculty} 
                      onChange={e => handlePeriodChange(index, 'faculty', e.target.value)}
                    >
                      <option value="">Select Faculty</option>
                      {faculty.map(f => (
                        <option key={f._id} value={f._id}>{f.name} ({f.subject})</option>
                      ))}
                    </select>
                    <button type="button" className="btn-icon btn-danger" onClick={() => handleRemovePeriod(index)}>
                      &times;
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={handleAddPeriod} style={{ width: '100%', marginTop: '8px' }}>
                  <Plus size={16} /> Add Period
                </button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
